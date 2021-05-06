# MyFlix

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
