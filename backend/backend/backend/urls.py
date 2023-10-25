from django.contrib import admin
from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from backend.yasg import urlpatterns as doc_urls
from customer.views import CustomerRegisterView
from development.views import DevelopmentListAPIView, AttachEmployeeToDevelopment, LeaveEmployeeToDevelopment, \
    DevelopmentRetrieveUpdateDestroyAPIView, LeaveEmployeeToDocumentation, AttachEmployeeToDocumentation, \
    DocumentationRetrieveUpdateDestroyAPIView, DocumentationCreateAPIView
from employee.views import GetUserByToken, PositionCreateAPIView, PositionListAPIView, \
    DepartamentListAPIView, LevelPositionListAPIView, EmployeeListAPIView, LevelPositionCreateAPIView, \
    DepartamentCreateAPIView, EmployeeCreateAPIView, DepartamentDestroyAPIView, LevelPositionDestroyAPIView, \
    EmployeeDestroyAPIView, PositionDestroyAPIView
from request.views import PriceListListAPIView, RequestListAPIView, RequestCreateAPIView, StateListAPIView, \
    StateCreateAPIView, PriceListAPIView, StateDestroyAPIView, PriceListDestroyAPIView, RequestUpdateAPIView

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/customer/register/', CustomerRegisterView.as_view(), name='register_user'),
    path('api/user/who/', GetUserByToken.as_view(), name='get_user_by_token'),
    path('api/priceList/', PriceListListAPIView.as_view(), name='price_list'),
    path('api/request/', RequestListAPIView.as_view(), name='request_list'),
    path('api/request/create/', RequestCreateAPIView.as_view(), name='request_create'),
    path('api/position/create/', PositionCreateAPIView.as_view(), name='position_create'),

    path('api/position/', PositionListAPIView.as_view(), name='position'),
    path('api/department/', DepartamentListAPIView.as_view(), name='department'),
    path('api/levelPosition/', LevelPositionListAPIView.as_view(), name='level_position'),
    path('api/state/', StateListAPIView.as_view(), name='state_position'),
    path('api/employee/', EmployeeListAPIView.as_view(), name='employee'),

    path('api/levelPosition/create/', LevelPositionCreateAPIView.as_view(), name='level_position_create'),
    path('api/department/create/', DepartamentCreateAPIView.as_view(), name='department_create'),
    path('api/state/create/', StateCreateAPIView.as_view(), name='state_create'),
    path('api/priceList/create/', PriceListAPIView.as_view(), name='price_list_create'),
    path('api/employee/create/', EmployeeCreateAPIView.as_view(), name='employee_list_create'),
    path('api/documentation/create/', DocumentationCreateAPIView.as_view(), name='documentation_create'),

    path('api/state/<int:pk>/', StateDestroyAPIView.as_view(), name='state_destroy'),
    path('api/priceList/<int:pk>/', PriceListDestroyAPIView.as_view(), name='price_list_destroy'),
    path('api/department/<int:pk>/', DepartamentDestroyAPIView.as_view(), name='department_destroy'),
    path('api/levelPosition/<int:pk>/', LevelPositionDestroyAPIView.as_view(), name='level_position_destroy'),
    path('api/position/<int:pk>/', PositionDestroyAPIView.as_view(), name='position_destroy'),
    path('api/employee/<int:pk>/', EmployeeDestroyAPIView.as_view(), name='employee_destroy'),

    path('api/development/', DevelopmentListAPIView.as_view(), name='development_list'),
    path('api/development/attach/employee/', AttachEmployeeToDevelopment.as_view(), name='development_attach_employee'),
    path('api/development/leave/employee/', LeaveEmployeeToDevelopment.as_view(), name='development_leave_employee'),

    path('api/development/<int:pk>/', DevelopmentRetrieveUpdateDestroyAPIView.as_view(), name='development_retrieve'),

    path('api/documentation/attach/employee/', AttachEmployeeToDocumentation.as_view(), name='documentation_attach_employee'),
    path('api/documentation/leave/employee/', LeaveEmployeeToDocumentation.as_view(), name='documentation_leave_employee'),

    path('api/documentation/<int:pk>/', DocumentationRetrieveUpdateDestroyAPIView.as_view(), name='documentation_update'),


    path('api/request/state/<int:pk>/', RequestUpdateAPIView.as_view(), name='documentation_update'),
]

urlpatterns += doc_urls