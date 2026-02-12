from flask import request, jsonify
from models.review_model import Review
from models.booking_model import Booking
from models.artist_model import Artist
from utils.validators import validate_rating, sanitize_input

class ReviewController:
    @staticmethod
    def create_review():
        data = request.get_json()
        user_id = request.user_id
        
        booking_id = data.get('booking_id')
        rating = data.get('rating')
        comment = sanitize_input(data.get('comment'))
        
        if not booking_id or not rating:
            return jsonify({'error': 'Booking ID and rating are required'}), 400
        
        if not validate_rating(rating):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        booking = Booking.get_by_id(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking['customer_id'] != user_id:
            return jsonify({'error': 'You can only review your own bookings'}), 403
        
        if booking['status'] != 'completed':
            return jsonify({'error': 'Can only review completed bookings'}), 400
        
        if Review.check_existing_review(booking_id, user_id):
            return jsonify({'error': 'You have already reviewed this booking'}), 400
        
        review_id = Review.create(booking_id, user_id, booking['artist_id'], int(rating), comment)
        
        if not review_id:
            return jsonify({'error': 'Failed to create review'}), 500
        
        rating_stats = Review.get_artist_rating_stats(booking['artist_id'])
        if rating_stats:
            new_rating = float(rating_stats['average_rating'])
            total_reviews = rating_stats['total_reviews']
            Artist.update_rating(booking['artist_id'], new_rating, total_reviews)
        
        review = Review.get_by_id(review_id)
        
        return jsonify({
            'message': 'Review created successfully',
            'review': review
        }), 201
    
    @staticmethod
    def get_artist_reviews(artist_id):
        reviews = Review.get_by_artist(artist_id)
        rating_stats = Review.get_artist_rating_stats(artist_id)
        
        return jsonify({
            'reviews': reviews or [],
            'stats': rating_stats
        }), 200
    
    @staticmethod
    def update_review(review_id):
        data = request.get_json()
        user_id = request.user_id
        
        rating = data.get('rating')
        comment = sanitize_input(data.get('comment'))
        
        if not rating:
            return jsonify({'error': 'Rating is required'}), 400
        
        if not validate_rating(rating):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        review = Review.get_by_id(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        if review['customer_id'] != user_id:
            return jsonify({'error': 'You can only update your own reviews'}), 403
        
        success = Review.update(review_id, int(rating), comment)
        if not success:
            return jsonify({'error': 'Failed to update review'}), 500
        
        rating_stats = Review.get_artist_rating_stats(review['artist_id'])
        if rating_stats:
            new_rating = float(rating_stats['average_rating'])
            total_reviews = rating_stats['total_reviews']
            Artist.update_rating(review['artist_id'], new_rating, total_reviews)
        
        updated_review = Review.get_by_id(review_id)
        
        return jsonify({
            'message': 'Review updated successfully',
            'review': updated_review
        }), 200
    
    @staticmethod
    def delete_review(review_id):
        user_id = request.user_id
        user_role = request.user_role
        
        review = Review.get_by_id(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        if user_role != 'admin' and review['customer_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        artist_id = review['artist_id']
        
        success = Review.delete(review_id)
        if not success:
            return jsonify({'error': 'Failed to delete review'}), 500
        
        rating_stats = Review.get_artist_rating_stats(artist_id)
        if rating_stats:
            new_rating = float(rating_stats['average_rating']) if rating_stats['total_reviews'] > 0 else 0
            total_reviews = rating_stats['total_reviews']
            Artist.update_rating(artist_id, new_rating, total_reviews)
        
        return jsonify({'message': 'Review deleted successfully'}), 200
