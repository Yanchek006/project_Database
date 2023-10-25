from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from customer.serializers import UserSerializer
from development.models import Documentation
from employee.models import Employee, Position, Departament, LevelPosition


class EmployeeSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        employee = Employee.objects.create(user=user, **validated_data)
        return employee

    def update(self, instance, validated_data):
        instance.salary = validated_data.get('salary', instance.salary)

        user_data = validated_data.get('user', {})
        user = instance.user

        new_username = user_data.get('username')
        if new_username and new_username != user.username:
            if User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                raise serializers.ValidationError({'user': {'username': 'A user with that username already exists.'}})
            user.username = new_username

        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)

        instance: Employee
        instance.position = validated_data.get('position', instance.position)
        instance.level_position = validated_data.get('level_position', instance.level_position)
        instance.departament = validated_data.get('departament', instance.departament)

        user.save()
        instance.save()
        return instance


class PositionSerializer(ModelSerializer):
    class Meta:
        model = Position
        fields = '__all__'


class DepartamentSerializer(ModelSerializer):
    class Meta:
        model = Departament
        fields = '__all__'


class LevelPositionSerializer(ModelSerializer):
    class Meta:
        model = LevelPosition
        fields = '__all__'


class EmployeeListSerializer(ModelSerializer):
    user = UserSerializer()
    departament = DepartamentSerializer()
    position = PositionSerializer()
    level_position = LevelPositionSerializer()

    class Meta:
        model = Employee
        fields = '__all__'


class DocumentationSmallSerializer(ModelSerializer):
    class Meta:
        model = Documentation
        fields = (
            'text',
        )
