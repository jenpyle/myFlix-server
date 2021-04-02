const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

//Models.Movie, etc, refer to the model names defined in models.js
const Movies = Models.Movie; //can query the Movie model in model.js
const Users = Models.User;
// const Genres = Models.Genre;
// const Directors = Models.Director;
//Allows mongoose to connect to the database and perform CRUD operations on documents it contains with my REST API
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json()); //Must appear before any other endpoint middleware(app.get, app.post, etc.)

// prettier-ignore
let movies = [
  {Title:"Hidden Figures","Year":"2016",Rated:"PG",Released:"06 Jan 2017","Runtime":"127 min",Genre:"Biography",Director:"Theodore Melfi","Writer":"Allison Schroeder (screenplay by), Theodore Melfi (screenplay by), Margot Lee Shetterly (based on the book by)",Actors:"Taraji P. Henson, Octavia Spencer, Janelle Monáe, Kevin Costner",Plot:"The story of a team of female African-American mathematicians who served a vital role in NASA during the early years of the U.S. space program.", Poster:"https://m.media-amazon.com/images/M/MV5BMzg2Mzg4YmUtNDdkNy00NWY1LWE3NmEtZWMwNGNlMzE5YzU3XkEyXkFqcGdeQXVyMjA5MTIzMjQ@._V1_UX182_CR0,0,182,268_AL_.jpg"},
  {Title:"RBG","Year":"2018",Rated:"PG",Released:"26 Jul 2018","Runtime":"98 min",Genre:"Biography",Director:"Julie Cohen, Betsy West","Writer":"N/A",Actors:"Ruth Bader Ginsburg, Ann Kittner, Harryette Helsel, Stephen Wiesenfeld",Plot:"The exceptional life and career of U.S. Supreme Court Justice Ruth Bader Ginsburg, who has developed a breathtaking legal legacy while becoming an unexpected pop culture icon.", Poster:"https://m.media-amazon.com/images/M/MV5BNTE4Nzc0NDU3Nl5BMl5BanBnXkFtZTgwODIzMTQzNTM@._V1_SX300.jpg"},
  {Title:"Promising Young Woman","Year":"2020",Rated:"R",Released:"25 Dec 2020","Runtime":"113 min",Genre:"Thriller",Director:"Emerald Fennell","Writer":"Emerald Fennell",Actors:"Adam Brody, Ray Nicholson, Sam Richardson, Carey Mulligan",Plot:"A young woman, traumatized by a tragic event in her past, seeks out vengeance against those who crossed her path.", Poster:"https://m.media-amazon.com/images/M/MV5BZDViMzBiNGMtZTIyNS00NzI4LWE3NDMtNmM1NDk0NzBlMWRlXkEyXkFqcGdeQXVyMTA2MDU0NjM5._V1_SX300.jpg"},
  {Title:"Teeth","Year":"2007",Rated:"R",Released:"03 Apr 2008","Runtime":"94 min",Genre:"Comedy",Director:"Mitchell Lichtenstein","Writer":"Mitchell Lichtenstein",Actors:"Jess Weixler, John Hensley, Josh Pais, Hale Appleman",Plot:"Still a stranger to her own body, a high school student discovers she has a physical advantage when she becomes the object of male violence.", Poster:"https://m.media-amazon.com/images/M/MV5BZjVjMjY4MzMtYzljNi00NDQ5LTk3NTYtNzY5NzYyY2FjZTZmXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"},
  {Title:"Miss Congeniality","Year":"2000",Rated:"PG-13",Released:"22 Dec 2000","Runtime":"109 min",Genre:"Action",Director:"Donald Petrie","Writer":"Marc Lawrence, Katie Ford, Caryn Lucas",Actors:"Sandra Bullock, Michael Caine, Benjamin Bratt, Candice Bergen",Plot:"An F.B.I. Agent must go undercover in the Miss United States beauty pageant to prevent a group from bombing the event.", Poster:"https://m.media-amazon.com/images/M/MV5BZDhjNzc4N2MtNWE5ZC00N2M4LWFiYjEtMTE5YmYyMTg3OGY5XkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_SX300.jpg"},
  {Title:"Bridesmaids","Year":"2011",Rated:"R",Released:"13 May 2011","Runtime":"125 min",Genre:"Comedy",Director:"Paul Feig","Writer":"Kristen Wiig, Annie Mumolo",Actors:"Kristen Wiig, Terry Crews, Maya Rudolph, Tom Yi",Plot:"Competition between the maid of honor and a bridesmaid, over who is the bride's best friend, threatens to upend the life of an out-of-work pastry chef.", Poster:"https://m.media-amazon.com/images/M/MV5BMjAyOTMyMzUxNl5BMl5BanBnXkFtZTcwODI4MzE0NA@@._V1_SX300.jpg"},
  {Title:"Wonder Woman","Year":"2017",Rated:"PG-13",Released:"02 Jun 2017","Runtime":"141 min",Genre:"Action",Director:"Patty Jenkins","Writer":"Allan Heinberg (screenplay by), Zack Snyder (story by), Allan Heinberg (story by), Jason Fuchs (story by), William Moulton Marston (Wonder Woman created by)",Actors:"Gal Gadot, Chris Pine, Connie Nielsen, Robin Wright",Plot:"When a pilot crashes and tells of conflict in the outside world, Diana, an Amazonian warrior in training, leaves home to fight a war, discovering her full powers and true destiny.", Poster:"https://m.media-amazon.com/images/M/MV5BMTYzODQzYjQtNTczNC00MzZhLTg1ZWYtZDUxYmQ3ZTY4NzA1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg"},
  {Title:"The Heat","Year":"2013",Rated:"R",Released:"28 Jun 2013","Runtime":"117 min","Genre":"Comedy",Director:"Paul Feig","Writer":"Katie Dippold",Actors:"Sandra Bullock, Melissa McCarthy, Demián Bichir, Marlon Wayans","Plot":"An uptight FBI Special Agent is paired with a foul-mouthed Boston cop to take down a ruthless drug lord.", Poster:"https://m.media-amazon.com/images/M/MV5BMjA2MDQ2ODM3MV5BMl5BanBnXkFtZTcwNDUzMTQ3OQ@@._V1_SX300.jpg"},
  {Title:"Ghostbusters","Year":"2016",Rated:"PG-13",Released:"15 Jul 2016","Runtime":"117 min","Genre":"Comedy",Director:"Paul Feig","Writer":"Katie Dippold, Paul Feig, Ivan Reitman (based on the 1984 film \"Ghostbusters\" directed by), Dan Aykroyd (based on the 1984 film \"Ghostbusters\" written by), Harold Ramis (based on the 1984 film \"Ghostbusters\" written by)",Actors:"Zach Woods, Kristen Wiig, Ed Begley Jr., Charles Dance","Plot":"Following a ghost invasion of Manhattan, paranormal enthusiasts Erin Gilbert and Abby Yates, nuclear engineer Jillian Holtzmann, and subway worker Patty Tolan band together to stop the otherworldly threat."}
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

app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

//Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.json(movies); //Why doesn't this work?
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return a list of users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a single movie by title to the user
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('movies/genres/:Name', (req, res) => {
  Movies.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/:Director', (req, res) => {
  res.send('Successful GET request returning data on the Director');
});

// Allow new users to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          //Mongoose command used on the User model to execute the database operation on MongoDB automatically. To insert a record into your “Users” collection
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        }) // send a response back to the client that contains both a status code and the document (called “user”) you just created
          .then((user) => {
            res.status(201).json(user);
          }) // a callback takes the document you just added as a parameter. Here, this new document is given the name “user” but you could name it anything you want
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      //an important catch-all in case command runs into an error
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Allow users to update their user info (username)
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      //2nd callback param
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      //4th callback param
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser); //document that was just updated (updatedUser) is sent to the client as a response
      }
    }
  );
});

//Allow users to add a movie to their list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allow users to remove a movie from their list of favorites
app.delete('/users/movies/favorites/:Title', (req, res) => {
  res.send('Successful DELETE request deleting specified title from existing user');
});

//Allow existing users to deregister
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        //check whether a document with the searched-for username even exists
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
