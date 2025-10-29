from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from backend.config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize database
db = SQLAlchemy(app)

# Route de test


@app.route('/')
def home():
    return {'message': 'Zenfit API is running!', 'status': 'success'}


@app.route('/api/health')
def health():
    return {'status': 'healthy', 'database': 'connected'}


if __name__ == '__main__':
    app.run(debug=True, port=5000)
