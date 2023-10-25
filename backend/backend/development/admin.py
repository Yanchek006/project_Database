from django.contrib import admin

from development.models import (
    Development,
    Documentation,
)

models = [
    Development,
    Documentation,
]

for model in models:
    admin.site.register(model)
