from database.db import execute_query

class Artist:
    @staticmethod
    def create_profile(user_id, specialization, experience_years, hourly_rate):
        query = """
            INSERT INTO artist_profiles (user_id, specialization, experience_years, hourly_rate)
            VALUES (%s, %s, %s, %s)
        """
        return execute_query(query, (user_id, specialization, experience_years, hourly_rate))
    
    @staticmethod
    def get_profile_by_user_id(user_id):
        query = """
            SELECT ap.*, u.full_name, u.email, u.phone, u.profile_picture, u.bio
            FROM artist_profiles ap
            JOIN users u ON ap.user_id = u.id
            WHERE ap.user_id = %s
        """
        return execute_query(query, (user_id,), fetch=True, fetch_one=True)
    
    @staticmethod
    def get_all_approved():
        query = """
            SELECT ap.*, u.full_name, u.email, u.phone, u.profile_picture, u.bio
            FROM artist_profiles ap
            JOIN users u ON ap.user_id = u.id
            WHERE ap.approved = TRUE AND u.status = 'active'
            ORDER BY ap.rating DESC
        """
        return execute_query(query, fetch=True)
    
    @staticmethod
    def get_all_pending():
        query = """
            SELECT ap.*, u.full_name, u.email, u.phone, u.profile_picture, u.bio
            FROM artist_profiles ap
            JOIN users u ON ap.user_id = u.id
            WHERE ap.approved = FALSE
            ORDER BY ap.created_at DESC
        """
        return execute_query(query, fetch=True)
    
    @staticmethod
    def update_profile(user_id, **kwargs):
        allowed_fields = ['specialization', 'experience_years', 'hourly_rate', 
                         'availability_status', 'portfolio_images', 'certifications']
        updates = []
        values = []
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                updates.append(f"{field} = %s")
                values.append(value)
        
        if not updates:
            return False
        
        values.append(user_id)
        query = f"UPDATE artist_profiles SET {', '.join(updates)} WHERE user_id = %s"
        return execute_query(query, tuple(values)) is not None
    
    @staticmethod
    def approve_artist(user_id):
        query = "UPDATE artist_profiles SET approved = TRUE WHERE user_id = %s"
        return execute_query(query, (user_id,)) is not None
    
    @staticmethod
    def reject_artist(user_id):
        query = "UPDATE artist_profiles SET approved = FALSE WHERE user_id = %s"
        return execute_query(query, (user_id,)) is not None
    
    @staticmethod
    def update_rating(artist_id, rating, total_reviews):
        query = """
            UPDATE artist_profiles 
            SET rating = %s, total_reviews = %s 
            WHERE user_id = %s
        """
        return execute_query(query, (rating, total_reviews, artist_id)) is not None
    
    @staticmethod
    def search_artists(specialization=None, min_rating=None):
        conditions = ["ap.approved = TRUE", "u.status = 'active'"]
        params = []
        
        if specialization:
            conditions.append("ap.specialization LIKE %s")
            params.append(f"%{specialization}%")
        
        if min_rating:
            conditions.append("ap.rating >= %s")
            params.append(min_rating)
        
        query = f"""
            SELECT ap.*, u.full_name, u.email, u.phone, u.profile_picture, u.bio
            FROM artist_profiles ap
            JOIN users u ON ap.user_id = u.id
            WHERE {' AND '.join(conditions)}
            ORDER BY ap.rating DESC
        """
        return execute_query(query, tuple(params), fetch=True)
