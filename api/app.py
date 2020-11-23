from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
import datetime
import jwt


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
client = MongoClient(port=27017)
db = client.prototype
users = db.users
recommendations = db.recommendations


def encodeAuthToken(user_id):
    try:
        payload = {
            'iat': datetime.datetime.utcnow(),
            'user': user_id,
        }
        token = jwt.encode(payload, 'super-secret-key', algorithm='HS256')
        return token
    except Exception as e:
        print (e)
        return e


def decodeAuthToken(token):
    try:
        payload = jwt.decode(token, 'super-secret-key', algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Login please'
    except jwt.InvalidTokenError:
        return 'Nice try, invalid token. Login please'

@app.route('/auth_decode', methods={"GET"})
def check_token():
    error = ''
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = bytes(auth_header.split(" ")[1], 'UTF-8') # Parses out the "Bearer" portion
    else:
        token = ''

    if token:
        decoded = decodeAuthToken(token)
        if not isinstance(decoded, str):
            return decoded
        else:
            error = 'problem decoding token'
            return {'error': error}





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
    
    

@app.route('/get_feed_recs/<user>', methods={"GET"})
def get_feed_recs(user):
    test = user
    print(test)
    recs = []
    for doc in db.recommendations.find():
        if(doc['user'] != user):
            recs.append({
                '_id': str(doc['_id']),
                'song': doc['song'],
                'artist': doc['artist'],
                'user': doc['user'],
                'images': doc['images'],
                'uri': doc['uri']
            })

    return {'recs': recs}

@app.route('/get_user_recs/<user>', methods={"GET"})
def get__user_recs(user):
    recs = []
    arr = db.recommendations.find({'user': user})
    for doc in arr:
        recs.append({
                '_id': str(doc['_id']),
                'song': doc['song'],
                'artist': doc['artist'],
                'user': doc['user'],
                'images': doc['images'],
                'uri': doc['uri']
            })

    return {'recs': recs}


@app.route('/api/login', methods={'POST'})
def login():
    error = ''
    req = request.json
    username = req['username']
    password = req['password']
    creds = users.find_one({'username': username})
    if(creds):
        if(creds['password'] == password):
            token = encodeAuthToken(username).decode('UTF-8')
            return {'token': token}
        else:
            error = 'Wrong Password'
            return {'error': error}
    else:
        error = 'Invalid Username'
        return {'error': error}
    




@app.route('/api/register', methods={'POST'})
def register():
    
    message = ''
    
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    username_exists = users.find_one({'username': username})
    email_exists = users.find_one({'email': email})

    if(not username_exists and not email_exists):
        users.insert({
        'email': email,
        'username': username,
        'password': password,
            })
        message = 'account succesfully created'
        return {'success': message}

    else:
        message = 'that username or email is already in use'
        return {'error': message}


    

    

