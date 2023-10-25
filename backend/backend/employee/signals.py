import dataclasses

from django.contrib.auth.models import User
from django.db.models.signals import post_migrate
from django.dispatch import receiver

from employee.models import Position, Departament, LevelPosition, Employee


@dataclasses.dataclass
class DepartamentClass(object):
    name: str
    address: str


@dataclasses.dataclass
class LevelPositionClass(object):
    name: str
    coefficient_salary: float


class DefaultPosition(object):
    manager = 'Менеджер'
    developer = 'Разработчик'


positions = [
    value for key, value in DefaultPosition.__dict__.items()
    if not key.startswith("__") and isinstance(value, str)
]

default_departments = [
    DepartamentClass(name="Центральный отдел на Остоженка", address="ул. Остоженка, 93, Москва, 123702"),
    DepartamentClass(name="Офис на Монетчиковской", address="Монетчиковский пер., 97, Москва, 174592"),
    DepartamentClass(name="Офис на Хрущевской", address="Хрущевский пер., 30, Москва, 133752"),
]

default_level_position = [
    LevelPositionClass(name="Junior", coefficient_salary=1.0),
    LevelPositionClass(name="Middle", coefficient_salary=1.5),
    LevelPositionClass(name="Senior", coefficient_salary=2.0),
]


@receiver(post_migrate)
def create_default_position(sender, **kwargs):
    for position in positions:
        if not Position.objects.filter(name=position).exists():
            Position.objects.create(name=position)


@receiver(post_migrate)
def create_default_departments(sender, **kwargs):
    for department in default_departments:
        if not Departament.objects.filter(name=department.name, address=department.address).exists():
            Departament.objects.create(name=department.name, address=department.address)


@receiver(post_migrate)
def create_default_level_position(sender, **kwargs):
    for level_position in default_level_position:
        if not LevelPosition.objects.filter(name=level_position.name,
                                            coefficient_salary=level_position.coefficient_salary).exists():
            LevelPosition.objects.create(name=level_position.name, coefficient_salary=level_position.coefficient_salary)


class DefaultUser(object):
    username = 'andrey'
    first_name = 'Андрей'
    last_name = 'Глухов'
    email = 'gluhov@mail.ru'
    password = 'testpassword'


@receiver(post_migrate)
def create_default_employee(sender, **kwargs):
    if not User.objects.filter(username=DefaultUser.username).exists():
        user = User.objects.create(
            username=DefaultUser.username,
            first_name=DefaultUser.first_name,
            last_name=DefaultUser.last_name,
            email=DefaultUser.email,
        )
        user.set_password(DefaultUser.password)
    else:
        user = User.objects.get(username=DefaultUser.username)

    try:
        Employee.objects.get(user=user)
    except Exception as exception:
        exception.__str__()
        Employee.objects.create(
            user=user,
            departament=Departament.objects.get(
                name=default_departments[-1].name,
                address=default_departments[-1].address
            ),
            position=Position.objects.get(
                name=DefaultPosition.manager,
            ),
            level_position=LevelPosition.objects.get(
                name=default_level_position[-1].name,
                coefficient_salary=default_level_position[-1].coefficient_salary
            ),
            salary=200_000,
        )
