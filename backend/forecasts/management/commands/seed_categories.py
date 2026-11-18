from django.core.management.base import BaseCommand

from forecasts.models import Category


CATEGORIES = [
    ("study", "Учёба"),
    ("technology", "Технологии"),
    ("weather", "Погода"),
    ("economy", "Экономика"),
    ("movies-and-games", "Кино и игры"),
    ("sports", "Спорт"),
]


class Command(BaseCommand):
    help = "Добавляет категории из макета, сохраняя изменения администратора."

    def handle(self, *args, **options):
        created_count = 0
        for slug, name in CATEGORIES:
            if Category.objects.filter(name=name).exists():
                continue
            _, created = Category.objects.get_or_create(
                slug=slug, defaults={"name": name},
            )
            if created:
                created_count += 1
        self.stdout.write(f"Добавлено категорий: {created_count}")
