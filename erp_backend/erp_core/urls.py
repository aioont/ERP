# erp_core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, QuoteViewSet, CustomerViewSet, 
    ProjectViewSet, ServiceRequestViewSet, SalesPersonViewSet, 
    InvoiceViewSet, InvoiceItemViewSet, UserProfileViewSet, 
    LoginLogViewSet, UserRegisterView, UserLoginView, UserLogoutView
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'quotes', QuoteViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'service-requests', ServiceRequestViewSet)
router.register(r'salespersons', SalesPersonViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'invoice-items', InvoiceItemViewSet)
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'login-logs', LoginLogViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Ensure this is empty to avoid doubling 'api/'
    path('register/', UserRegisterView.as_view(), name='register'),  # User registration
    path('login/', UserLoginView.as_view(), name='login'),          # User login
    path('logout/', UserLogoutView.as_view(), name='logout'),  # Add this line

]
