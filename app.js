require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req, res) => {
    res.render('index')
});


app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists(req.query.q)
    .then(data => {   
    res.render('artist-search-results', { artists: data.body.artists.items });
    })
  .catch(err => console.log('The error occurred while searching artists: ', err));
});


app.get('/albums/:artistId', (req, res, next) => {    
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
    res.render('albums', { albums: data.body.items })
    })
    .catch(err => console.log('The error occurred while searching albums: ', err));
});


app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
    .then(data => {
    res.render('tracks', { tracks: data.body.items })
    })
    .catch(err => console.log('The error occurred while searching tracks: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
