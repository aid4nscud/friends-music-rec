from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import datetime
import jwt
import string
import secrets
alphabet = string.ascii_letters + string.digits
password = 'bruh'


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
    #token = token.encode('UTF-8')
    try:
        payload = jwt.decode(token, password, algorithm='HS256')
        return payload
    except jwt.ExpiredSignatureError:
        return {'error: jwt.ExpiredSignatureError'}
    except jwt.InvalidTokenError:
        return 'error: jwt.InvalidTokenError'


@app.route('/auth_decode', methods={"GET"})
def check_token():
    
    auth_header = request.headers.get('Authorization')
    if auth_header:
        # Parses out the "Bearer" portion
        token = auth_header.split(" ")
        print(token)
        token = token[1]
        print(token)
    else:
        token = ''

    if token:
        decoded = decodeAuthToken(token)
        if isinstance(decoded, str):
            return {'error': decoded}
        else:
            return decoded
            


    

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

    try:
        if(not username_exists and not email_exists):
            users.insert({
                'email': email,
                'username': username,
                'password': password,
                'following': [],
                'followers': [],
                'recs':[],
            })
            message = 'account succesfully created'
            return {'success': message}

        else:
            message = 'that username or email is already in use'
            return {'error': message}
    except Exception as e:
        print(e)
        return {'error': str(e)}



# USER ACTIONS ON APP 



@app.route('/api/follow_user', methods={"POST"})
def follow_user():
   
    user_to_follow = request.json['userToFollow']
    user_following = request.json['userFollowing']
    user_to_follow = users.find_one({'username': user_to_follow})
    user_following = users.find_one({'username': user_following})
    following_arr = user_following['following']

    mystr = "FOLLOWING ARR: "
    print(mystr)
    print(following_arr)
    print('USER TO FOLLOW: ' + user_to_follow['username'])

    if user_to_follow['username'] != user_following['username'] and user_to_follow['username'] not in following_arr:
        try:
            users.update(
                {"username": user_following['username']},
                {
                '$push': {
                    'following': user_to_follow['username']
                        }
                }
                )
            users.update(
                {"username": user_to_follow['username']},
                {
                    '$push': {
                        'followers': user_following['username']
                    }
                }
                )

            return {'success': 'success'}
 
        except Exception as e:
            print(e)
            return e
    else:
        return {'error': 'user already followed'}
   

@app.route('/api/unfollow_user', methods={"POST"})
def unfollow_user():
    user_to_unfollow = request.json['userToUnfollow']
    user_unfollowing = request.json['userUnfollowing']


    user_to_unfollow = users.find_one({'username': user_to_unfollow})
    user_unfollowing = users.find_one({'username': user_unfollowing})

    followingArr = user_unfollowing['following']

 

    try:
        if user_to_unfollow['username'] in followingArr:
            users.update(
                {"username": user_unfollowing['username']},
                {
                    '$pull': {
                        'following': user_to_unfollow['username']
                    }
                }
            )
            users.update(
                {"username": user_to_unfollow['username']},
                {
                    '$pull': {
                        'followers': user_unfollowing['username']
                    }
                }
                )
            return {'success': 'success'}
    except Exception as e:
        print(e)



@app.route('/api/create_rec', methods={"POST"})
def create_rec():
    user = users.find_one({'username': request.json['user']})
    print(user)
    user_recs = user['recs']
    print(user_recs)
    print(request.json['uri'])
    
    if request.json['uri'] not in user_recs:
        try:
            recommendations.insert({
            'song': request.json['song'],
            'artist': request.json['artist'],
            'user': request.json['user'],
            'images': request.json['images'],
            'uri': request.json['uri'],
            'likers': [],
            'date': request.json['date']
             })

            users.update(
                {"username": request.json['user']},
                {
                    '$push': {
                    'recs': request.json['uri']
                    }
                }
            
            )

            return {'success':'success'}
        except Exception as e:
            print(e)
            return {'error': str(e)}
    else:
        return {'error': 'already recommended'}

    


@app.route('/api/delete_rec', methods={"POST"})
def delete_rec():

    try:
        recommendations.remove({'song': request.json['song'], 'user': request.json['user']})
        return {'message':'succesfully deleted'}
    except Exception as e:
        return {'error':str(e)}
    
    
    


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


@app.route('/api/unlike_rec', methods={"POST"})
def unlike_rec():
    rec_to_unlike = request.json['recToUnlike']
    rec_to_unlike = ObjectId(rec_to_unlike)
    user_unliking = request.json['userUnliking']

    rec = recommendations.find_one({"_id": rec_to_unlike})
    likers_arr = rec['likers']
    print(likers_arr)
    if user_unliking in rec['likers']:
        try:
            recommendations.update(
                {"_id": rec_to_unlike},
                {
                    '$pull': {
                    'likers': user_unliking
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

            liked = False

            if(user['username'] in doc['likers']):
                liked = True
          
            recs.append({
                '_id': str(doc['_id']),
                'song': doc['song'],
                'artist': doc['artist'],
                'user': doc['user'],
                'images': doc['images'],
                'uri': doc['uri'],
                'likes':  len(doc['likers']),
                'liked': liked,
                'date': doc['date']
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
            liked = False

            if(user['username'] in doc['likers']):
                    liked = True
            
            recs.append({
                '_id': str(doc['_id']),
                'song': doc['song'],
                'artist': doc['artist'],
                'user': doc['user'],
                'images': doc['images'],
                'uri': doc['uri'],
                'likes': len(doc['likers']),
                'liked': liked,
                'date': doc['date']
            })

    return {'recs': recs}


@app.route('/api/get_user_profile', methods={"POST"})
def get__user_profile():

    #declaring user who is searching the profile
    requesting_user = request.json['requestingUser']
    requesting_user = users.find_one({'username': requesting_user})

    #declaring user that is being searched
    username = request.json['user']
    username = users.find_one({'username': username})

    #searching db for searched user's recommendations
    recs = []
    arr = recommendations.find({'user': username['username']})
    for doc in arr:

        liked = False
        if(requesting_user['username'] in doc['likers']):
            liked = True
        
        recs.append({
            '_id': str(doc['_id']),
            'song': doc['song'],
            'artist': doc['artist'],
            'user': doc['user'],
            'images': doc['images'],
            'uri': doc['uri'],
            'likes': len(doc['likers']),
            'date': doc['date'],
            'liked': liked
        })
    
    #getting user follower/following numbers

    num_followers = len(username['followers'])
    num_following = len(username['following'])

    followed = False
        
    if(requesting_user['username'] in username['followers']):
        followed=True
        return {'recs': recs, 'num_followers': num_followers, 'num_following':num_following, 'followed': followed}

    elif(requesting_user['username'] == username['username']):
        followed = False
        return {'recs': recs, 'num_followers': num_followers, 'num_following':num_following, 'followed': followed}
    

    return {'recs': recs, 'num_followers': num_followers, 'num_following':num_following, 'followed': followed}


    
        



@app.route('/api/search_user', methods={"POST"})
def search_user():
    try:
        user = request.json['user']
        arr = users.find({"username" : {'$regex' : ".*"+ user }})
        usersArr = []
        searcher_name = request.json['searcher']
        searcher = users.find_one({'username': searcher_name})
        searcher_following = searcher['following']

        
        for u in arr:
            following = False
            if u['username'] in searcher_following and u['username'] != searcher_name:
                following = True

            
            numFollowers = len(u['followers'])
            usersArr.append({
                '_id': str(u['_id']),
                'username': u['username'],
                'followers': numFollowers,
                'isFollowing': following

            })
        if len(usersArr) > 0:
            return {'users': usersArr}
        else:
            return {'noresults': 'noresults'}
    except Exception as e:
        print(e)
        return {'error': 'error'}
    

    









