from database.db import execute_query
from datetime import datetime

class User:
    @staticmethod
    def create(email, password_hash, full_name, phone=None, role='customer'):
        query = """
            INSERT INTO users (email, password_hash, full_name, phone, role)
            VALUES (%s, %s, %s, %s, %s)
        """
        return execute_query(query, (email, password_hash, full_name, phone, role))
    
    @staticmethod
    def find_by_email(email):
        query = "SELECT * FROM users WHERE email = %s"
        return execute_query(query, (email,), fetch=True, fetch_one=True)
    
    @staticmethod
    def find_by_id(user_id):
        query = "SELECT * FROM users WHERE id = %s"
        return execute_query(query, (user_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def update(user_id, **kwargs):
        allowed_fields = ['full_name', 'phone', 'profile_picture', 'bio', 'status']
        updates = []
        values = []
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                updates.append(f"{field} = %s")
                values.append(value)
        
        if not updates:
            return False
        
        values.append(user_id)
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        return execute_query(query, tuple(values)) is not None
    
    @staticmethod
    def get_all_by_role(role):
        query = "SELECT * FROM users WHERE role = %s ORDER BY created_at DESC"
        return execute_query(query, (role,), fetch=True)
    
    @staticmethod
    def get_all():
        query = "SELECT * FROM users ORDER BY created_at DESC"
        return execute_query(query, fetch=True)
    
    @staticmethod
    def delete(user_id):
        query = "DELETE FROM users WHERE id = %s"
        return execute_query(query, (user_id,)) is not None
    
    @staticmethod
    def count_by_role(role):
        query = "SELECT COUNT(*) as count FROM users WHERE role = %s"
        result = execute_query(query, (role,), fetch=True, fetch_one=True)
        return result['count'] if result else 0
