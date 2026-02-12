from flask import Blueprint
from controllers.booking_controller import BookingController
from utils.jwt_utils import token_required, role_required

booking_bp = Blueprint('bookings', __name__)

@booking_bp.route('', methods=['POST'])
@token_required
@role_required('customer')
def create_booking():
    return BookingController.create_booking()

@booking_bp.route('', methods=['GET'])
@token_required
def get_bookings():
    return BookingController.get_bookings()

@booking_bp.route('/<int:booking_id>', methods=['GET'])
@token_required
def get_booking(booking_id):
    return BookingController.get_booking(booking_id)

@booking_bp.route('/<int:booking_id>/status', methods=['PUT'])
@token_required
def update_booking_status(booking_id):
    return BookingController.update_booking_status(booking_id)

@booking_bp.route('/<int:booking_id>/cancel', methods=['PUT'])
@token_required
def cancel_booking(booking_id):
    return BookingController.cancel_booking(booking_id)

@booking_bp.route('/upcoming', methods=['GET'])
@token_required
@role_required('artist')
def get_upcoming_bookings():
    return BookingController.get_upcoming_bookings()
