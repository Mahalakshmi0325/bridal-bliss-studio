from flask import Blueprint
from controllers.message_controller import MessageController
from utils.jwt_utils import token_required

message_bp = Blueprint('messages', __name__)

@message_bp.route('', methods=['POST'])
@token_required
def send_message():
    return MessageController.send_message()

@message_bp.route('/conversations', methods=['GET'])
@token_required
def get_conversations():
    return MessageController.get_conversations()

@message_bp.route('/conversation/<int:other_user_id>', methods=['GET'])
@token_required
def get_conversation(other_user_id):
    return MessageController.get_conversation(other_user_id)

@message_bp.route('/read/<int:sender_id>', methods=['PUT'])
@token_required
def mark_as_read(sender_id):
    return MessageController.mark_as_read(sender_id)

@message_bp.route('/unread-count', methods=['GET'])
@token_required
def get_unread_count():
    return MessageController.get_unread_count()

@message_bp.route('/<int:message_id>', methods=['DELETE'])
@token_required
def delete_message(message_id):
    return MessageController.delete_message(message_id)
