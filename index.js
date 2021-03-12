const express = require('express'),
  morgan = require('morgan');

const app = express();

let movies = [
  {
    title: 'The SpongeBob SquarePants',
  },
  {
    title: 'Gattaca',
  },
  {
    title: 'Brides Maids',
  },
  {
    title: 'Harry Potter',
  },
  {
    title: 'Pirates of the Caribbean',
  },
  {
    title: 'Miss Congeniality',
  },
  {
    title: 'Cloverfield',
  },
  {
    title: 'Raya and the Last Dragon',
  },
  {
    title: 'Wonder Woman',
  },
];

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(morgan('common'));
app.use(express.static('public'));
app.use(requestTime);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests
app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
