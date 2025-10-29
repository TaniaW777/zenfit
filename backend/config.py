import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Secret key for session management
    SECRET_KEY = os.environ.get(
        'SECRET_KEY') or 'dev-secret-key-change-in-production'

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL') or 'postgresql://postgres:password@localhost/zenfit'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Other configurations
    DEBUG = True
