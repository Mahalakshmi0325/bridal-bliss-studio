from flask import Blueprint
from controllers.admin_controller import AdminController
from utils.jwt_utils import token_required, role_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@token_required
@role_required('admin')
def get_dashboard_stats():
    return AdminController.get_dashboard_stats()

@admin_bp.route('/users', methods=['GET'])
@token_required
@role_required('admin')
def get_all_users():
    return AdminController.get_all_users()

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@token_required
@role_required('admin')
def get_user(user_id):
    return AdminController.get_user(user_id)

@admin_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@token_required
@role_required('admin')
def update_user_status(user_id):
    return AdminController.update_user_status(user_id)

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_user(user_id):
    return AdminController.delete_user(user_id)

@admin_bp.route('/bookings', methods=['GET'])
@token_required
@role_required('admin')
def get_all_bookings():
    return AdminController.get_all_bookings()

@admin_bp.route('/revenue/report', methods=['GET'])
@token_required
@role_required('admin')
def get_revenue_report():
    return AdminController.get_revenue_report()
