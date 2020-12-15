
## The goal of this project is to create a MVP for an application that can allow users to recommend their favorite songs to, as well as discover new music from their friends and other unknown users. 


Users will have a profile that is made up of their song recommendations (with associated information for each one). 
             - Views
             - Likes
             - Score that evaluates how well the song recommendation is received


## MVP FEATURES:

**- Login/Register a User**

**- User can search any song, recommend it, and find it under their profile.**

**- User can view their profile, as well as that of others**

**- User can explore recommendations and interact with them (like, follow recommender)**

**- User can search users and follow immediately, or click on the profiles of the user results**

**- User can see recommendations of users they follow and interact with them (like, ??)**




TODO:

- Spotify Authorization Code Flow
- Add Logic to Rec and User Objects:
  - When user goes to next rec, rec id added to 'seen' recs array with respective interaction 'liked' or 'unliked'
  - Calculate score based on interactions 
- Possibly add commenting to friend recs.
