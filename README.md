# MyFlix-server

## Detailed description
- Layers
- API
- requirements
- Middleware
- Testing
- Documentation
- Database
- Authentication

### RESTful API
The API, which is an abstraction of the web server, is what allows clients to access data directly from the web server. The API’s job is to read an HTTP request sent from the client, apply a CRUD operation on the requested resource on the server, and send an HTTP response back to the client.

The API was created using [Node.js](https://nodejs.org/en/) as the runtime environment, which allowed JavaScript to be executed directly on my operating system rather than just in the browser, which was important because the server-side for myFlix was developed before the [client-side UI](https://github.com/jenpyle/myFlix-client). 

This is a RESTful API, as it is architectured with a [Representational State Transfer (REST)](https://searchapparchitecture.techtarget.com/definition/REST-REpresentational-State-Transfer) pattern and employs Hypertext Transfer Protocol(HTTP), the most common protocol for data communication over the internet. This API is also considered a web service because it uses the World Wide Web to communicate.

The development of the API was streamlined by using the server-side web framework, [Express](https://expressjs.com/). Rather than using Node Modules, like Node's built-in [HTTP module](https://nodejs.org/api/http.html#http_http_methods), Express was used to route HTTP req/res and interact with data. The API was designed so users of the myFlix app can make requests to either access or update data on the server about movies or their own user information.

#### API requirements
The requirements for the REST API are as follows:
- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL) about a single movie by title to the user
- Return data about a genre by name/title
- Return data about a director by name
- Allow new users to register
- Allow users to update their user profile info 
- Allow users to add/remove a movie to their list of favorites 
- Allow existing users to deregister 

#### Middleware
Additionally, Express’s middleware functions were used. These middleware functions include:
- The [Morgan](http://expressjs.com/en/resources/middleware/morgan.html) middleware library to log all requests in the terminal. 
- Express’s [express.static](https://expressjs.com/en/starter/static-files.html) built-in middleware function to automatically route all requests for static files to their corresponding files within the [“public”](https://github.com/jenpyle/myFlix-server/tree/master/public) folder on the server
- An error-handling middleware function was created that logs all application-level errors to the terminal.

#### Testing
The URL endpoints were tested via the API development tool, [Postman](https://www.postman.com/downloads/).

### Documentation
A documentation page for the API can be viewed [here](https://jennysflix.herokuapp.com/documentation.html). This documentation provides examples for how to format requests to the API correctly (e.g., what URL endpoints to target, what data to send as parameters, and what data to expect as responses)

## Business Logic Layer
The business logic layer contains “logic” for converting code from the data layer (MongoDB) into something usable by the rest of the application. An ODM tool, [Mongoose](https://mongoosejs.com/docs/guide.html), does this job, translating between the Node.js application and the MongoDB database layer. Mongoose is also designed for asynchronous environments (which is a feature of the Node.js runtime environment).

Mongoose revolves around models. Models in Mongoose are written using Node and Express and are kept in a separate [models.js](https://github.com/jenpyle/myFlix-server/blob/master/models.js) file. A model is a class that constructs documents according to a specified schema, specifying what data to store(e.g. Title, Description, Username, etc.) and how to store it(e.g. type: String, required: true, ref: ‘Movie’, etc.) for each document in a collection. This keeps data in the database consistently formatted. Schemas are defined for documents in the “Movies” and “Users” collection. These models are imported into index.js so the API endpoints can make use of them to query the MongoDB database according to the schemas. Mongoose is integrated into the REST API by requiring the module in index.js and using mongoose.connect to connect to the externally hosted database. This allows the REST API to perform CRUD operations on the MongoDB data.

After this implementation, the API is able to receive requests, make the appropriate alterations to the database (using the business logic), and send responses accordingly!


## Database Layer
The Mongo shell from [MongoDB Database Tools](https://docs.mongodb.com/tools/) was utilized to create a non-relational database by performing [CRUD](https://docs.mongodb.com/manual/crud/) operations with data. The database consists of two collections: Movies and Users, with embedded documents for Director and Genre data. JSON examples of the movies and users collections can be [viewed here](https://github.com/jenpyle/myFlix-server/tree/master/public/example-collections). References are used to store a list of favorite movies for each user. JSON files of the database are imported onto “cluster” and hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server)




## 1.Project description

A REST API and architected database built using JavaScript, Node.js, Express, and MongoDB. This is the server-side component of a “movies” web application which includes the server, business logic, and data layers. This web application provides users with access to information about different movies, directors, and genres. Users are able to sign up, update their personal information, and create a list of their favorite movies. 
## 2. How to get the project running
To test on postman: uncomment index.js:19 and comment out index.js:20

```mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });```

```// mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });```


Next, in the terminal run ```node index.js```

The project should be running on port 8080

## 3. _Project dependencies (e.g., JavaScript version, ESLint rules)_

```python
  "rules": {
    "prettier/prettier": "warn",
    "no-unused-vars": "warn",
    "no-console": "off",
    "func-names": "off",
    "no-process-exit": "off",
    "object-shorthand": "off",
    "class-methods-use-this": "off",
    "quotes": ["error", "single"],
    "no-multiple-empty-lines:": "off"
```
