# MovieCamp Movie Review App

### <a href="https://tolga-moviecamp.herokuapp.com" target="_blank">🌍&nbsp; GO TO LIVE DEMO</a>

#

## 📄 About

It's a movie review app where users can create, see, update and delete movies and actors. Besides, users are able to share movies and actors, and like/unlike/leave comment to all shared items. Both social (google/facebook) and local sign in methods are present in the app. JSON web tokens are used to authenticate users for every request involving CRUD operations and accessing members' content.

Developed by <a href="https://github.com/tolgakarasay">Tolga Karasay</a> within the context of the Gusto & RemoteTeam Node.js Bootcamp as a graduation project.

#

## 👨‍💻 Technologies

- NodeJS
- Typescript
- Express
- Axios
- Template Engine (ejs)
- MySQL
- TypeOrm
- MVC architecture

#

## 🚀 Installation

Clone the project to your local repository.

```
git clone https://github.com/Kodluyoruz-NodeJs-Bootcamp/final-project-tolgakarasay.git
```

Install the dependencies of the project.

```
npm install
```

Create a .env file in the project's directory using the supported .env.example file as a guide. Environment variables inside your .env file should look like this:

```
API_PORT= <enter your port number here>
TOKEN_KEY= <enter an arbitrary string here>
CLIENT_ID_GOOGLE= <enter your client id which you will get from google>
CLIENT_ID_FB= <enter your client id which you will get from facebook>
CLIENT_SECRET_FB= <enter your client secret which you will get from facebook>
REDIRECT_URI_FB= <enter the redirect uri which you specified for facebook sign in>

```

Run the code with nodemon

```
npm start
```

or with ts-node.

```
npx ts-node src/index.ts
```

#

## 📝 License

<a href="./LICENSE">MIT</a>
