# Eleos

This project was developed for PennApps XVIII. Eleos is online platform for bringing together those who want to donate to victims of a disater, and those who need the donations.

## Installation
Eleos runs on the MongoDB Stitch cloud platform and thus does not have any pre-requisites or installation requirements. Their is an optional Flask server that runs to enable live updates in the dashboard.

For the Flask server you need:
```
flask
eventlet
flask-socketio
```

to run the flask server:
```
cd serve
flask run
```
