from database.db import execute_query

class Message:
    @staticmethod
    def create(sender_id, receiver_id, message, booking_id=None):
        query = """
            INSERT INTO messages (sender_id, receiver_id, message, booking_id)
            VALUES (%s, %s, %s, %s)
        """
        return execute_query(query, (sender_id, receiver_id, message, booking_id))
    
    @staticmethod
    def get_by_id(message_id):
        query = """
            SELECT m.*, 
                   s.full_name as sender_name, s.profile_picture as sender_picture,
                   r.full_name as receiver_name, r.profile_picture as receiver_picture
            FROM messages m
            JOIN users s ON m.sender_id = s.id
            JOIN users r ON m.receiver_id = r.id
            WHERE m.id = %s
        """
        return execute_query(query, (message_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def get_conversation(user1_id, user2_id):
        query = """
            SELECT m.*, 
                   s.full_name as sender_name, s.profile_picture as sender_picture,
                   r.full_name as receiver_name, r.profile_picture as receiver_picture
            FROM messages m
            JOIN users s ON m.sender_id = s.id
            JOIN users r ON m.receiver_id = r.id
            WHERE (m.sender_id = %s AND m.receiver_id = %s)
               OR (m.sender_id = %s AND m.receiver_id = %s)
            ORDER BY m.created_at ASC
        """
        return execute_query(query, (user1_id, user2_id, user2_id, user1_id), fetch=True)
    
    @staticmethod
    def get_user_conversations(user_id):
        query = """
            SELECT DISTINCT
                CASE 
                    WHEN m.sender_id = %s THEN m.receiver_id
                    ELSE m.sender_id
                END as other_user_id,
                u.full_name as other_user_name,
                u.profile_picture as other_user_picture,
                (SELECT message FROM messages 
                 WHERE (sender_id = %s AND receiver_id = u.id)
                    OR (sender_id = u.id AND receiver_id = %s)
                 ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT created_at FROM messages 
                 WHERE (sender_id = %s AND receiver_id = u.id)
                    OR (sender_id = u.id AND receiver_id = %s)
                 ORDER BY created_at DESC LIMIT 1) as last_message_time,
                (SELECT COUNT(*) FROM messages 
                 WHERE sender_id = u.id AND receiver_id = %s AND is_read = FALSE) as unread_count
            FROM messages m
            JOIN users u ON (
                CASE 
                    WHEN m.sender_id = %s THEN m.receiver_id
                    ELSE m.sender_id
                END = u.id
            )
            WHERE m.sender_id = %s OR m.receiver_id = %s
            ORDER BY last_message_time DESC
        """
        return execute_query(query, (user_id, user_id, user_id, user_id, user_id, 
                                    user_id, user_id, user_id, user_id), fetch=True)
    
    @staticmethod
    def mark_as_read(sender_id, receiver_id):
        query = """
            UPDATE messages 
            SET is_read = TRUE 
            WHERE sender_id = %s AND receiver_id = %s AND is_read = FALSE
        """
        return execute_query(query, (sender_id, receiver_id)) is not None
    
    @staticmethod
    def get_unread_count(user_id):
        query = """
            SELECT COUNT(*) as count 
            FROM messages 
            WHERE receiver_id = %s AND is_read = FALSE
        """
        result = execute_query(query, (user_id,), fetch=True, fetch_one=True)
        return result['count'] if result else 0
    
    @staticmethod
    def delete(message_id):
        query = "DELETE FROM messages WHERE id = %s"
        return execute_query(query, (message_id,)) is not None
