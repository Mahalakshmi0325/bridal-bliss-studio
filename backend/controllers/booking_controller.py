from flask import request, jsonify
from models.booking_model import Booking
from models.invoice_model import Invoice
from utils.validators import validate_date, validate_time, sanitize_input
from datetime import datetime

class BookingController:
    @staticmethod
    def create_booking():
        data = request.get_json()
        user_id = request.user_id
        
        artist_id = data.get('artist_id')
        service_type = sanitize_input(data.get('service_type', ''))
        booking_date = data.get('booking_date')
        booking_time = data.get('booking_time')
        duration_hours = int(data.get('duration_hours', 2))
        total_amount = float(data.get('total_amount', 0))
        special_requests = sanitize_input(data.get('special_requests'))
        address = sanitize_input(data.get('address'))
        
        if not all([artist_id, service_type, booking_date, booking_time, total_amount]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if not validate_date(booking_date):
            return jsonify({'error': 'Invalid date format'}), 400
        
        if not validate_time(booking_time):
            return jsonify({'error': 'Invalid time format'}), 400
        
        if datetime.strptime(booking_date, '%Y-%m-%d').date() < datetime.now().date():
            return jsonify({'error': 'Cannot book for past dates'}), 400
        
        conflicts = Booking.check_artist_availability(artist_id, booking_date, booking_time, duration_hours)
        if conflicts > 0:
            return jsonify({'error': 'Artist is not available at this time'}), 409
        
        booking_id = Booking.create(
            user_id, artist_id, service_type, booking_date, booking_time,
            duration_hours, total_amount, special_requests, address
        )
        
        if not booking_id:
            return jsonify({'error': 'Failed to create booking'}), 500
        
        Invoice.create(booking_id, total_amount, tax=total_amount * 0.1)
        
        booking = Booking.get_by_id(booking_id)
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking
        }), 201
    
    @staticmethod
    def get_bookings():
        user_id = request.user_id
        user_role = request.user_role
        
        if user_role == 'customer':
            bookings = Booking.get_by_customer(user_id)
        elif user_role == 'artist':
            bookings = Booking.get_by_artist(user_id)
        elif user_role == 'admin':
            bookings = Booking.get_all()
        else:
            return jsonify({'error': 'Invalid role'}), 403
        
        return jsonify(bookings or []), 200
    
    @staticmethod
    def get_booking(booking_id):
        user_id = request.user_id
        user_role = request.user_role
        
        booking = Booking.get_by_id(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if user_role == 'customer' and booking['customer_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if user_role == 'artist' and booking['artist_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify(booking), 200
    
    @staticmethod
    def update_booking_status(booking_id):
        data = request.get_json()
        user_id = request.user_id
        user_role = request.user_role
        
        status = data.get('status')
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected']
        if status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        booking = Booking.get_by_id(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if user_role == 'customer' and booking['customer_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if user_role == 'artist' and booking['artist_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if user_role == 'customer' and status not in ['cancelled']:
            return jsonify({'error': 'Customers can only cancel bookings'}), 403
        
        if user_role == 'artist' and status not in ['confirmed', 'rejected', 'completed']:
            return jsonify({'error': 'Invalid status change for artist'}), 403
        
        success = Booking.update_status(booking_id, status)
        if not success:
            return jsonify({'error': 'Failed to update booking status'}), 500
        
        return jsonify({'message': 'Booking status updated successfully'}), 200
    
    @staticmethod
    def cancel_booking(booking_id):
        user_id = request.user_id
        user_role = request.user_role
        
        booking = Booking.get_by_id(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if user_role == 'customer' and booking['customer_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if booking['status'] in ['completed', 'cancelled']:
            return jsonify({'error': 'Cannot cancel this booking'}), 400
        
        success = Booking.update_status(booking_id, 'cancelled')
        if not success:
            return jsonify({'error': 'Failed to cancel booking'}), 500
        
        return jsonify({'message': 'Booking cancelled successfully'}), 200
    
    @staticmethod
    def get_upcoming_bookings():
        user_id = request.user_id
        user_role = request.user_role
        
        if user_role != 'artist':
            return jsonify({'error': 'Only artists can access this endpoint'}), 403
        
        bookings = Booking.get_upcoming_by_artist(user_id)
        return jsonify(bookings or []), 200
