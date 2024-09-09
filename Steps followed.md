# Steps followed

## Step - 1
- setup dev folders
  - Parent folder with app name
  - childe folders with name - frontend and backend
  - In Parent folder, 
    - run npm init -y
      - reason why we are keeping it not specific to backend folder is it is going to help deployment easily
      - Whenever packages are installed for backen, it will be done on the rrot/parent folder.
    - Add .gitignore file

## Step-2
- Run `npm i express mongoose dotenv`
  - packages gets installed
  - express will be used as our web framework.
    - we can build api's easily with routing system
  - mongoose will be used interact with our db (mongo DB)
  - dotenv package will be used to access env variables

## Step-3
- Create server.js within backend folder
  - could be main.js, app.js, etc as per standard.
  - entry point for our api
- import express and create an express app
- add type:module in package.json, so that we could use es6 standards during code development
- add basic code for setting up the express app
- add command to package.json under scripts to run backend solution.