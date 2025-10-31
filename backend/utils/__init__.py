from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta
from flask import current_app

bcrypt = Bcrypt()


def init_bcrypt(app):
    bcrypt.init_app(app)


def hash_password(password):
    """Hache un mot de passe"""
    return bcrypt.generate_password_hash(password).decode('utf-8')


def check_password(password_hash, password):
    """Vérifie si un mot de passe correspond au hash"""
    return bcrypt.check_password_hash(password_hash, password)


def generate_token(user_id):
    """Génère un JWT token pour un utilisateur"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def decode_token(token):
    """Décode un JWT token"""
    try:
        payload = jwt.decode(
            token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
