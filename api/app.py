from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
import datetime


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
client = MongoClient(port=27017)
db = client.prototype
users = db.users
recommendations = db.recommendations



@app.route('/create_rec', methods={"POST"})
def create_rec():
    recommendations.insert({
        'song': request.json['song'],
        'artist': request.json['artist'],
        'user': request.json['user'],
        'images': request.json['images'],
        'uri': request.json['uri']
            })
    
    print('succesfully added')
    return 'received'
    
    

@app.route('/get_recs', methods={"GET"})
def get_recs():
    recs = []
    for doc in db.recommendations.find():
        recs.append({
            '_id': str(doc['_id']),
            'song': doc['song'],
            'artist': doc['artist'],
            'user': doc['user'],
            'images': doc['images'],
            'uri': doc['uri']
        })
    return {'recs': recs}


@app.route('/login', methods={'POST'})
def login():
    message = ''
    req = request.json
    username = req['username']
    password = req['password']
    creds = users.find_one({'username': username})
    if(creds):
        if(creds['password'] == password):
            message = 'successful login'
        else:
            message = 'wrong password'
    else:
        message = 'invalid username'
    return {'message': message}




@app.route('/register', methods={'POST'})
def register():
    
    
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    users.insert({
        'email': email,
        'username': username,
        'password': password,
            })
    
    return {'message': 'account created successfully'}
    

    

