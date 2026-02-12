from flask import request, jsonify
from models.artist_model import Artist
from models.review_model import Review

class ArtistController:
    @staticmethod
    def get_all_artists():
        specialization = request.args.get('specialization')
        min_rating = request.args.get('min_rating')
        
        if specialization or min_rating:
            artists = Artist.search_artists(specialization, min_rating)
        else:
            artists = Artist.get_all_approved()
        
        for artist in artists or []:
            if 'hourly_rate' in artist and artist['hourly_rate']:
                artist['hourly_rate'] = float(artist['hourly_rate'])
            if 'rating' in artist and artist['rating']:
                artist['rating'] = float(artist['rating'])
        
        return jsonify(artists or []), 200
    
    @staticmethod
    def get_artist(artist_id):
        artist = Artist.get_profile_by_user_id(artist_id)
        if not artist:
            return jsonify({'error': 'Artist not found'}), 404
        
        if 'hourly_rate' in artist and artist['hourly_rate']:
            artist['hourly_rate'] = float(artist['hourly_rate'])
        if 'rating' in artist and artist['rating']:
            artist['rating'] = float(artist['rating'])
        
        reviews = Review.get_by_artist(artist_id)
        rating_stats = Review.get_artist_rating_stats(artist_id)
        
        artist['reviews'] = reviews or []
        artist['rating_stats'] = rating_stats
        
        return jsonify(artist), 200
    
    @staticmethod
    def get_pending_artists():
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can access this endpoint'}), 403
        
        artists = Artist.get_all_pending()
        
        for artist in artists or []:
            if 'hourly_rate' in artist and artist['hourly_rate']:
                artist['hourly_rate'] = float(artist['hourly_rate'])
        
        return jsonify(artists or []), 200
    
    @staticmethod
    def approve_artist(artist_id):
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can approve artists'}), 403
        
        artist = Artist.get_profile_by_user_id(artist_id)
        if not artist:
            return jsonify({'error': 'Artist not found'}), 404
        
        success = Artist.approve_artist(artist_id)
        if not success:
            return jsonify({'error': 'Failed to approve artist'}), 500
        
        return jsonify({'message': 'Artist approved successfully'}), 200
    
    @staticmethod
    def reject_artist(artist_id):
        user_role = request.user_role
        
        if user_role != 'admin':
            return jsonify({'error': 'Only admins can reject artists'}), 403
        
        artist = Artist.get_profile_by_user_id(artist_id)
        if not artist:
            return jsonify({'error': 'Artist not found'}), 404
        
        success = Artist.reject_artist(artist_id)
        if not success:
            return jsonify({'error': 'Failed to reject artist'}), 500
        
        return jsonify({'message': 'Artist rejected successfully'}), 200
    
    @staticmethod
    def get_artist_dashboard():
        user_id = request.user_id
        user_role = request.user_role
        
        if user_role != 'artist':
            return jsonify({'error': 'Only artists can access this endpoint'}), 403
        
        from models.booking_model import Booking
        
        artist_profile = Artist.get_profile_by_user_id(user_id)
        bookings = Booking.get_by_artist(user_id)
        reviews = Review.get_by_artist(user_id)
        rating_stats = Review.get_artist_rating_stats(user_id)
        
        pending_bookings = len([b for b in (bookings or []) if b['status'] == 'pending'])
        confirmed_bookings = len([b for b in (bookings or []) if b['status'] == 'confirmed'])
        completed_bookings = len([b for b in (bookings or []) if b['status'] == 'completed'])
        
        total_earnings = sum(float(b['total_amount']) for b in (bookings or []) if b['status'] == 'completed')
        
        dashboard_data = {
            'profile': artist_profile,
            'stats': {
                'total_bookings': len(bookings or []),
                'pending_bookings': pending_bookings,
                'confirmed_bookings': confirmed_bookings,
                'completed_bookings': completed_bookings,
                'total_earnings': total_earnings,
                'rating': float(artist_profile['rating']) if artist_profile else 0,
                'total_reviews': artist_profile['total_reviews'] if artist_profile else 0
            },
            'recent_bookings': (bookings or [])[:5],
            'recent_reviews': (reviews or [])[:5],
            'rating_breakdown': rating_stats
        }
        
        return jsonify(dashboard_data), 200
