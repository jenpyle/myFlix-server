const express = require('express'),
  morgan = require('morgan');

const app = express();
// prettier-ignore
let movies = [
  {Title:"Hidden Figures","Year":"2016",Rated:"PG",Released:"06 Jan 2017","Runtime":"127 min",Genre:"Biography, Drama, History","Director":"Theodore Melfi","Writer":"Allison Schroeder (screenplay by), Theodore Melfi (screenplay by), Margot Lee Shetterly (based on the book by)","Actors":"Taraji P. Henson, Octavia Spencer, Janelle Monáe, Kevin Costner",Plot:"The story of a team of female African-American mathematicians who served a vital role in NASA during the early years of the U.S. space program.","Language":"English",Country:"USA",Awards:"Nominated for 3 Oscars. Another 37 wins & 85 nominations.",Poster:"https://m.media-amazon.com/images/M/MV5BMzg2Mzg4YmUtNDdkNy00NWY1LWE3NmEtZWMwNGNlMzE5YzU3XkEyXkFqcGdeQXVyMjA5MTIzMjQ@._V1_SX300.jpg"},
  {Title:"RBG","Year":"2018",Rated:"PG",Released:"26 Jul 2018","Runtime":"98 min",Genre:"Documentary, Biography","Director":"Julie Cohen, Betsy West","Writer":"N/A","Actors":"Ruth Bader Ginsburg, Ann Kittner, Harryette Helsel, Stephen Wiesenfeld",Plot:"The exceptional life and career of U.S. Supreme Court Justice Ruth Bader Ginsburg, who has developed a breathtaking legal legacy while becoming an unexpected pop culture icon.","Language":"English, Italian, German, French",Country:"USA",Awards:"Nominated for 2 Oscars. Another 13 wins & 49 nominations.",Poster:"https://m.media-amazon.com/images/M/MV5BNTE4Nzc0NDU3Nl5BMl5BanBnXkFtZTgwODIzMTQzNTM@._V1_SX300.jpg"},
  {Title:"Promising Young Woman","Year":"2020",Rated:"R",Released:"25 Dec 2020","Runtime":"113 min",Genre:"Crime, Drama, Thriller","Director":"Emerald Fennell","Writer":"Emerald Fennell","Actors":"Adam Brody, Ray Nicholson, Sam Richardson, Carey Mulligan",Plot:"A young woman, traumatized by a tragic event in her past, seeks out vengeance against those who crossed her path.","Language":"English",Country:"UK, USA",Awards:"Nominated for 4 Golden Globes. Another 49 wins & 107 nominations.",Poster:"https://m.media-amazon.com/images/M/MV5BZDViMzBiNGMtZTIyNS00NzI4LWE3NDMtNmM1NDk0NzBlMWRlXkEyXkFqcGdeQXVyMTA2MDU0NjM5._V1_SX300.jpg"},
  {Title:"Teeth","Year":"2007",Rated:"R",Released:"03 Apr 2008","Runtime":"94 min",Genre:"Comedy, Fantasy, Horror, Thriller","Director":"Mitchell Lichtenstein","Writer":"Mitchell Lichtenstein","Actors":"Jess Weixler, John Hensley, Josh Pais, Hale Appleman",Plot:"Still a stranger to her own body, a high school student discovers she has a physical advantage when she becomes the object of male violence.","Language":"English",Country:"USA",Awards:"2 wins & 10 nominations.",Poster:"https://m.media-amazon.com/images/M/MV5BZjVjMjY4MzMtYzljNi00NDQ5LTk3NTYtNzY5NzYyY2FjZTZmXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"},
  {Title:"Miss Congeniality","Year":"2000",Rated:"PG-13",Released:"22 Dec 2000","Runtime":"109 min",Genre:"Action, Comedy, Crime, Romance","Director":"Donald Petrie","Writer":"Marc Lawrence, Katie Ford, Caryn Lucas","Actors":"Sandra Bullock, Michael Caine, Benjamin Bratt, Candice Bergen",Plot:"An F.B.I. Agent must go undercover in the Miss United States beauty pageant to prevent a group from bombing the event.","Language":"English, Russian, French, Hawaiian, Spanish",Country:"USA",Awards:"Nominated for 2 Golden Globes. Another 7 wins & 6 nominations.",Poster:"https://m.media-amazon.com/images/M/MV5BZDhjNzc4N2MtNWE5ZC00N2M4LWFiYjEtMTE5YmYyMTg3OGY5XkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_SX300.jpg"},
  {Title:"Bridesmaids","Year":"2011",Rated:"R",Released:"13 May 2011","Runtime":"125 min",Genre:"Comedy, Romance","Director":"Paul Feig","Writer":"Kristen Wiig, Annie Mumolo","Actors":"Kristen Wiig, Terry Crews, Maya Rudolph, Tom Yi",Plot:"Competition between the maid of honor and a bridesmaid, over who is the bride's best friend, threatens to upend the life of an out-of-work pastry chef.","Language":"English, Thai, Spanish, French",Country:"USA",Awards:"Nominated for 2 Oscars. Another 25 wins & 70 nominations.",Poster:"https://m.media-amazon.com/images/M/MV5BMjAyOTMyMzUxNl5BMl5BanBnXkFtZTcwODI4MzE0NA@@._V1_SX300.jpg"},
  {Title:"Wonder Woman","Year":"2017",Rated:"PG-13",Released:"02 Jun 2017","Runtime":"141 min",Genre:"Action, Adventure, Fantasy, Sci-Fi, War","Director":"Patty Jenkins","Writer":"Allan Heinberg (screenplay by), Zack Snyder (story by), Allan Heinberg (story by), Jason Fuchs (story by), William Moulton Marston (Wonder Woman created by)","Actors":"Gal Gadot, Chris Pine, Connie Nielsen, Robin Wright",Plot:"When a pilot crashes and tells of conflict in the outside world, Diana, an Amazonian warrior in training, leaves home to fight a war, discovering her full powers and true destiny.","Language":"English, German, Dutch, French, Spanish, Chinese, Greek, Ancient (to 1453), North American Indian",Country:"USA, UK",Awards:"24 wins & 71 nominations.",Poster:"https://m.media-amazon.com/images/M/MV5BMTYzODQzYjQtNTczNC00MzZhLTg1ZWYtZDUxYmQ3ZTY4NzA1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg"},
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
  res.json(movies);
});

//Return data about a single movie by title to the user
app.get('/movies/:Title', (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.Title === req.params.Title;
    })
  );
});

//Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/:Title/:Genre', (req, res) => {
  res.send('Successful GET request returning data on the movie Genre');
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/:Director', (req, res) => {
  res.send('Successful GET request returning data on the Director');
});

// Allow new users to register
app.post('/users', (req, res) => {
  res.send('Successful POST request adding a new user');
});

//Allow users to update their user info (username)
app.put('/users/info', (req, res) => {
  res.send('Successful PUT request updating info on a specific user');
});

//Allow users to add a movie to their list of favorites
app.post('/users/movies/favorites/Title', (req, res) => {
  res.send('Successful POST request adding a specific movie to a favorites list of a specific user');
});

//Allow users to remove a movie from their list of favorites
app.delete('/users/movies/favorites/Title', (req, res) => {
  res.send('Successful DELETE request deleting specified title from existing user');
});

//Allow existing users to deregister
app.delete('/users', (req, res) => {
  res.send('Successful DELETE request deleting existing user');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
