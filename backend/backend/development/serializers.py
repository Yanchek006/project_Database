from rest_framework.serializers import ModelSerializer, Serializer, IntegerField

from development.models import Development, Documentation
from employee.serializers import EmployeeListSerializer
from request.models import Request
from request.serializers import StateSerializer


class RequestSerializer(ModelSerializer):

    class Meta:
        ref_name = "DevelopmentRequest"
        model = Request
        fields = '__all__'


class DevelopmentSerializer(ModelSerializer):
    request = RequestSerializer()
    state = StateSerializer()

    class Meta:
        model = Development
        fields = '__all__'


class EmployeeDevelopmentSerializer(Serializer):
    id = IntegerField()


class DocumentationSerializer(ModelSerializer):
    state = StateSerializer()
    employees = EmployeeListSerializer(many=True, read_only=True)

    class Meta:
        model = Documentation
        fields = '__all__'


class DevelopmentDetailSerializer(ModelSerializer):
    state = StateSerializer()
    request = RequestSerializer()
    documentations = DocumentationSerializer(many=True, read_only=True)
    employees = EmployeeListSerializer(many=True, read_only=True)

    class Meta:
        model = Development
        fields = '__all__'


class CreateDocumentationSerializer(ModelSerializer):
    class Meta:
        model = Documentation
        fields = (
            'development',
            'text',
        )
