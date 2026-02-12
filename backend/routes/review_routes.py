from flask import Blueprint
from controllers.review_controller import ReviewController
from utils.jwt_utils import token_required

review_bp = Blueprint('reviews', __name__)

@review_bp.route('', methods=['POST'])
@token_required
def create_review():
    return ReviewController.create_review()

@review_bp.route('/artist/<int:artist_id>', methods=['GET'])
def get_artist_reviews(artist_id):
    return ReviewController.get_artist_reviews(artist_id)

@review_bp.route('/<int:review_id>', methods=['PUT'])
@token_required
def update_review(review_id):
    return ReviewController.update_review(review_id)

@review_bp.route('/<int:review_id>', methods=['DELETE'])
@token_required
def delete_review(review_id):
    return ReviewController.delete_review(review_id)
