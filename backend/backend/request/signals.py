import dataclasses

from django.db.models.signals import post_migrate
from django.dispatch import receiver

from request.models import State, PriceList


@dataclasses.dataclass
class PriceListClass(object):
    name: str
    price: int


class DefaultState(object):
    create = 'Создана'
    develop = 'В разработке'
    finish = 'Завершена'


states = [
    value for key, value in DefaultState.__dict__.items()
    if not key.startswith("__") and isinstance(value, str)
]

default_price_list = [
    PriceListClass(name="Сайт (только frontend)", price=100_000),
    PriceListClass(name="Сайт (frontend & backend)", price=250_000),
    PriceListClass(name="Игра (unity)", price=50_000),
    PriceListClass(name="Игра (unreal engine)", price=350_000),
]


@receiver(post_migrate)
def create_default_states(sender, **kwargs):
    for state in states:
        if not State.objects.filter(name=state).exists():
            State.objects.create(name=state)


@receiver(post_migrate)
def create_default_price_list(sender, **kwargs):
    for priceList in default_price_list:
        if not PriceList.objects.filter(name=priceList.name, price=priceList.price).exists():
            PriceList.objects.create(name=priceList.name, price=priceList.price)
