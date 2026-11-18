from time import sleep

from django.core.management.base import BaseCommand

from forecasts.model_predictions import close_due_questions


class Command(BaseCommand):
    help = "Закрывает вопросы по сроку и фиксирует прогноз модели."

    def add_arguments(self, parser):
        parser.add_argument("--watch", action="store_true", help="Проверять сроки каждые пять секунд.")

    def handle(self, *args, **options):
        try:
            while True:
                count = close_due_questions()
                if count or not options["watch"]:
                    self.stdout.write(f"Закрыто вопросов: {count}")
                if not options["watch"]:
                    return
                sleep(5)
        except KeyboardInterrupt:
            self.stdout.write("Проверка сроков остановлена.")
