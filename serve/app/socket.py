from app import socketio

@socketio.on('connect')
def test_connect():
    print("Client Connected!")

@socketio.on('donation-upload')
def donation_upload(doc):
    socketio.emit('donation-download', doc)

@socketio.on('request-upload')
def request_upload(doc):
    socketio.emit('request-download', doc)