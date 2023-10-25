from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from customer.models import Customer
from customer.serializers import CustomerSerializer


class CustomerRegisterView(CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = (AllowAny,)
