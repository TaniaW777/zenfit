from flask import Blueprint, request, jsonify
from backend.database import db
from backend.models.user import User
from backend.utils import generate_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """Inscription d'un nouvel utilisateur"""
    data = request.get_json()

    # Validation
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email et mot de passe requis'}), 400

    # Vérifier si l'email existe déjà
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Cet email est déjà utilisé'}), 409

    # Créer le nouvel utilisateur
    user = User(
        email=data['email'],
        first_name=data.get('first_name'),
        last_name=data.get('last_name')
    )
    user.set_password(data['password'])

    # Sauvegarder dans la base de données
    db.session.add(user)
    db.session.commit()

    # Générer le token
    token = generate_token(user.id)

    return jsonify({
        'message': 'Utilisateur créé avec succès',
        'token': token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Connexion d'un utilisateur"""
    data = request.get_json()

    # Validation
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email et mot de passe requis'}), 400

    # Trouver l'utilisateur
    user = User.query.filter_by(email=data['email']).first()

    # Vérifier le mot de passe
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

    # Générer le token
    token = generate_token(user.id)

    return jsonify({
        'message': 'Connexion réussie',
        'token': token,
        'user': user.to_dict()
    }), 200
