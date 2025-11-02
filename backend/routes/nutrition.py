from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from backend.database import db
from backend.models.nutrition import Meal, Food
from backend.utils import decode_token

nutrition_bp = Blueprint('nutrition', __name__)

# Fonction helper pour vérifier l'authentification


def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]
    user_id = decode_token(token)
    return user_id


@nutrition_bp.route('/', methods=['GET'])
def get_meals():
    """Récupérer tous les meals de l'utilisateur"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    # Filtrer par date si fournie
    date_str = request.args.get('date')

    if date_str:
        try:
            target_date = datetime.fromisoformat(
                date_str.replace('Z', '+00:00'))
            start_date = target_date.replace(
                hour=0, minute=0, second=0, microsecond=0)
            end_date = start_date + timedelta(days=1)

            meals = Meal.query.filter(
                Meal.user_id == user_id,
                Meal.date >= start_date,
                Meal.date < end_date
            ).order_by(Meal.date.desc()).all()
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    else:
        meals = Meal.query.filter_by(
            user_id=user_id).order_by(Meal.date.desc()).all()

    return jsonify({'meals': [m.to_dict() for m in meals]}), 200


@nutrition_bp.route('/', methods=['POST'])
def create_meal():
    """Créer un nouveau meal"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()

    if not data or not data.get('meal_type'):
        return jsonify({'error': 'Meal type is required'}), 400

    # Créer le meal
    meal = Meal(
        user_id=user_id,
        meal_type=data['meal_type'],
        notes=data.get('notes')
    )

    db.session.add(meal)
    db.session.flush()

    # Ajouter les foods
    foods_data = data.get('foods', [])
    for food_data in foods_data:
        food = Food(
            meal_id=meal.id,
            name=food_data['name'],
            quantity=food_data.get('quantity'),
            unit=food_data.get('unit', 'g'),
            calories=food_data.get('calories'),
            protein=food_data.get('protein'),
            carbs=food_data.get('carbs'),
            fats=food_data.get('fats')
        )
        db.session.add(food)

    db.session.commit()

    return jsonify({
        'message': 'Meal created successfully',
        'meal': meal.to_dict()
    }), 201


@nutrition_bp.route('/<int:meal_id>', methods=['GET'])
def get_meal(meal_id):
    """Récupérer un meal spécifique"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    meal = Meal.query.filter_by(id=meal_id, user_id=user_id).first()

    if not meal:
        return jsonify({'error': 'Meal not found'}), 404

    return jsonify({'meal': meal.to_dict()}), 200


@nutrition_bp.route('/<int:meal_id>', methods=['DELETE'])
def delete_meal(meal_id):
    """Supprimer un meal"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    meal = Meal.query.filter_by(id=meal_id, user_id=user_id).first()

    if not meal:
        return jsonify({'error': 'Meal not found'}), 404

    db.session.delete(meal)
    db.session.commit()

    return jsonify({'message': 'Meal deleted successfully'}), 200


@nutrition_bp.route('/daily-summary', methods=['GET'])
def get_daily_summary():
    """Récupérer le résumé nutritionnel du jour"""
    user_id = get_current_user()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    date_str = request.args.get('date')

    if date_str:
        try:
            target_date = datetime.fromisoformat(
                date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    else:
        target_date = datetime.utcnow()

    start_date = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = start_date + timedelta(days=1)

    meals = Meal.query.filter(
        Meal.user_id == user_id,
        Meal.date >= start_date,
        Meal.date < end_date
    ).all()

    # Calculer les totaux
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fats = 0

    for meal in meals:
        totals = meal.calculate_totals()
        total_calories += totals['calories']
        total_protein += totals['protein']
        total_carbs += totals['carbs']
        total_fats += totals['fats']

    return jsonify({
        'date': target_date.isoformat(),
        'summary': {
            'calories': round(total_calories, 1),
            'protein': round(total_protein, 1),
            'carbs': round(total_carbs, 1),
            'fats': round(total_fats, 1)
        },
        'meals_count': len(meals)
    }), 200
