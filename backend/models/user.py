from datetime import datetime
from backend.database import db
from backend.utils import hash_password, check_password


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """Définit le mot de passe (haché)"""
        self.password_hash = hash_password(password)

    def check_password(self, password):
        """Vérifie si le mot de passe est correct"""
        return check_password(self.password_hash, password)

    def to_dict(self):
        """Convertit l'utilisateur en dictionnaire (sans le mot de passe!)"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<User {self.email}>'
