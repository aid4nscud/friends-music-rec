from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import datetime
import time
import jwt
import string
import secrets
import array
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

# JWT USER AUTHENTICATION - FUNCTIONS BELOW


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
    # token = token.encode('UTF-8')
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

        token = token[1]

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

    curr_time = time.time()

    create_account_notification_object = {
        'type': 'create_account', 'time': curr_time}

    try:
        if(not username_exists and not email_exists):
            users.insert({
                'email': email,
                'username': username,
                'password': password,
                'following': [],
                'followers': [],
                'recs': [],
                'direct_recs': [],
                'viewed_recs': [],
                'notifications': [create_account_notification_object]
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

    curr_time = time.time()

    mystr = "FOLLOWING ARR:"
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

            follow_notification_object = {
                'type': 'follow', 'from': user_following['username'], 'time': curr_time}

            notifications = user_to_follow['notifications']
            exists = False

            if len(notifications) > 0:
                for no in notifications:

                    if no['type'] == 'follow':

                        if no['from'] == request.json['userFollowing']:
                            exists = True
                            break

            if exists == False:

                users.update(
                    {"username": user_to_follow['username']},
                    {
                        '$push': {
                            'followers': user_following['username'],
                            'notifications': follow_notification_object
                        }
                    }
                )

                return {'success': 'success'}

            else:
                users.update({'username': user_to_follow['username']}, {
                    '$pull': {'notifications': {'type': 'follow', 'from': request.json['userFollowing']}}})
                users.update({'username': user_to_follow['username']}, {
                    '$push': {
                        'followers': user_following['username'],
                        'notifications': follow_notification_object
                    }
                })

                return {'success': 'success'}

        except Exception as e:
            print(str(e) + 'is the issue')
            return {'error': str(e)}
    else:
        print('user allready followeed')
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
            print('success')
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

    curr_time = time.time()

    if request.json['uri'] not in user_recs:
        try:
            recommendations.insert({
                'song': request.json['song'],
                'artist': request.json['artist'],
                'user': request.json['user'],
                'uri': request.json['uri'],
                'likers': [],
                'views': 0,
                'date': curr_time
            })

            users.update(
                {"username": request.json['user']},
                {
                    '$push': {
                        'recs': request.json['uri']
                    }
                }

            )

            return {'success': 'success'}
        except Exception as e:
            print(e)
            return {'error': str(e)}
    else:
        return {'error': 'already recommended'}


@app.route('/api/create_direct_rec', methods={"POST"})
def create_direct_rec():
    user = request.json['user']
    recipients = request.json['recipients']

    curr_time = time.time()

    direct_rec = {
        'song': request.json['song'],
        'artist': request.json['artist'],
        'user': user,
        'uri': request.json['uri'],
        'date': curr_time,
        'caption': request.json['caption'],
        'action': None,
        'recipients': recipients,
    }

    try:
        users.update_one({'username': user}, {
            '$push': {'direct_recs': direct_rec}})

        for r in recipients:
            users.update_one({'username': r}, {
                             '$push': {'direct_recs': direct_rec}})

        return {'success': 'success'}
    except Exception as e:
        print(e)
        return {'error': str(e)}


@app.route('/api/delete_rec', methods={"POST"})
def delete_rec():

    try:
        recommendations.remove(
            {'uri': request.json['uri'], 'user': request.json['user']})
        users.update(
            {'username': request.json['user']},
            {'$pull': {"recs": request.json['uri']}}
        )
        return {'message': 'succesfully deleted'}
    except Exception as e:
        return {'error': str(e)}


@app.route('/api/like_rec', methods={"POST"})
def like_rec():
    rec_to_like = request.json['recToLike']
    rec_to_like = ObjectId(rec_to_like)
    user_liking = request.json['userLiking']

    user_liking_obj = users.find_one({'username': request.json['userLiking']})

    user_liking_username = user_liking_obj['username']

    rec = recommendations.find_one({"_id": rec_to_like})
    user_to_like = rec['user']

    curr_time = time.time()

    like_notification_object = {'type': 'like', 'from': user_liking_username,
                                'time': curr_time, 'rec': request.json['recToLike']}

    likers_arr = rec['likers']
    print(likers_arr)
    if user_liking not in rec['likers']:

        recommendations.update(
            {"_id": rec_to_like},
            {
                '$push': {
                    'likers': user_liking
                }
            }
        )
        user_to_like = users.find_one({'username': user_to_like})
        notifications = user_to_like['notifications']
        exists = False

        if len(notifications) > 0:
            for no in notifications:

                if no['type'] == 'like':

                    if no['rec'] == request.json['recToLike']:
                        exists = True
                        break
        print(exists)

        if exists == False:

            users.update({'username': user_to_like['username']}, {
                '$push': {'notifications': like_notification_object}})

            return {'success': 'success'}

        else:
            users.update({'username': user_to_like['username']}, {
                '$pull': {'notifications': {'rec': request.json['recToLike'], 'from': request.json['userLiking'
                                                                                                   ]}}})
            users.update({'username': user_to_like['username']}, {
                '$push': {'notifications': like_notification_object}})

            return {'success': 'success'}
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


# ROUTES TO ACCESS RECOMMENDATIONS DISPLAYED IN THE SECTIONS: "DISCOVER" and "PROFILE" OF APP


@app.route('/api/get_main_recs', methods={"POST"})
def get_main_recs():
    username = request.json['user']
    try:
        dir_recs = get_direct_recs(username)  # obj

        disc_recs = get_discover_recs(username)  # obj

        friend_recs = get_friend_recs(username)  # obj

        return {'dir_recs': dir_recs['dir_recs'], 'disc_recs': disc_recs['disc_recs'], 'friend_recs': friend_recs['friend_recs']}
    except Exception as e:
        print(str(e))
        return {'error': str(e)}


def get_direct_recs(user):
    username = user
    try:
        user = users.find_one({'username': username})
        arr = user['direct_recs']
        dir_recs = []
        for doc in arr:
            if doc['user'] != username:
                dir_recs.append({


                    'song': doc['song'],
                    'artist': doc['artist'],
                    'user': doc['user'],
                    'uri': doc['uri'],
                    'date': doc['date'],
                    'caption': doc['caption']

                })
        dir_recs.reverse()
        return {'dir_recs': dir_recs}

    except Exception as e:
        print(e)
        return {'error': str(e)}


def get_discover_recs(user_var):

    user = users.find_one({'username': user_var})
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
                'uri': doc['uri'],
                'likes':  len(doc['likers']),
                'views': doc['views'],
                'liked': liked,
                'date': doc['date']
            })

    recs.reverse()

    return {'disc_recs': recs}


def get_friend_recs(user_var):

    username = user_var

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
                'uri': doc['uri'],
                'likes': len(doc['likers']),
                'views': doc['views'],
                'liked': liked,
                'date': doc['date']
            })

    recs.reverse()

    return {'friend_recs': recs}


@app.route('/api/get_user_profile', methods={"POST"})
def get__user_profile():

    # declaring user who is searching the profile
    requesting_user = request.json['requestingUser']
    requesting_user = users.find_one({'username': requesting_user})

    # declaring user that is being searched
    username = request.json['user']
    username = users.find_one({'username': username})

    # searching db for searched user's recommendations
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
            'uri': doc['uri'],
            'likes': len(doc['likers']),
            'views': doc['views'],
            'date': doc['date'],
            'liked': liked,

        })
    recs.reverse()
    dir_arr = users.find({'username': request.json['user']})

    dir_recs = []
    for doc in dir_arr:
        for rec in doc['direct_recs']:
            if rec['user'] == request.json['requestingUser']:

                dir_recs.append({
                    'song': rec['song'],
                    'artist': rec['artist'],
                    'user': rec['user'],
                    'uri': rec['uri'],
                    'date': rec['date'],
                    'caption': rec['caption'],
                    'action': rec['action'],
                    'recipients': rec['recipients'],
                })
    # getting user follower/following numbers

    num_followers = len(username['followers'])
    num_following = len(username['following'])

    followed = False

    if(requesting_user['username'] in username['followers']):
        followed = True
        return {'recs': recs, 'dir_recs': dir_recs, 'num_followers': num_followers, 'num_following': num_following, 'followed': followed}

    elif(requesting_user['username'] == username['username']):
        followed = False
        return {'recs': recs, 'dir_recs': dir_recs, 'num_followers': num_followers, 'num_following': num_following, 'followed': followed}


@app.route('/api/search_user', methods={"POST"})
def search_user():
    try:
        user = request.json['user']
        arr = users.find({"username": {'$regex': ".*" + user}})
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


@app.route('/api/get_friends', methods={"POST"})
def get_friends():

    username = request.json['user']

    user = users.find_one({'username': username})

    followers = user['followers']
    following = user['following']

    followers_set = set(followers)

    mutual = followers_set.intersection(following)

    print(list(mutual))

    return {'friends': list(mutual)}


@app.route('/api/get_notifications', methods={"POST"})
def get_notifications():

    username = request.json['user']

    user = users.find_one({'username': username})

    try:
        notifications = list(user['notifications'])
        notifications.reverse()
        return {'notifications': notifications}
    except Exception as e:
        print(e)
        return {'error': str(e)}


@app.route('/api/view_rec', methods={"POST"})
def view_rec():
    rec_id = request.json['recId']
    username = request.json['user']
    print(rec_id)

    try:
        recommendations.update(
            {"_id": ObjectId(rec_id)},
            {
                '$inc': {
                    'views': 1
                }
            }
        )
        user = users.find_one({'username': username})
        user_viewed = user['viewed_recs']
        exists = False
        for r in user_viewed:
            if rec_id == r['id']:
                exists = True
                break

        print(exists)

        if exists == True:

            users.update_one(
                {'username': username},
                {'$inc': {
                    "viewed_recs.$[elem].count": 1

                }}, False,  array_filters=[{"elem.id":  {'$eq': rec_id}}]
            )

        if exists == False:
            users.update(
                {"username": username},
                {
                    '$push': {
                        'viewed_recs': {'id': rec_id, 'count': 1}
                    }
                }
            )

        return {'success': 'success'}

    except Exception as e:
        print(str(e))
        return {'error': str(e)}
