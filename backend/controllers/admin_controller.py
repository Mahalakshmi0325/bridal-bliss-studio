from flask import request, jsonify
from models.user_model import User
from models.booking_model import Booking
from models.artist_model import Artist
from models.invoice_model import Invoice
from datetime import datetime, timedelta

class AdminController:
    @staticmethod
    def get_dashboard_stats():
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can access dashboard statistics'}), 403
        
        total_users = len(User.get_all() or [])
        total_customers = User.count_by_role('customer')
        total_artists = User.count_by_role('artist')
        
        all_bookings = Booking.get_all() or []
        total_bookings = len(all_bookings)
        pending_bookings = Booking.count_by_status('pending')
        confirmed_bookings = Booking.count_by_status('confirmed')
        completed_bookings = Booking.count_by_status('completed')
        cancelled_bookings = Booking.count_by_status('cancelled')
        
        revenue_stats = Invoice.get_revenue_stats()
        
        recent_bookings = all_bookings[:10]
        
        pending_artists = Artist.get_all_pending()
        
        stats = {
            'users': {
                'total': total_users,
                'customers': total_customers,
                'artists': total_artists
            },
            'bookings': {
                'total': total_bookings,
                'pending': pending_bookings,
                'confirmed': confirmed_bookings,
                'completed': completed_bookings,
                'cancelled': cancelled_bookings
            },
            'revenue': {
                'total_paid': float(revenue_stats['total_paid'] or 0) if revenue_stats else 0,
                'total_pending': float(revenue_stats['total_pending'] or 0) if revenue_stats else 0,
                'total_revenue': float(revenue_stats['total_revenue'] or 0) if revenue_stats else 0
            },
            'recent_bookings': recent_bookings,
            'pending_artist_approvals': len(pending_artists or [])
        }
        
        return jsonify(stats), 200
    
    @staticmethod
    def get_all_users():
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can access user list'}), 403
        
        role_filter = request.args.get('role')
        
        if role_filter:
            users = User.get_all_by_role(role_filter)
        else:
            users = User.get_all()
        
        for user in users or []:
            user.pop('password_hash', None)
        
        return jsonify(users or []), 200
    
    @staticmethod
    def get_user(user_id):
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can access user details'}), 403
        
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.pop('password_hash', None)
        
        if user['role'] == 'artist':
            artist_profile = Artist.get_profile_by_user_id(user_id)
            user['artist_profile'] = artist_profile
        
        bookings = Booking.get_by_customer(user_id) if user['role'] == 'customer' else Booking.get_by_artist(user_id)
        user['bookings'] = bookings or []
        
        return jsonify(user), 200
    
    @staticmethod
    def update_user_status(user_id):
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can update user status'}), 403
        
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['active', 'inactive', 'suspended']
        if status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        success = User.update(user_id, status=status)
        if not success:
            return jsonify({'error': 'Failed to update user status'}), 500
        
        return jsonify({'message': 'User status updated successfully'}), 200
    
    @staticmethod
    def delete_user(user_id):
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can delete users'}), 403
        
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user['role'] == 'admin':
            return jsonify({'error': 'Cannot delete admin users'}), 403
        
        success = User.delete(user_id)
        if not success:
            return jsonify({'error': 'Failed to delete user'}), 500
        
        return jsonify({'message': 'User deleted successfully'}), 200
    
    @staticmethod
    def get_all_bookings():
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can access all bookings'}), 403
        
        status_filter = request.args.get('status')
        
        bookings = Booking.get_all() or []
        
        if status_filter:
            bookings = [b for b in bookings if b['status'] == status_filter]
        
        return jsonify(bookings), 200
    
    @staticmethod
    def get_revenue_report():
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can access revenue reports'}), 403
        
        revenue_stats = Invoice.get_revenue_stats()
        all_invoices = Invoice.get_all() or []
        
        today = datetime.now().date()
        this_month_start = today.replace(day=1)
        last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
        
        this_month_revenue = sum(
            float(inv['total_amount']) for inv in all_invoices 
            if inv['created_at'] and inv['created_at'].date() >= this_month_start and inv['payment_status'] == 'paid'
        )
        
        last_month_revenue = sum(
            float(inv['total_amount']) for inv in all_invoices 
            if inv['created_at'] and last_month_start <= inv['created_at'].date() < this_month_start and inv['payment_status'] == 'paid'
        )
        
        report = {
            'total_revenue': float(revenue_stats['total_revenue'] or 0) if revenue_stats else 0,
            'total_paid': float(revenue_stats['total_paid'] or 0) if revenue_stats else 0,
            'total_pending': float(revenue_stats['total_pending'] or 0) if revenue_stats else 0,
            'this_month': this_month_revenue,
            'last_month': last_month_revenue,
            'total_invoices': revenue_stats['total_invoices'] if revenue_stats else 0,
            'recent_invoices': all_invoices[:10]
        }
        
        return jsonify(report), 200
