from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import datetime
import jwt
import string
import secrets
alphabet = string.ascii_letters + string.digits
password = ''.join(secrets.choice(alphabet) for i in range(8))


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
client = MongoClient(port=27017)
db = client.prototype
users = db.users
recommendations = db.recommendations

# Client info
CLIENT_ID = "c9e32a7a65884148a2a7c88cef4da3fc"
CLIENT_SECRET = "c3f0bbacf20347d099a7af4792a5699a"

REDIRECT_URI = ''


# Spotify API endpoints
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'



# AUTHORIZATION FLOW SPOTIFY:







# JWT FOR USER AUTHENTICATION - FUNCTIONS BELOW

def encodeAuthToken(user_id):
    try:
        payload = {
            'iat': datetime.datetime.utcnow(),
            'user': user_id,
        }
        token = jwt.encode(payload, password, algorithm='HS256')
        return token
    except Exception as e:
        print(e)
        return e


def decodeAuthToken(token):
    try:
        payload = jwt.decode(token, password, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return 'jwt.ExpiredSignatureError'
    except jwt.InvalidTokenError:
        return 'jwt.InvalidTokenError'


@app.route('/auth_decode', methods={"GET"})
def check_token():
    error = ''
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header:
        # Parses out the "Bearer" portion
        token = bytes(auth_header.split(" ")[1], 'UTF-8')
    else:
        token = ''

    if token:
        decoded = decodeAuthToken(token)
        try:
            if not isinstance(decoded, str):
                return decoded
            else:
                error = 'problem decoding token'
                return {'error': error}
        except Exception as e:
            print(e)


@app.route('/api/login', methods={'POST'})
def login():


#AUTH WITH APP + SPOTIFY

    error = ''
    req = request.json
    username = req['username']
    password = req['password']
    creds = users.find_one({'username': username})
    if(creds):
        if(creds['password'] == password):
            token = encodeAuthToken(username).decode('UTF-8')

            return {'token': token, 'user': username}
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
            'following': [],
            'followers': [],
        })
        message = 'account succesfully created'
        return {'success': message}

    else:
        message = 'that username or email is already in use'
        return {'error': message}



# USER ACTIONS ON APP 



@app.route('/api/follow_user', methods={"POST"})
def follow_user():
    user_to_follow = request.json['userToFollow']
    user_following = request.json['userFollowing']

    try:
        users.update(
            {"username": user_following},
            {
                '$push': {
                    'following': user_to_follow
                }
            }
        )
        users.update(
            {"username": user_to_follow},
            {
                '$push': {
                    'followers': user_following
                }
            }
        )
        return {'success': 'success'}
    except Exception as e:
        print(e)

@app.route('/api/unfollow_user', methods={"POST"})
def unfollow_user():
    user_to_unfollow = request.json['userToUnfollow']
    user_unfollowing = request.json['userUnfollowing']

    try:
        users.update(
            {"username": user_unfollowing},
            {
                '$pull': {
                    'following': user_to_unfollow
                }
            }
        )
        return {'success': 'success'}
    except Exception as e:
        print(e)



@app.route('/create_rec', methods={"POST"})
def create_rec():
    recommendations.insert({
        'song': request.json['song'],
        'artist': request.json['artist'],
        'user': request.json['user'],
        'images': request.json['images'],
        'uri': request.json['uri'],
        'likers': []
    })

    return print('succesfully added')
    


@app.route('/api/delete_rec', methods={"POST"})
def delete_rec():
    recommendations.remove({'song': request.json['song'], 'user': request.json['user']})

    return print('succesfully deleted')
    


@app.route('/api/like_rec', methods={"POST"})
def like_rec():
    rec_to_like = request.json['recToLike']
    rec_to_like = ObjectId(rec_to_like)
    user_liking = request.json['userLiking']

    rec = recommendations.find_one({"_id": rec_to_like})
    likers_arr = rec['likers']
    print(likers_arr)
    if user_liking not in rec['likers']:
        try:
            recommendations.update(
                {"_id": rec_to_like},
                {
                    '$push': {
                    'likers': user_liking
                    }
                }
            )
            return {'success': 'success'}
        except Exception as e:
            print(e)
            return e
    else:
        return {'error': 'error'}
    




# ROUTES TO ACCESS RECOMMENDATIONS DISPLAYED IN THE SECTIONS: "DISCOVER", "LISTEN", AND "PROFILE" OF APP

        # NEED TO CHANGE THIS: WHY TF IS IT IN THE URL????????
@app.route('/api/get_discover_recs', methods={"POST"})
def get_discover_recs():
    print(request.json['user'])
    user = users.find_one({'username': request.json['user']})
    user_following = user['following']
    recs = []
    for doc in recommendations.find():
        if(doc['user'] != user['username'] and doc['user'] not in user_following):
          
            recs.append({
                '_id': str(doc['_id']),
                'song': doc['song'],
                'artist': doc['artist'],
                'user': doc['user'],
                'images': doc['images'],
                'uri': doc['uri'],
                'likes':  len(doc['likers']),
            })

    return {'recs': recs}


@app.route('/api/get_friend_recs', methods={"POST"})
def get_friend_recs():

    username = request.json['user']

    user = users.find_one({'username': username})

    user_following = user['following']
    recs = []
    for doc in recommendations.find():
        if(doc['user'] != user['username'] and doc['user'] in user_following):
            recs.append({
                '_id': str(doc['_id']),
                'song': doc['song'],
                'artist': doc['artist'],
                'user': doc['user'],
                'images': doc['images'],
                'uri': doc['uri'],
                'likes': len(doc['likers'])
            })

    return {'recs': recs}


@app.route('/api/get_user_recs', methods={"POST"})
def get__user_recs():
    user = request.json['user']
    recs = []
    arr = recommendations.find({'user': user})
    for doc in arr:
        recs.append({
            '_id': str(doc['_id']),
            'song': doc['song'],
            'artist': doc['artist'],
            'user': doc['user'],
            'images': doc['images'],
            'uri': doc['uri'],
            'likes': len(doc['likers'])
        })

    return {'recs': recs}



@app.route('/api/search_user', methods={"POST"})
def search_user():
    try:
        user = request.json['user']
        arr = users.find({"username" : {'$regex' : ".*" + user + ".*"}})
        usersArr = []
        for u in arr:
            numFollowers = len(u['followers'])
            print(numFollowers)
            usersArr.append({
                '_id': str(u['_id']),
                'username': u['username'],
                'followers': numFollowers,

            })
        if len(usersArr) > 0:
            return {'users': usersArr}
        else:
            return {'noresults': 'noresults'}
    except Exception as e:
        print(e)
        return {'error': 'error'}
    

    









