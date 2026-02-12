from flask import Blueprint
from controllers.billing_controller import BillingController
from utils.jwt_utils import token_required, role_required

billing_bp = Blueprint('billing', __name__)

@billing_bp.route('/invoices', methods=['GET'])
@token_required
def get_invoices():
    return BillingController.get_invoices()

@billing_bp.route('/invoices/<int:invoice_id>', methods=['GET'])
@token_required
def get_invoice(invoice_id):
    return BillingController.get_invoice(invoice_id)

@billing_bp.route('/invoices/booking/<int:booking_id>', methods=['GET'])
@token_required
def get_invoice_by_booking(booking_id):
    return BillingController.get_invoice_by_booking(booking_id)

@billing_bp.route('/invoices/<int:invoice_id>/payment', methods=['PUT'])
@token_required
def update_payment_status(invoice_id):
    return BillingController.update_payment_status(invoice_id)

@billing_bp.route('/revenue/stats', methods=['GET'])
@token_required
@role_required('admin')
def get_revenue_stats():
    return BillingController.get_revenue_stats()
