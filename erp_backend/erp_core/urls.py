from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, InvoiceViewSet, QuoteViewSet, UserView, UserProfileViewSet

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'quotes', QuoteViewSet, basename='quote')
router.register(r'user-profile', UserProfileViewSet, basename='user-profile')


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserView.as_view(), name='user'),
    path('', include(router.urls)),  # Include the router URLs
]