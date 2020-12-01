from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
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

'''@app.route('/callback')
def callback():
    error = request.args.get('error')
    code = request.args.get('code')
    state = request.args.get('state')
    stored_state = request.cookies.get('spotify_auth_state')

    # Check state
    if state is None or state != stored_state:
        app.logger.error('Error message: %s', repr(error))
        app.logger.error('State mismatch: %s != %s', stored_state, state)
        abort(400)

    # Request tokens with code we obtained
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
    }

    # `auth=(CLIENT_ID, SECRET)` basically wraps an 'Authorization'
    # header with value:
    # b'Basic ' + b64encode((CLIENT_ID + ':' + SECRET).encode())
    res = requests.post(TOKEN_URL, auth=(
        CLIENT_ID, CLIENT_SECRET), data=payload)
    res_data = res.json()

    if res_data.get('error') or res.status_code != 200:
        app.logger.error(
            'Failed to receive token: %s',
            res_data.get('error', 'No error information received.'),
        )
        abort(res.status_code)

    # Load tokens into session
    session['tokens'] = {
        'access_token': res_data.get('access_token'),
        'refresh_token': res_data.get('refresh_token'),
    }

    return redirect(url_for('me'))'''


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


#AUTH WITH APP

    error = ''
    req = request.json
    username = req['username']
    password = req['password']
    creds = users.find_one({'username': username})
    if(creds):
        if(creds['password'] == password):
            token = encodeAuthToken(username).decode('UTF-8')

            #AUTH WITH SPOTIFY

            #state = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(16))

            #payload = {
             #   'client_id': CLIENT_ID,
              #  'response_type': 'code',
               # 'redirect_uri': REDIRECT_URI,
                #'state': state,

           # }

            #url = f'{AUTH_URL}/?{urlencode(payload)}'

            return {'token': token}
        else:
            error = 'Wrong Password'
            return {'error': error}
    else:
        error = 'Invalid Username'
        return {'error': error}

'''@app.route('/refresh')
def refresh():
    #Refresh access token.

    payload = {
        'grant_type': 'refresh_token',
        'refresh_token': session.get('tokens').get('refresh_token'),
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    res = requests.post(
        TOKEN_URL, auth=(CLIENT_ID, CLIENT_SECRET), data=payload, headers=headers
    )
    res_data = res.json()

    # Load new token into session
    session['tokens']['access_token'] = res_data.get('access_token')

    return json.dumps(session['tokens'])
'''


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
        'uri': request.json['uri']
    })

    print('succesfully added')
    return 'received'

@app.route('/api/delete_rec', methods={"POST"})
def delete_rec():
    recommendations.remove({'song': request.json['song'], 'user': request.json['user']})

    print('succesfully added')
    return 'received'




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
                'uri': doc['uri']
            })

    return {'recs': recs}


@app.route('/get_friend_recs/<user>', methods={"GET"})
def get_friend_recs(user):
    user = users.find_one({'username': user})
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



