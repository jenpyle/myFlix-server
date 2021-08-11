# MyFlix-server
A REST API and architected database built using JavaScript, Node.js, Express, and MongoDB. This is the server-side component of a “movies” web application which includes the [server](#restful-api), [business logic](#business-logic-layer), and [data layers](#database-layer). This web application provides users with access to information about different movies, directors, and genres. Users are able to sign up, update their personal information, and create a list of their favorite movies. 

![Image of postman testing](./public/img/all movies.PNG)

### Install Dependencies

```
npm install
```

### Run

```
node index.js
```

### Deploy

```
git add .
git commit -m "commit message"
git push heroku main
```
### To test on Postman
uncomment index.js:19 and comment out index.js:20
```
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
```
The project should be running on port 8080

**See the [Detailed Project Description](#detailed-project-description) below for more information**
# Technical Project Requirements
● The API must be a Node.js and Express application. \
● The API must use REST architecture, with URL endpoints corresponding to the data operations listed above \
● The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging. \ 
● The API must use a “package.json” file. \
● The database must be built using MongoDB. \
● The business logic must be modeled with Mongoose. \
● The API must provide movie information in JSON format. \
● The JavaScript code must be error-free. \
● The API must be tested in Postman. \
● The API must include user authentication and authorization code. \
● The API must include data validation logic. \
● The API must meet data security regulations. \
● The API source code must be deployed to a publicly accessible platform like GitHub. \
● The API must be deployed to Heroku. 


# Detailed Project Description
## RESTful API
The API, which is an abstraction of the web server, is what allows clients to access data directly from the web server. The API’s job is to read an HTTP request sent from the client, apply a CRUD operation on the requested resource on the server, and send an HTTP response back to the client.

The API was created using [Node.js](https://nodejs.org/en/) as the runtime environment, which allowed JavaScript to be executed directly on my operating system rather than just in the browser, which was important because the server-side for myFlix was developed before the [client-side UI](https://github.com/jenpyle/myFlix-client). 

This is a RESTful API, as it is architectured with a [Representational State Transfer (REST)](https://searchapparchitecture.techtarget.com/definition/REST-REpresentational-State-Transfer) pattern and employs Hypertext Transfer Protocol(HTTP), the most common protocol for data communication over the internet. This API is also considered a web service because it uses the World Wide Web to communicate.

The development of the API was streamlined by using the server-side web framework, [Express](https://expressjs.com/). Rather than using Node Modules, like Node's built-in [HTTP module](https://nodejs.org/api/http.html#http_http_methods), Express was used to route HTTP req/res and interact with data. The API was designed so users of the myFlix app can make requests to either access or update data on the server about movies or their own user information.

### API requirements
The requirements for the REST API are as follows:
- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL) about a single movie by title to the user
- Return data about a genre by name/title
- Return data about a director by name
- Allow new users to register
- Allow users to update their user profile info 
- Allow users to add/remove a movie to their list of favorites 
- Allow existing users to deregister 

### Middleware
Additionally, Express’s middleware functions were used. These include:
- The [body-parser](https://www.npmjs.com/package/body-parser) middleware function, to read from the “body” of HTTP requests in order to get additional information not stored in the request URLs.
- The [Morgan](http://expressjs.com/en/resources/middleware/morgan.html) middleware library to log all requests in the terminal. 
- Express’s [express.static](https://expressjs.com/en/starter/static-files.html) built-in middleware function to automatically route all requests for static files to their corresponding files within the [“public”](https://github.com/jenpyle/myFlix-server/tree/master/public) folder on the server
- An error-handling middleware function was created that logs all application-level errors to the terminal.
- [CORS](http://expressjs.com/en/resources/middleware/cors.html) middleware that allows control over which domains have access to the API’s server. 
- Authentication middleware tool for Node.js and Express, [Passport](http://www.passportjs.org/), is used to implement basic HTTP authentication, as well as JWT authentication

### Authentication and Authorization
The following authentication process is implimented using a tool called **[Passport](http://www.passportjs.org/)**, which is an authentication middleware for Node.js and Express. 

Initial user authentication is handled by **basic HTTP authentication**. For instance, when registered users make a login API request, they’ll provide a username and password, which will be sent within the header of the HTTP request. Then, as a result of the initial login request and authentication, the application will generate a JWT for the user. This allows subsequent API requests to be authenticated and authorized with **JWT-based authentication**. 

During **basic HTTP authentication**, the client provides a username and password encoded within the header of the HTTP request it sends to the API. The API then reads that username and password to check if the user is registered.

With **JWT authentication**, the client makes a request to the server-side of an application, after which the server generates a web token that represents an encoded version of some claim—for instance, identity, access, and length of time allowed access—and sends this token back to the client. The client stores the JWT via “local storage” in the browser and sends it alongside every subsequent request to the API, where the server then validates it in order to verify the client’s identity and process its requests.

Two authentication strategies: **“LocalStrategy”** and **“JWTStrategy.”**, are defined in [passport.js](https://github.com/jenpyle/myFlix-server/blob/master/passport.js). The first one, `LocalStrategy`, defines the basic **HTTP authentication** for login requests. `LocalStrategy` takes a username and password from the request body and uses [Mongoose](https://mongoosejs.com/docs/guide.html) to check the database for a user with the same username. The next strategy is `JWTStrategy`, and it allows the application to authenticate users based on the **JWT** submitted alongside their request. The JWT is called the *“bearer token”*, and is extracted from the header of the HTTP request. The JWT is given an expiration date of seven days. This means that, after seven days, a user’s session will end, and they’ll need to log in again to get a new JWT.

The code in [auth.js](https://github.com/jenpyle/myFlix-server/blob/master/auth.js) contains the login endpoint and actual logic that will authenticate registered users when they log in. auth.js first uses the ***LocalStrategy*** from [passport.js](https://github.com/jenpyle/myFlix-server/blob/master/passport.js) to check that the username and password in the body of the request exist in the database. If they do, the `generateJWTToken()` function creates a JWT based on the username and password, which is then sent back as a response to the client. If unsuccessful, the error message returned from ***LocalStrategy*** is sent back to the client.

### Additional data and web security considerations
#### Server-side input validation
The myFlix app used MongoDB to set up a JSON database, so server-side input validation is needed to ensure precautions are taken against potential JSON attacks. Input validation is implemented with the [express validator library](https://express-validator.github.io/docs/) within two endpoints that require data in their request bodies: registering a new user and updating an existing user. The validation code first ensures that the fields actually contain something; then, it checks that the data within follows the correct format. This ensures only *accepted characters and formats* make their way into the database. If an error occurs, the rest of the code will not execute, keeping the database safe from any potentially malicious code. In addition, the client is notified of the error, which will allow them to fix it and resubmit their data if it was, in fact, a harmless mistake.

#### Password hashing
For an additional security measure password hashing is used to keep password data from ever being seen by anyone, including the creator of the application. A Node.js module called [bcrypt](https://www.npmjs.com/package/bcrypt) is used to hash users’ passwords and compare hashed passwords every time users log in. Two functions are  added to the “Users” schema: `hashPassword` and `validatePassword`. The `hashPassword` function, which is what does the actual hashing of submitted passwords. The second function, `validatePassword`, is what compares submitted hashed passwords with the hashed passwords stored in the database. The code in POST new user endpoint in `index.js` hashes any password entered by the user when registering before storing it in the MongoDB database using `Users.hashPassword(req.body.Password)`.The code in `LocalStrategy` in [passport.js](https://github.com/jenpyle/myFlix-server/blob/master/passport.js) hashes any password entered by the user when logging in before comparing it to the password stored in MongoDB also using `Users.hashPassword(req.body.Password)`.

#### CORS
 [CORS](http://expressjs.com/en/resources/middleware/cors.html) allows control over which domains have access to the API’s server. By controlling who has access to the API, it is better protected from malicious entities. CORS is implemented by way of Express and is currently set to the default allowed origins.

### Testing
The URL endpoints, HTTP authentication, JWT-based authentication, server-side input validation, and password hashing were tested via the API development tool, [Postman](https://www.postman.com/downloads/).

### Hosting 
The API is hosted on [Heroku](https://dashboard.heroku.com/apps). The command `git push heroku main` tells Heroku to grab a copy of the committed code and use it to deploy/re-deploy the API on Heroku.

## Documentation
A documentation page for the API can be viewed [here](https://jennysflix.herokuapp.com/documentation.html). This documentation provides examples for how to format requests to the API correctly (e.g., what URL endpoints to target, what data to send as parameters, and what data to expect as responses)

## Business Logic Layer
The business logic layer contains “logic” for converting code from the data layer (MongoDB) into something usable by the rest of the application. An ODM tool, [Mongoose](https://mongoosejs.com/docs/guide.html), does this job, translating between the Node.js application and the MongoDB database layer. Mongoose is also designed for asynchronous environments (which is a feature of the Node.js runtime environment).

Mongoose revolves around models. Models in Mongoose are written using Node and Express and are kept in a separate [models.js](https://github.com/jenpyle/myFlix-server/blob/master/models.js) file. A model is a class that constructs documents according to a specified schema, specifying what data to store(e.g. Title, Description, Username, etc.) and how to store it(e.g. type: String, required: true, ref: ‘Movie’, etc.) for each document in a collection. This keeps data in the database consistently formatted. Schemas are defined for documents in the “Movies” and “Users” collection. These models are imported into index.js so the API endpoints can make use of them to query the MongoDB database according to the schemas. Mongoose is integrated into the REST API by requiring the module in index.js and using mongoose.connect to connect to the externally hosted database. This allows the REST API to perform CRUD operations on the MongoDB data.

After this implementation, the API is able to receive requests, make the appropriate alterations to the database (using the business logic), and send responses accordingly!

## Database Layer
The Mongo shell from [MongoDB Database Tools](https://docs.mongodb.com/tools/) was utilized to create a non-relational database by performing [CRUD](https://docs.mongodb.com/manual/crud/) operations with data. The database consists of two collections: Movies and Users, with embedded documents for Director and Genre data. JSON examples of the movies and users collections can be [viewed here](https://github.com/jenpyle/myFlix-server/tree/master/public/example-collections). References are used to store a list of favorite movies for each user. JSON files of the database are imported onto “cluster” and hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server)

## API and Database connection
The API is hosted online by way of [Heroku](https://dashboard.heroku.com/apps) and the database hosted online by way of [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server). The connection URI from mongoDB Atlas containing myFlix database credentials is saved in the environment variables on Heroku, so the two sources are able to connect and communicate via the line:`mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });` in [index.js](https://github.com/jenpyle/myFlix-server/blob/master/index.js).

