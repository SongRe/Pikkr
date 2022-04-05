# Pikkr

Description
-
Pikkr is a mobile application intended to help groups of people select on movies to watch. Using Google Firebase, it handles selection through a simple voting system, showing the user 
a list of movies one at a time, with the user simply swiping in order to vote on movies. 

Technology Used
-
- Google Firebase / Firestore
- Typescript / Javascript
- React Native
- Recoil
- (Originally) Android Studio + Java

UI
-

![image](https://user-images.githubusercontent.com/49730299/133906004-3c8058ca-9b4f-4ad1-85cf-95868d096e3f.png)
![image](https://user-images.githubusercontent.com/49730299/133906008-ef301451-7142-4329-8d6f-6b694c7062c0.png)
![image](https://user-images.githubusercontent.com/49730299/133906011-e8182f94-3aa3-427a-8719-071ea0a850dd.png)
![image](https://user-images.githubusercontent.com/49730299/133906015-95ca4eb0-d5a6-487a-83a4-25e2c57c8e41.png)


Future Updates
-
- Updating app to match new Figma updates
- Voting sync with Firestore
- Tracker for movies watched, and update recommendations accordingly
- Authentication for users

Useful commands 
- ```expo start``` will launch the app
- ```jest -watchAll``` will launch the app in test

Useful scripts
- ```expo start --android```
- ```expo start --ios```
- ```expo start --web```

Useful documentation for reference:
- https://docs.expo.dev/guides/using-firebase/#using-expo-with-firestore
- https://firebase.google.com/docs/firestore/query-data/listen
- https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
- https://developers.themoviedb.org/3/getting-started/introduction
