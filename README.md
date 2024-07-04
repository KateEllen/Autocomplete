# autocomplete


## Author 
Kate_Ellen

## Project Overview 
This app autocompletes song suggestions. It was created using Flask and React with a pre provided JSON file. 
There are added features to increase user experience, such as radio buttons to swicth between title or artist and an OpenAI fun fact button to generate fun music facts. 

### Implemented

## Features 
- Search bar that autocompletes selection
- Radio buttons to Search for song Title or Artist
- Last Search at footer of page to show what song you last selected
- OpenAI fun fact button to give you a random music fact

## Technologies Used

### Languages

- [Python](https://www.w3schools.com/python/) - to get suggestions and fun music fact.
- [CSS3](https://www.w3schools.com/css/) - to style the page.
- [JavaScript](https://www.javascript.com/) - to add interactions with the page.

### Libraries

- [React](https://reactjs.org/) - to make an easier interactive UI.
- [Flask](https://flask.palletsprojects.com/en/3.0.x/) - Micro web framework written in Python.

### Programs and Tools

- [VSCode](https://code.visualstudio.com/) - used as IDE for the project.
- [Git](https://git-scm.com/) - used for version control.
- [Github](https://github.com/) - used to host repository and to generate the live website.
- [Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools) - used to test and optimize the site.

### JS Tools Installed

#### **npm**

At the root of your project

```
npm init
```

#### **Git**

```
git init
```

Create the .gitinore file.

#### **React**

```
npm install react
```

#### **Axios**

```
npm install axios
```

#### **Vite**

```
npm create vite@latest
```

## How to run locally

** To use OPENAI you will need your own API key. This should be added to a .env file and added to .gitignore file for security. **
Step 1 - Open two terminals
Step 2 - Install the python requirements by typing: ** pip install -r requirements.txt ** into the first terminal
Step 3 - To run the backend type 'python app.py' in the first terminal
Step 4 - Install JavaScript tools as outlined above in the second terminal
Step 5 - To run the front end type 'npm run dev' in the second terminal. 
Step 6 - In your second terminal where you are running the front end find the local host. This will look like: **Local:   http://127.0.0.1:5173/**. Open your local host in the browser. 
Step 7 - The App should now be viewable and workable. 


### Features left to impliment. 
- To make the fun fact button generate a fun fact about the selected song or artist