from flask import request, jsonify
from models.invoice_model import Invoice
from models.booking_model import Booking

class BillingController:
    @staticmethod
    def get_invoices():
        user_id = request.user_id
        user_role = request.user_role
        
        if user_role == 'admin':
            invoices = Invoice.get_all()
        else:
            invoices = Invoice.get_all()
            if user_role == 'customer':
                invoices = [inv for inv in (invoices or []) if inv['customer_id'] == user_id]
            elif user_role == 'artist':
                invoices = [inv for inv in (invoices or []) if inv['artist_id'] == user_id]
        
        for invoice in invoices or []:
            if 'subtotal' in invoice:
                invoice['subtotal'] = float(invoice['subtotal'])
            if 'tax' in invoice:
                invoice['tax'] = float(invoice['tax'])
            if 'discount' in invoice:
                invoice['discount'] = float(invoice['discount'])
            if 'total_amount' in invoice:
                invoice['total_amount'] = float(invoice['total_amount'])
        
        return jsonify(invoices or []), 200
    
    @staticmethod
    def get_invoice(invoice_id):
        user_id = request.user_id
        user_role = request.user_role
        
        invoice = Invoice.get_by_id(invoice_id)
        if not invoice:
            return jsonify({'error': 'Invoice not found'}), 404
        
        if user_role == 'customer' and invoice['customer_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if user_role == 'artist' and invoice['artist_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if 'subtotal' in invoice:
            invoice['subtotal'] = float(invoice['subtotal'])
        if 'tax' in invoice:
            invoice['tax'] = float(invoice['tax'])
        if 'discount' in invoice:
            invoice['discount'] = float(invoice['discount'])
        if 'total_amount' in invoice:
            invoice['total_amount'] = float(invoice['total_amount'])
        
        return jsonify(invoice), 200
    
    @staticmethod
    def get_invoice_by_booking(booking_id):
        user_id = request.user_id
        user_role = request.user_role
        
        booking = Booking.get_by_id(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if user_role == 'customer' and booking['customer_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if user_role == 'artist' and booking['artist_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        invoice = Invoice.get_by_booking(booking_id)
        if not invoice:
            return jsonify({'error': 'Invoice not found for this booking'}), 404
        
        if 'subtotal' in invoice:
            invoice['subtotal'] = float(invoice['subtotal'])
        if 'tax' in invoice:
            invoice['tax'] = float(invoice['tax'])
        if 'discount' in invoice:
            invoice['discount'] = float(invoice['discount'])
        if 'total_amount' in invoice:
            invoice['total_amount'] = float(invoice['total_amount'])
        
        return jsonify(invoice), 200
    
    @staticmethod
    def update_payment_status(invoice_id):
        data = request.get_json()
        user_role = request.user_role
        
        if user_role not in ['admin', 'customer']:
            return jsonify({'error': 'Only admins and customers can update payment status'}), 403
        
        payment_status = data.get('payment_status')
        payment_method = data.get('payment_method')
        
        if not payment_status:
            return jsonify({'error': 'Payment status is required'}), 400
        
        valid_statuses = ['pending', 'paid', 'partially_paid', 'refunded']
        if payment_status not in valid_statuses:
            return jsonify({'error': 'Invalid payment status'}), 400
        
        invoice = Invoice.get_by_id(invoice_id)
        if not invoice:
            return jsonify({'error': 'Invoice not found'}), 404
        
        if user_role == 'customer' and invoice['customer_id'] != request.user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        success = Invoice.update_payment_status(invoice_id, payment_status, payment_method)
        if not success:
            return jsonify({'error': 'Failed to update payment status'}), 500
        
        return jsonify({'message': 'Payment status updated successfully'}), 200
    
    @staticmethod
    def get_revenue_stats():
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can access revenue statistics'}), 403
        
        stats = Invoice.get_revenue_stats()
        
        if stats:
            stats['total_paid'] = float(stats['total_paid'] or 0)
            stats['total_pending'] = float(stats['total_pending'] or 0)
            stats['total_partial'] = float(stats['total_partial'] or 0)
            stats['total_revenue'] = float(stats['total_revenue'] or 0)
        
        return jsonify(stats), 200
