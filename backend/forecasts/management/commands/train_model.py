from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError

from forecasts.model_training import train_model


class Command(BaseCommand):
    help = "Обучает модель на разрешённых вопросах или на синтетических примерах."

    def add_arguments(self, parser):
        parser.add_argument("--demo", action="store_true", help="Обучить на искусственных данных для показа.")

    def handle(self, *args, **options):
        try:
            result = train_model(demo=options["demo"])
        except ValidationError as error:
            raise CommandError(error.message) from error
        self.stdout.write(f'Модель {result["version"]}. Примеров: {result["count"]}.')
        metrics = result["metrics"]
        if metrics:
            self.stdout.write(
                f'Проверка на более поздних вопросах ({metrics["count"]}). '
                f'Средний Брайер модели: {metrics["model"]:.4f}, группы: {metrics["crowd"]:.4f}.'
            )
        else:
            self.stdout.write("Для проверки на более поздних вопросах пока мало ранних данных.")
