from datetime import datetime
from backend.database import db


class Workout(db.Model):
    __tablename__ = 'workouts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Integer)  # en minutes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relation avec les exercices
    exercises = db.relationship(
        'Exercise', backref='workout', lazy=True, cascade='all, delete-orphan')

    # Relation avec l'utilisateur
    user = db.relationship('User', backref='workouts')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'notes': self.notes,
            'date': self.date.isoformat(),
            'duration': self.duration,
            'exercises': [ex.to_dict() for ex in self.exercises],
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<Workout {self.title}>'


class Exercise(db.Model):
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey(
        'workouts.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    weight = db.Column(db.Float)  # en kg
    duration = db.Column(db.Integer)  # en secondes (pour cardio)
    notes = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'sets': self.sets,
            'reps': self.reps,
            'weight': self.weight,
            'duration': self.duration,
            'notes': self.notes
        }

    def __repr__(self):
        return f'<Exercise {self.name}>'
