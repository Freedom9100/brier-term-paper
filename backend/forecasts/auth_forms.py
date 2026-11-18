from django import forms
from django.contrib.auth import get_user_model, password_validation


User = get_user_model()


class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=150)
    email = forms.EmailField(max_length=254)
    password = forms.CharField(strip=False, max_length=128)
    password_confirmation = forms.CharField(strip=False, max_length=128)

    def clean_username(self):
        username = self.cleaned_data["username"]
        letters_and_digits = username.replace(".", "").replace("_", "")
        if not letters_and_digits.isascii() or not letters_and_digits.isalnum():
            raise forms.ValidationError(
                "Имя пользователя может содержать латинские буквы, цифры, точку "
                "и подчёркивание. Укажите хотя бы одну букву или цифру."
            )
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Это имя пользователя уже занято.")
        return username

    def clean(self):
        data = super().clean()
        password = data.get("password")
        confirmation = data.get("password_confirmation")
        if password and confirmation and password != confirmation:
            self.add_error("password_confirmation", "Пароли не совпадают.")
        if password:
            user = User(username=data.get("username", ""), email=data.get("email", ""))
            try:
                password_validation.validate_password(password, user)
            except forms.ValidationError as error:
                self.add_error("password", error)
        return data
