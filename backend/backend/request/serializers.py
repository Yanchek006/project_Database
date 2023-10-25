from rest_framework.serializers import ModelSerializer

from customer.serializers import CustomerSerializer
from employee.serializers import EmployeeSerializer
from request.models import PriceList, Request, State


class PriceListSerializer(ModelSerializer):
    class Meta:
        model = PriceList
        fields = '__all__'


class StateSerializer(ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'


class RequestSerializer(ModelSerializer):
    state = StateSerializer()
    customer = CustomerSerializer()
    manager = EmployeeSerializer()
    price_list = PriceListSerializer()

    class Meta:
        ref_name = "RequestRequest"
        model = Request
        fields = '__all__'


class RequestCreateSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = ['description', 'price_list']


class RequestUpdateStateSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = [
            'state',
        ]
