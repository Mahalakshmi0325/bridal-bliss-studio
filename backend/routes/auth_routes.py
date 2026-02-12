from flask import Blueprint
from controllers.auth_controller import AuthController
from utils.jwt_utils import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    return AuthController.register()

@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login()

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    from flask import request
    return AuthController.get_profile(request.user_id)

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    from flask import request
    return AuthController.update_profile(request.user_id)
