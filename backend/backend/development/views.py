from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from development.models import Development, Documentation
from development.serializers import DevelopmentSerializer, EmployeeDevelopmentSerializer, DevelopmentDetailSerializer, \
    DocumentationSerializer, CreateDocumentationSerializer
from employee.models import Employee
from employee.serializers import DocumentationSmallSerializer
from request.models import State
from request.signals import DefaultState


class DevelopmentListAPIView(ListAPIView):
    serializer_class = DevelopmentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        my = self.request.query_params.get('my', None)
        user = self.request.user

        if my is not None and my.lower() == 'true':
            try:
                return Development.objects.filter(employees=user.employee)
            except Exception as exception:
                exception.__str__()
        elif my is not None and my.lower() == 'false':
            try:
                return Development.objects.exclude(employees=user.employee)
            except Exception as exception:
                exception.__str__()
        else:
            return Development.objects.all()


class AttachEmployeeToDevelopment(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = EmployeeDevelopmentSerializer(data=request.data)

        if serializer.is_valid():
            development_id = serializer.validated_data['id']

            try:
                user = request.user
                employee = user.employee
                development = Development.objects.get(id=development_id)

                development.employees.add(employee)
                development_serializer = DevelopmentSerializer(development)
                return Response(development_serializer.data, status=status.HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response({'error': 'Employee dont found'}, status=status.HTTP_404_NOT_FOUND)
            except Development.DoesNotExist:
                return Response({'error': 'Development dont found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LeaveEmployeeToDevelopment(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = EmployeeDevelopmentSerializer(data=request.data)

        if serializer.is_valid():
            development_id = serializer.validated_data['id']

            try:
                user = request.user
                employee = user.employee
                development = Development.objects.get(id=development_id)

                development.employees.remove(employee)
                development_serializer = DevelopmentSerializer(development)
                return Response(development_serializer.data, status=status.HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response({'error': 'Employee dont found'}, status=status.HTTP_404_NOT_FOUND)
            except Development.DoesNotExist:
                return Response({'error': 'Development dont found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DevelopmentRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Development.objects.all()
    serializer_class = DevelopmentDetailSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        my = self.request.query_params.get('my', None)
        user = self.request.user
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data
        try:
            employee = user.employee
            if my is not None:
                my_documentations = instance.documentations.filter(employees=employee).values_list('id', flat=True)
                serialized_data["my_documentations"] = my_documentations
        except Exception as exception:
            exception.__str__()

        return Response(serialized_data)


class AttachEmployeeToDocumentation(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = EmployeeDevelopmentSerializer(data=request.data)

        if serializer.is_valid():
            documentation_id = serializer.validated_data['id']

            try:
                user = request.user
                employee = user.employee
                documentation = Documentation.objects.get(id=documentation_id)

                documentation.employees.add(employee)
                documentation_serializer = DocumentationSerializer(documentation)
                return Response(documentation_serializer.data, status=status.HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response({'error': 'Employee dont found'}, status=status.HTTP_404_NOT_FOUND)
            except Development.DoesNotExist:
                return Response({'error': 'Development dont found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LeaveEmployeeToDocumentation(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = EmployeeDevelopmentSerializer(data=request.data)

        if serializer.is_valid():
            documentation_id = serializer.validated_data['id']

            try:
                user = request.user
                employee = user.employee
                documentation = Documentation.objects.get(id=documentation_id)

                documentation.employees.remove(employee)
                documentation_serializer = DocumentationSerializer(documentation)
                return Response(documentation_serializer.data, status=status.HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response({'error': 'Employee dont found'}, status=status.HTTP_404_NOT_FOUND)
            except Development.DoesNotExist:
                return Response({'error': 'Development dont found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentationRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Documentation.objects.all()
    serializer_class = DocumentationSmallSerializer
    permission_classes = (IsAuthenticated,)


class DocumentationCreateAPIView(CreateAPIView):
    queryset = Documentation.objects.all()
    serializer_class = CreateDocumentationSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        state = State.objects.get(name=DefaultState.create)
        employee = self.request.user.employee

        validated_data = serializer.validated_data
        validated_data['employees'] = [employee]
        validated_data['state'] = state

        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = serializer.instance
        serialized_data = DocumentationSerializer(instance)
        return Response(serialized_data.data)
