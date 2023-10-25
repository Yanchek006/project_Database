from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from customer.models import Customer


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'password',
        )

        extra_kwargs = {
            'username': {
                'required': False,
            },

            'first_name': {
                'required': True,
            },

            'last_name': {
                'required': True,
            },

            'email': {
                'required': True,
            },

            'password': {
                'required': False,
                'write_only': True,
            },

            'is_active': {
                'read_only': True,
            },

            'id': {
                'read_only': True,
            },
        }

    def create(self, validated_data):

        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        try:
            validate_password(password=validated_data['password'], user=user)
            user.save()

        except ValidationError as exception:
            raise serializers.ValidationError(
                {'password': [except_ for except_ in exception]}
            )
        return user


class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Customer
        fields = (
            'user',
            'bank_account',
        )
        extra_kwargs = {
            'user': {
                'required': True,
            },
            'bank_account': {
                'required': True,
            },
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        customer = Customer.objects.create(user=user, **validated_data)
        return customer
