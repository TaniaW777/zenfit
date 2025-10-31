from flask import Blueprint, request, jsonify
from backend.database import db
from backend.models.workout import Workout, Exercise
from backend.utils import decode_token

workouts_bp = Blueprint('workouts', __name__)

# Fonction helper pour vérifier l'authentification


def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]
    user_id = decode_token(token)
    return user_id


@workouts_bp.route('/', methods=['GET'])
def get_workouts():
    """Récupérer tous les workouts de l'utilisateur connecté"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    workouts = Workout.query.filter_by(
        user_id=user_id).order_by(Workout.date.desc()).all()
    return jsonify({'workouts': [w.to_dict() for w in workouts]}), 200


@workouts_bp.route('/', methods=['POST'])
def create_workout():
    """Créer un nouveau workout"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()

    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400

    # Créer le workout
    workout = Workout(
        user_id=user_id,
        title=data['title'],
        notes=data.get('notes'),
        duration=data.get('duration')
    )

    db.session.add(workout)
    db.session.flush()  # Pour obtenir l'ID du workout

    # Ajouter les exercices
    exercises_data = data.get('exercises', [])
    for ex_data in exercises_data:
        exercise = Exercise(
            workout_id=workout.id,
            name=ex_data['name'],
            sets=ex_data.get('sets'),
            reps=ex_data.get('reps'),
            weight=ex_data.get('weight'),
            duration=ex_data.get('duration'),
            notes=ex_data.get('notes')
        )
        db.session.add(exercise)

    db.session.commit()

    return jsonify({
        'message': 'Workout created successfully',
        'workout': workout.to_dict()
    }), 201


@workouts_bp.route('/<int:workout_id>', methods=['GET'])
def get_workout(workout_id):
    """Récupérer un workout spécifique"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first()

    if not workout:
        return jsonify({'error': 'Workout not found'}), 404

    return jsonify({'workout': workout.to_dict()}), 200


@workouts_bp.route('/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    """Supprimer un workout"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first()

    if not workout:
        return jsonify({'error': 'Workout not found'}), 404

    db.session.delete(workout)
    db.session.commit()

    return jsonify({'message': 'Workout deleted successfully'}), 200
