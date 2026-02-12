from database.db import execute_query
from datetime import datetime

class Booking:
    @staticmethod
    def create(customer_id, artist_id, service_type, booking_date, booking_time, 
               duration_hours, total_amount, special_requests=None, address=None):
        query = """
            INSERT INTO bookings (customer_id, artist_id, service_type, booking_date, 
                                booking_time, duration_hours, total_amount, 
                                special_requests, address)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        return execute_query(query, (customer_id, artist_id, service_type, booking_date,
                                    booking_time, duration_hours, total_amount,
                                    special_requests, address))
    
    @staticmethod
    def get_by_id(booking_id):
        query = """
            SELECT b.*, 
                   c.full_name as customer_name, c.email as customer_email, c.phone as customer_phone,
                   a.full_name as artist_name, a.email as artist_email, a.phone as artist_phone
            FROM bookings b
            JOIN users c ON b.customer_id = c.id
            JOIN users a ON b.artist_id = a.id
            WHERE b.id = %s
        """
        return execute_query(query, (booking_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def get_by_customer(customer_id):
        query = """
            SELECT b.*, 
                   a.full_name as artist_name, a.email as artist_email, a.phone as artist_phone
            FROM bookings b
            JOIN users a ON b.artist_id = a.id
            WHERE b.customer_id = %s
            ORDER BY b.booking_date DESC, b.booking_time DESC
        """
        return execute_query(query, (customer_id,), fetch=True)
    
    @staticmethod
    def get_by_artist(artist_id):
        query = """
            SELECT b.*, 
                   c.full_name as customer_name, c.email as customer_email, c.phone as customer_phone
            FROM bookings b
            JOIN users c ON b.customer_id = c.id
            WHERE b.artist_id = %s
            ORDER BY b.booking_date DESC, b.booking_time DESC
        """
        return execute_query(query, (artist_id,), fetch=True)
    
    @staticmethod
    def get_all():
        query = """
            SELECT b.*, 
                   c.full_name as customer_name, c.email as customer_email,
                   a.full_name as artist_name, a.email as artist_email
            FROM bookings b
            JOIN users c ON b.customer_id = c.id
            JOIN users a ON b.artist_id = a.id
            ORDER BY b.created_at DESC
        """
        return execute_query(query, fetch=True)
    
    @staticmethod
    def update_status(booking_id, status):
        query = "UPDATE bookings SET status = %s WHERE id = %s"
        return execute_query(query, (status, booking_id)) is not None
    
    @staticmethod
    def update(booking_id, **kwargs):
        allowed_fields = ['service_type', 'booking_date', 'booking_time', 
                         'duration_hours', 'total_amount', 'special_requests', 
                         'address', 'status']
        updates = []
        values = []
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                updates.append(f"{field} = %s")
                values.append(value)
        
        if not updates:
            return False
        
        values.append(booking_id)
        query = f"UPDATE bookings SET {', '.join(updates)} WHERE id = %s"
        return execute_query(query, tuple(values)) is not None
    
    @staticmethod
    def delete(booking_id):
        query = "DELETE FROM bookings WHERE id = %s"
        return execute_query(query, (booking_id,)) is not None
    
    @staticmethod
    def count_by_status(status):
        query = "SELECT COUNT(*) as count FROM bookings WHERE status = %s"
        result = execute_query(query, (status,), fetch=True, fetch_one=True)
        return result['count'] if result else 0
    
    @staticmethod
    def get_upcoming_by_artist(artist_id):
        query = """
            SELECT b.*, 
                   c.full_name as customer_name, c.email as customer_email, c.phone as customer_phone
            FROM bookings b
            JOIN users c ON b.customer_id = c.id
            WHERE b.artist_id = %s 
            AND b.booking_date >= CURDATE()
            AND b.status IN ('pending', 'confirmed')
            ORDER BY b.booking_date ASC, b.booking_time ASC
        """
        return execute_query(query, (artist_id,), fetch=True)
    
    @staticmethod
    def check_artist_availability(artist_id, booking_date, booking_time, duration_hours):
        query = """
            SELECT COUNT(*) as count FROM bookings
            WHERE artist_id = %s 
            AND booking_date = %s
            AND status IN ('pending', 'confirmed')
            AND (
                (booking_time <= %s AND ADDTIME(booking_time, SEC_TO_TIME(duration_hours * 3600)) > %s)
                OR (booking_time < ADDTIME(%s, SEC_TO_TIME(%s * 3600)) AND booking_time >= %s)
            )
        """
        result = execute_query(query, (artist_id, booking_date, booking_time, booking_time,
                                      booking_time, duration_hours, booking_time),
                             fetch=True, fetch_one=True)
        return result['count'] if result else 0
