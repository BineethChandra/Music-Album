module.exports = app => {
    const albums = require("../controllers/albumController");
    var router = require("express").Router();
    // Create a new Music Album along with songs info and all members 
    router.post("/albums",albums.createAlbum);
    // Retrieve data from DB along with songs and members 
    router.get("/albums",albums.findAllData );
    // Retrieve all songs irrespective of albums but with album's info
    router.get("/songs", albums.findAllSongs);
    // fetch single song details using the id given in params
    router.get("/albums/:albumId/songs/:songId",albums.findSong );
    // updating music album info
    router.put("/albums/:albumId", albums.updateAlbum );
    //updating song info under an album
    router.put("/albums/:albumId/songs/:songId", albums.updateSong );
    //creating a new song under an album 
    router.post("/albums/:albumId/songs",albums.createSong );
    //delete the entire music album along with songs 
    router.delete("/albums/:albumId", albums.deleteAlbum)
    //delete a song from an existing music album 
    router.delete("/albums/:albumId/songs/:songId", albums.deleteSong );
    app.use('/', router);
  };