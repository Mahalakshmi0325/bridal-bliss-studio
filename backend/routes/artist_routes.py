from flask import Blueprint
from controllers.artist_controller import ArtistController
from utils.jwt_utils import token_required, role_required

artist_bp = Blueprint('artists', __name__)

@artist_bp.route('', methods=['GET'])
def get_all_artists():
    return ArtistController.get_all_artists()

@artist_bp.route('/<int:artist_id>', methods=['GET'])
def get_artist(artist_id):
    return ArtistController.get_artist(artist_id)

@artist_bp.route('/pending', methods=['GET'])
@token_required
@role_required('admin')
def get_pending_artists():
    return ArtistController.get_pending_artists()

@artist_bp.route('/<int:artist_id>/approve', methods=['PUT'])
@token_required
@role_required('admin')
def approve_artist(artist_id):
    return ArtistController.approve_artist(artist_id)

@artist_bp.route('/<int:artist_id>/reject', methods=['PUT'])
@token_required
@role_required('admin')
def reject_artist(artist_id):
    return ArtistController.reject_artist(artist_id)

@artist_bp.route('/dashboard', methods=['GET'])
@token_required
@role_required('artist')
def get_artist_dashboard():
    return ArtistController.get_artist_dashboard()
