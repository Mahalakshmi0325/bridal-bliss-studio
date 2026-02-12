from flask import Flask
from flask_cors import CORS
from config import Config
from database.db import init_db
from routes.auth_routes import auth_bp
from routes.booking_routes import booking_bp
from routes.artist_routes import artist_bp
from routes.admin_routes import admin_bp
from routes.review_routes import review_bp
from routes.message_routes import message_bp
from routes.billing_routes import billing_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

init_db()

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(booking_bp, url_prefix='/api/bookings')
app.register_blueprint(artist_bp, url_prefix='/api/artists')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(review_bp, url_prefix='/api/reviews')
app.register_blueprint(message_bp, url_prefix='/api/messages')
app.register_blueprint(billing_bp, url_prefix='/api/billing')

@app.route('/api/health', methods=['GET'])
def health_check():
    return {'status': 'ok', 'message': 'Bridal Bliss Studio API is running'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
