from random import choice

from django.utils import timezone
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView, \
    UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from development.models import Development
from employee.models import Employee
from employee.signals import DefaultPosition
from request.models import PriceList, Request, State
from request.serializers import PriceListSerializer, RequestSerializer, RequestCreateSerializer, StateSerializer, \
    RequestUpdateStateSerializer
from request.signals import DefaultState


class PriceListListAPIView(ListAPIView):
    queryset = PriceList.objects.all().order_by('pk')
    serializer_class = PriceListSerializer
    permission_classes = (AllowAny,)


class StateListAPIView(ListAPIView):
    queryset = State.objects.all().order_by('pk')
    serializer_class = StateSerializer
    permission_classes = (IsAuthenticated,)


class RequestListAPIView(ListAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = []
        try:
            queryset = Request.objects.filter(customer=user.customer)
        except Exception as exception:
            exception.__str__()

        try:
            queryset = Request.objects.filter(manager=user.employee)
        except Exception as exception:
            exception.__str__()

        return queryset


class RequestCreateAPIView(CreateAPIView):
    serializer_class = RequestCreateSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        state = State.objects.get(name=DefaultState.create)
        random_manager = choice(Employee.objects.filter(position__name=DefaultPosition.manager))
        customer = self.request.user.customer

        request_instance = serializer.save(
            state=state,
            manager=random_manager,
            customer=customer
        )

        Development.objects.create(
            request=request_instance,
            state=state,
            start_time=timezone.now(),
            last_change=timezone.now(),
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = serializer.instance
        serialized_data = RequestSerializer(instance)
        return Response(serialized_data.data)


class StateCreateAPIView(CreateAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


class PriceListAPIView(CreateAPIView):
    queryset = PriceList.objects.all()
    serializer_class = PriceListSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


class StateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


class PriceListDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = PriceList.objects.all()
    serializer_class = PriceListSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


class RequestUpdateAPIView(UpdateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestUpdateStateSerializer
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(RequestSerializer(instance).data)
