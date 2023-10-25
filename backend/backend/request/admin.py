from django import forms
from django.contrib import admin

from employee.signals import DefaultPosition
from request.models import (
    State,
    PriceList,
    Request,
)

models = [
    State,
    PriceList,
]

for model in models:
    admin.site.register(model)


class RequestAdminForm(forms.ModelForm):
    class Meta:
        model = Request
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['manager'].queryset = self.fields['manager'].queryset.filter(
            position__name=DefaultPosition.manager,
        )


class RequestAdmin(admin.ModelAdmin):
    form = RequestAdminForm


admin.site.register(Request, RequestAdmin)
