from backend.routes.workouts import workouts_bp
from backend.routes.nutrition import nutrition_bp
from backend.routes.auth import auth_bp
from backend.models import user
from backend.utils import init_bcrypt
from flask import Flask
from flask_cors import CORS
from backend.config import Config
from backend.database import db

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={
     r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}})

# Initialize database
db.init_app(app)

# Initialize Bcrypt
init_bcrypt(app)

# Import models

# Import et enregistrer les blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(workouts_bp, url_prefix='/api/workouts')
app.register_blueprint(nutrition_bp, url_prefix='/api/nutrition')
# Routes de test


@app.route('/')
def home():
    return {'message': 'Zenfit API is running!', 'status': 'success'}


@app.route('/api/health')
def health():
    return {'status': 'healthy', 'database': 'connected'}


if __name__ == '__main__':
    app.run(debug=True, port=5000)
