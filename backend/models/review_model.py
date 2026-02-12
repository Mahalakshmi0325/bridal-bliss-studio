from database.db import execute_query

class Review:
    @staticmethod
    def create(booking_id, customer_id, artist_id, rating, comment=None):
        query = """
            INSERT INTO reviews (booking_id, customer_id, artist_id, rating, comment)
            VALUES (%s, %s, %s, %s, %s)
        """
        return execute_query(query, (booking_id, customer_id, artist_id, rating, comment))
    
    @staticmethod
    def get_by_id(review_id):
        query = """
            SELECT r.*, 
                   c.full_name as customer_name, c.profile_picture as customer_picture,
                   a.full_name as artist_name
            FROM reviews r
            JOIN users c ON r.customer_id = c.id
            JOIN users a ON r.artist_id = a.id
            WHERE r.id = %s
        """
        return execute_query(query, (review_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def get_by_artist(artist_id):
        query = """
            SELECT r.*, 
                   c.full_name as customer_name, c.profile_picture as customer_picture,
                   b.service_type
            FROM reviews r
            JOIN users c ON r.customer_id = c.id
            JOIN bookings b ON r.booking_id = b.id
            WHERE r.artist_id = %s
            ORDER BY r.created_at DESC
        """
        return execute_query(query, (artist_id,), fetch=True)
    
    @staticmethod
    def get_by_booking(booking_id):
        query = """
            SELECT r.*, 
                   c.full_name as customer_name, c.profile_picture as customer_picture,
                   a.full_name as artist_name
            FROM reviews r
            JOIN users c ON r.customer_id = c.id
            JOIN users a ON r.artist_id = a.id
            WHERE r.booking_id = %s
        """
        return execute_query(query, (booking_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def update(review_id, rating, comment=None):
        query = "UPDATE reviews SET rating = %s, comment = %s WHERE id = %s"
        return execute_query(query, (rating, comment, review_id)) is not None
    
    @staticmethod
    def delete(review_id):
        query = "DELETE FROM reviews WHERE id = %s"
        return execute_query(query, (review_id,)) is not None
    
    @staticmethod
    def get_artist_rating_stats(artist_id):
        query = """
            SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            FROM reviews
            WHERE artist_id = %s
        """
        return execute_query(query, (artist_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def check_existing_review(booking_id, customer_id):
        query = "SELECT id FROM reviews WHERE booking_id = %s AND customer_id = %s"
        result = execute_query(query, (booking_id, customer_id), fetch=True, fetch_one=True)
        return result is not None
