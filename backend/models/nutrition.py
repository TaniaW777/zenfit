from datetime import datetime
from backend.database import db


class Meal(db.Model):
    __tablename__ = 'meals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # breakfast, lunch, dinner, snack
    meal_type = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relations
    foods = db.relationship('Food', backref='meal',
                            lazy=True, cascade='all, delete-orphan')
    user = db.relationship('User', backref='meals')

    def calculate_totals(self):
        """Calcule les totaux de calories et macros"""
        total_calories = sum(food.calories or 0 for food in self.foods)
        total_protein = sum(food.protein or 0 for food in self.foods)
        total_carbs = sum(food.carbs or 0 for food in self.foods)
        total_fats = sum(food.fats or 0 for food in self.foods)

        return {
            'calories': round(total_calories, 1),
            'protein': round(total_protein, 1),
            'carbs': round(total_carbs, 1),
            'fats': round(total_fats, 1)
        }

    def to_dict(self):
        totals = self.calculate_totals()
        return {
            'id': self.id,
            'user_id': self.user_id,
            'meal_type': self.meal_type,
            'date': self.date.isoformat(),
            'notes': self.notes,
            'foods': [food.to_dict() for food in self.foods],
            'totals': totals,
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<Meal {self.meal_type} - {self.date}>'


class Food(db.Model):
    __tablename__ = 'foods'

    id = db.Column(db.Integer, primary_key=True)
    meal_id = db.Column(db.Integer, db.ForeignKey('meals.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float)  # quantité en grammes ou unité
    unit = db.Column(db.String(20))  # g, ml, cup, piece, etc.
    calories = db.Column(db.Float)
    protein = db.Column(db.Float)  # en grammes
    carbs = db.Column(db.Float)    # en grammes
    fats = db.Column(db.Float)     # en grammes

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'unit': self.unit,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats
        }

    def __repr__(self):
        return f'<Food {self.name}>'
