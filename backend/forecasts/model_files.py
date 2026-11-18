import logging
import os
import pickle
from datetime import UTC
from functools import lru_cache
from pathlib import Path
from tempfile import NamedTemporaryFile

import joblib
from django.utils import timezone


logger = logging.getLogger(__name__)
DEFAULT_MODEL_DIR = Path(__file__).resolve().parents[1] / ".ml-models"


def model_directory():
    return Path(os.environ.get("BRIER_MODEL_DIR", DEFAULT_MODEL_DIR))


def version_timestamp(moment):
    return moment.astimezone(UTC).strftime("%Y%m%d%H%M%S%f")


def store_model(pipeline, *, demo):
    kind = "demo" if demo else "real"
    directory = model_directory()
    directory.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile(dir=directory, prefix=".training-", suffix=".joblib", delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        joblib.dump(pipeline, temporary_path)
        version = f"{kind}-{version_timestamp(timezone.now())}"
        temporary_path.replace(directory / f"{version}.joblib")
    finally:
        temporary_path.unlink(missing_ok=True)
    return version


def model_for_deadline(deadline):
    cutoff = version_timestamp(deadline)
    # Используются файлы, созданные локальной командой обучения «Брайера».
    # Старые версии нужны, если команда закрытия обработает срок с задержкой.
    for kind in ("real", "demo"):
        candidates = model_directory().glob(f"{kind}-*.joblib")
        for path in sorted(candidates, reverse=True):
            if path.stem.split("-", 1)[1] > cutoff:
                continue
            try:
                return path.stem, load_model(path)
            except (OSError, ValueError, EOFError, ImportError, AttributeError, pickle.UnpicklingError):
                logger.warning("Не удалось прочитать версию модели %s", path.stem, exc_info=True)
    return None


@lru_cache(maxsize=4)
def load_model(path):
    return joblib.load(path)
