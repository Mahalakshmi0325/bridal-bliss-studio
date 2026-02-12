from flask import request, jsonify
from models.message_model import Message
from utils.validators import sanitize_input

class MessageController:
    @staticmethod
    def send_message():
        data = request.get_json()
        user_id = request.user_id
        
        receiver_id = data.get('receiver_id')
        message_text = sanitize_input(data.get('message', ''))
        booking_id = data.get('booking_id')
        
        if not receiver_id or not message_text:
            return jsonify({'error': 'Receiver ID and message are required'}), 400
        
        if receiver_id == user_id:
            return jsonify({'error': 'Cannot send message to yourself'}), 400
        
        message_id = Message.create(user_id, receiver_id, message_text, booking_id)
        
        if not message_id:
            return jsonify({'error': 'Failed to send message'}), 500
        
        message = Message.get_by_id(message_id)
        
        return jsonify({
            'message': 'Message sent successfully',
            'data': message
        }), 201
    
    @staticmethod
    def get_conversations():
        user_id = request.user_id
        
        conversations = Message.get_user_conversations(user_id)
        
        return jsonify(conversations or []), 200
    
    @staticmethod
    def get_conversation(other_user_id):
        user_id = request.user_id
        
        messages = Message.get_conversation(user_id, other_user_id)
        
        Message.mark_as_read(other_user_id, user_id)
        
        return jsonify(messages or []), 200
    
    @staticmethod
    def mark_as_read(sender_id):
        user_id = request.user_id
        
        success = Message.mark_as_read(sender_id, user_id)
        
        if not success:
            return jsonify({'error': 'Failed to mark messages as read'}), 500
        
        return jsonify({'message': 'Messages marked as read'}), 200
    
    @staticmethod
    def get_unread_count():
        user_id = request.user_id
        
        count = Message.get_unread_count(user_id)
        
        return jsonify({'unread_count': count}), 200
    
    @staticmethod
    def delete_message(message_id):
        user_id = request.user_id
        
        message = Message.get_by_id(message_id)
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        if message['sender_id'] != user_id:
            return jsonify({'error': 'You can only delete your own messages'}), 403
        
        success = Message.delete(message_id)
        if not success:
            return jsonify({'error': 'Failed to delete message'}), 500
        
        return jsonify({'message': 'Message deleted successfully'}), 200
