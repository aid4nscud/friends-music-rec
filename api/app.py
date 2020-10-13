from flask import Flask, request, jsonify
from pymongo import MongoClient





app = Flask(__name__)
client = MongoClient(port=27017)
db = client.prototype





@app.route('/create_rec', methods={"POST"})
def create_rec():
    db.recommendations.insert({
        'song': request.json['song'],
        'artist': request.json['artist'],
        'user': request.json['user'],
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
        })
    return {'recs': recs}


    
    

   

    
        
