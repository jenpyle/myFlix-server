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
