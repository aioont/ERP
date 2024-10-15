from django.contrib import admin
from .models import Quote, Customer, Project, ServiceRequest, SalesPerson, Invoice, InvoiceItem

# Registering Quote model
@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'date', 'total', 'user')
    search_fields = ('client_name', 'user__username')
    list_filter = ('date', 'user')

# Registering Customer model
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Registering Project model
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Registering ServiceRequest model
@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Registering SalesPerson model
@admin.register(SalesPerson)
class SalesPersonAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Registering Invoice model
@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'customer', 'title', 'sales_person', 'status', 'total', 'created_at', 'updated_at')
    search_fields = ('invoice_number', 'customer__name', 'sales_person__name')
    list_filter = ('status', 'created_at')
    date_hierarchy = 'created_at'
    inlines = []

# Registering InvoiceItem model
@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'item_name', 'quantity', 'price', 'discount', 'total')
    search_fields = ('item_name',)
