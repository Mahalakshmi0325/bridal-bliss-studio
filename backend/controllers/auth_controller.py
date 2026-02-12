from flask import request, jsonify
from models.user_model import User
from models.artist_model import Artist
from utils.password_utils import hash_password, verify_password
from utils.jwt_utils import generate_token
from utils.validators import validate_email, validate_password, sanitize_input

class AuthController:
    @staticmethod
    def register():
        data = request.get_json()
        
        email = sanitize_input(data.get('email', ''))
        password = data.get('password', '')
        full_name = sanitize_input(data.get('full_name', ''))
        phone = sanitize_input(data.get('phone'))
        role = data.get('role', 'customer')
        
        if not email or not password or not full_name:
            return jsonify({'error': 'Email, password and full name are required'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        if role not in ['customer', 'artist']:
            return jsonify({'error': 'Invalid role'}), 400
        
        existing_user = User.find_by_email(email)
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400
        
        password_hash = hash_password(password)
        user_id = User.create(email, password_hash, full_name, phone, role)
        
        if not user_id:
            return jsonify({'error': 'Failed to create user'}), 500
        
        if role == 'artist':
            specialization = sanitize_input(data.get('specialization', ''))
            experience_years = int(data.get('experience_years', 0))
            hourly_rate = float(data.get('hourly_rate', 0))
            
            Artist.create_profile(user_id, specialization, experience_years, hourly_rate)
        
        token = generate_token(user_id, role)
        
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'full_name': full_name,
                'role': role
            }
        }), 201
    
    @staticmethod
    def login():
        data = request.get_json()
        
        email = sanitize_input(data.get('email', ''))
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.find_by_email(email)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if user['status'] != 'active':
            return jsonify({'error': 'Account is inactive or suspended'}), 403
        
        if not verify_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = generate_token(user['id'], user['role'])
        
        user_data = {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'phone': user['phone'],
            'role': user['role'],
            'profile_picture': user['profile_picture'],
            'bio': user['bio']
        }
        
        if user['role'] == 'artist':
            artist_profile = Artist.get_profile_by_user_id(user['id'])
            if artist_profile:
                user_data['artist_profile'] = {
                    'specialization': artist_profile['specialization'],
                    'experience_years': artist_profile['experience_years'],
                    'hourly_rate': float(artist_profile['hourly_rate']),
                    'approved': artist_profile['approved'],
                    'rating': float(artist_profile['rating']),
                    'total_reviews': artist_profile['total_reviews']
                }
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user_data
        }), 200
    
    @staticmethod
    def get_profile(user_id):
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'phone': user['phone'],
            'role': user['role'],
            'profile_picture': user['profile_picture'],
            'bio': user['bio'],
            'status': user['status'],
            'created_at': user['created_at'].isoformat() if user['created_at'] else None
        }
        
        if user['role'] == 'artist':
            artist_profile = Artist.get_profile_by_user_id(user['id'])
            if artist_profile:
                user_data['artist_profile'] = {
                    'specialization': artist_profile['specialization'],
                    'experience_years': artist_profile['experience_years'],
                    'hourly_rate': float(artist_profile['hourly_rate']),
                    'availability_status': artist_profile['availability_status'],
                    'approved': artist_profile['approved'],
                    'rating': float(artist_profile['rating']),
                    'total_reviews': artist_profile['total_reviews']
                }
        
        return jsonify(user_data), 200
    
    @staticmethod
    def update_profile(user_id):
        data = request.get_json()
        
        update_data = {}
        if 'full_name' in data:
            update_data['full_name'] = sanitize_input(data['full_name'])
        if 'phone' in data:
            update_data['phone'] = sanitize_input(data['phone'])
        if 'bio' in data:
            update_data['bio'] = sanitize_input(data['bio'])
        if 'profile_picture' in data:
            update_data['profile_picture'] = data['profile_picture']
        
        if update_data:
            success = User.update(user_id, **update_data)
            if not success:
                return jsonify({'error': 'Failed to update profile'}), 500
        
        user = User.find_by_id(user_id)
        if user['role'] == 'artist' and any(k in data for k in ['specialization', 'experience_years', 'hourly_rate', 'availability_status']):
            artist_update = {}
            if 'specialization' in data:
                artist_update['specialization'] = sanitize_input(data['specialization'])
            if 'experience_years' in data:
                artist_update['experience_years'] = int(data['experience_years'])
            if 'hourly_rate' in data:
                artist_update['hourly_rate'] = float(data['hourly_rate'])
            if 'availability_status' in data:
                artist_update['availability_status'] = data['availability_status']
            
            if artist_update:
                Artist.update_profile(user_id, **artist_update)
        
        return jsonify({'message': 'Profile updated successfully'}), 200
