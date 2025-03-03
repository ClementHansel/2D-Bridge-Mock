import eventlet
eventlet.monkey_patch()  # Must be the very first import

import time
import random
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, async_mode='eventlet')

@app.route('/')
def index():
    return render_template('index.html')

def generate_mock_data():
    while True:
        with app.app_context():
            sensor_data = [
                {'id': 1, 'x': 200, 'y': 190, 'value': random.randint(30, 100)},
                {'id': 2, 'x': 400, 'y': 190, 'value': random.randint(30, 100)},
                {'id': 3, 'x': 600, 'y': 190, 'value': random.randint(30, 100)}
            ]
            socketio.emit("heatmap_update", sensor_data, namespace="/")
        time.sleep(3)

@socketio.on('connect')
def handle_connect():
    print("Client connected")

if __name__ == '__main__':
    socketio.start_background_task(generate_mock_data)
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
