from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import (
    Company, Quote, Customer, Project, ServiceRequest, 
    SalesPerson, Invoice, InvoiceItem, UserProfile, LoginLog
)
from .serializers import (
    UserRegisterSerializer, UserLoginSerializer,
    CompanySerializer, QuoteSerializer, CustomerSerializer, 
    ProjectSerializer, ServiceRequestSerializer, SalesPersonSerializer, 
    InvoiceSerializer, InvoiceItemSerializer, UserProfileSerializer, 
    LoginLogSerializer
)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

class SalesPersonViewSet(viewsets.ModelViewSet):
    queryset = SalesPerson.objects.all()
    serializer_class = SalesPersonSerializer
    permission_classes = [permissions.IsAuthenticated]

class InvoiceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        company_id = request.query_params.get('company_id')
        if company_id:
            try:
                # Fetch company regardless of whether the user created it
                company = Company.objects.get(id=company_id)
                invoices = Invoice.objects.filter(company=company)
                serializer = InvoiceSerializer(invoices, many=True)
                return Response(serializer.data)
            except Company.DoesNotExist:
                return Response({"detail": "Company not found"}, status=404)
        return Response({"detail": "Company ID not provided"}, status=400)
class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class LoginLogViewSet(viewsets.ModelViewSet):
    queryset = LoginLog.objects.all()
    serializer_class = LoginLogSerializer
    permission_classes = [permissions.IsAuthenticated]

# Optional: Create custom actions for specific use cases
class CustomInvoiceViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        invoices = Invoice.objects.filter(created_by=request.user)
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class UserRegisterView(generics.CreateAPIView):
    """
    API View for user registration.
    """
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "message": _("User registered successfully."),
        }, status=status.HTTP_201_CREATED)

class UserLoginView(generics.GenericAPIView):
    """
    API View for user login.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            })
        return Response({"detail": _("Invalid credentials.")}, status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(generics.GenericAPIView):
    """
    API View for user logout.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Blacklist the refresh token
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token
            
            return Response({"detail": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)