from database.db import execute_query
from datetime import datetime, timedelta
import random
import string

class Invoice:
    @staticmethod
    def generate_invoice_number():
        timestamp = datetime.now().strftime('%Y%m%d')
        random_str = ''.join(random.choices(string.digits, k=4))
        return f"INV-{timestamp}-{random_str}"
    
    @staticmethod
    def create(booking_id, subtotal, tax=0.00, discount=0.00, due_days=30, notes=None):
        invoice_number = Invoice.generate_invoice_number()
        total_amount = subtotal + tax - discount
        due_date = (datetime.now() + timedelta(days=due_days)).date()
        
        query = """
            INSERT INTO invoices (booking_id, invoice_number, subtotal, tax, discount, 
                                total_amount, due_date, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        return execute_query(query, (booking_id, invoice_number, subtotal, tax, 
                                    discount, total_amount, due_date, notes))
    
    @staticmethod
    def get_by_id(invoice_id):
        query = """
            SELECT i.*, b.customer_id, b.artist_id, b.service_type, b.booking_date,
                   c.full_name as customer_name, c.email as customer_email, c.phone as customer_phone,
                   a.full_name as artist_name, a.email as artist_email
            FROM invoices i
            JOIN bookings b ON i.booking_id = b.id
            JOIN users c ON b.customer_id = c.id
            JOIN users a ON b.artist_id = a.id
            WHERE i.id = %s
        """
        return execute_query(query, (invoice_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def get_by_booking(booking_id):
        query = """
            SELECT i.*, b.customer_id, b.artist_id, b.service_type, b.booking_date,
                   c.full_name as customer_name, c.email as customer_email,
                   a.full_name as artist_name
            FROM invoices i
            JOIN bookings b ON i.booking_id = b.id
            JOIN users c ON b.customer_id = c.id
            JOIN users a ON b.artist_id = a.id
            WHERE i.booking_id = %s
        """
        return execute_query(query, (booking_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def get_by_invoice_number(invoice_number):
        query = """
            SELECT i.*, b.customer_id, b.artist_id, b.service_type, b.booking_date,
                   c.full_name as customer_name, c.email as customer_email,
                   a.full_name as artist_name
            FROM invoices i
            JOIN bookings b ON i.booking_id = b.id
            JOIN users c ON b.customer_id = c.id
            JOIN users a ON b.artist_id = a.id
            WHERE i.invoice_number = %s
        """
        return execute_query(query, (invoice_number,), fetch=True, fetch_one=True)
    
    @staticmethod
    def get_all():
        query = """
            SELECT i.*, b.service_type, b.booking_date,
                   c.full_name as customer_name, c.email as customer_email,
                   a.full_name as artist_name
            FROM invoices i
            JOIN bookings b ON i.booking_id = b.id
            JOIN users c ON b.customer_id = c.id
            JOIN users a ON b.artist_id = a.id
            ORDER BY i.created_at DESC
        """
        return execute_query(query, fetch=True)
    
    @staticmethod
    def update_payment_status(invoice_id, payment_status, payment_method=None):
        payment_date = datetime.now() if payment_status == 'paid' else None
        query = """
            UPDATE invoices 
            SET payment_status = %s, payment_method = %s, payment_date = %s
            WHERE id = %s
        """
        return execute_query(query, (payment_status, payment_method, payment_date, invoice_id)) is not None
    
    @staticmethod
    def update(invoice_id, **kwargs):
        allowed_fields = ['subtotal', 'tax', 'discount', 'total_amount', 
                         'payment_status', 'payment_method', 'due_date', 'notes']
        updates = []
        values = []
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                updates.append(f"{field} = %s")
                values.append(value)
        
        if not updates:
            return False
        
        values.append(invoice_id)
        query = f"UPDATE invoices SET {', '.join(updates)} WHERE id = %s"
        return execute_query(query, tuple(values)) is not None
    
    @staticmethod
    def get_revenue_stats():
        query = """
            SELECT 
                COUNT(*) as total_invoices,
                SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_paid,
                SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as total_pending,
                SUM(CASE WHEN payment_status = 'partially_paid' THEN total_amount ELSE 0 END) as total_partial,
                SUM(total_amount) as total_revenue
            FROM invoices
        """
        return execute_query(query, fetch=True, fetch_one=True)
