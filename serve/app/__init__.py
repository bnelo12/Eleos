import logging

from flask import Flask
from flask_socketio import SocketIO

import eventlet
eventlet.monkey_patch()

app = Flask(__name__)

socketio = SocketIO(app, async_mode="eventlet", async_handlers=True)

from app import socket