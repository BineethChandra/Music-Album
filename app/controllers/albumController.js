const { composers } = require("../models");
const db = require("../models");
const { sequelize } = require('../models') 
const Album = db.albums;
const Song = db.songs;
const Composer = db.composers;
const Lyricist = db.lyricists;
const Singer = db.singers;
const Op = db.Sequelize.Op;
// Create and Save a new Music Album
  //creating Album
exports.createAlbum =  async (req, res) => {
  const t = await sequelize.transaction(); //start a transaction and save it into a variable
  try{
   const {title,Year} = {...req.body};
   const album = await Album.create({
     title: title,
     Year: Year
   },
   {transaction:t});
   //creating Songs 
    var song = req.body.song;
    for(var i in song){
      const songs = await album.createSong({
        Name: song[i].Name,
        length: song[i].length
      },
      {transaction:t})
      //creating singer
      var singer = song[i].Singer;
      for(var j in singer){
        const check_singer = await Singer.findOne({where:{Name: singer[j].Name}},{transaction:t})
        // check if already exists
        if(check_singer === null){
        const Singers = await Singer.create({
          Name: singer[j].Name
        },{transaction:t})
        await songs.addSinger(Singers,{transaction:t});
      }else{
        await songs.addSinger(check_singer,{transaction:t});
      }
      }
     //creating composers
     var composer = song[i].Composer;
     for(var k in composer){
      const check_composer = await Composer.findOne({where:{Name: composer[k].Name }},{transaction:t})
      // check if already exists
       if(check_composer === null){
       const composers = await Composer.create({
         Name: composer[k].Name
       },{transaction:t})
       await songs.addComposer(composers,{transaction:t});
      }else{
       await songs.addComposer(check_composer,{transaction:t});
      }
     }
     //creating lyricists
     var lyricist = song[i].Lyricist;
     for(var l in lyricist){
       const check_lyricist = await Lyricist.findOne({where:{Name: lyricist[l].Name}},{transaction:t})
       // check if already exists
       if(check_lyricist === null){
       const Lyricists = await Lyricist.create({
         Name: lyricist[l].Name
       },{transaction:t})
       await songs.addLyricist(Lyricists,{transaction:t});
     }else{
       await songs.addLyricist(check_lyricist,{transaction:t})
     }
    }
}
await t.commit();
res.json(album)
}catch(err){
  console.log(err);
  await t.rollback();
}
}
//***************************************************************************************************************************************************8 */
// Retrieve data from DB along with songs and members 
exports.findAllData = async (req, res) => {
  try{
    const album = await Album.findAll({
      order: [['createdAt', 'DESC']],
      attributes:{exclude: ["createdAt","updatedAt","albumId"]},
include:{
        model: Song,
        order: [['createdAt', 'DESC']],
    attributes: {exclude: ["createdAt","updatedAt","albumId"],
                },
    include:[{
      model : Composer,
      order: [['createdAt', 'DESC']],
      attributes: {exclude: ["createdAt","updatedAt",]},
      through: {
        attributes: []
      }

      },
      {
        model: Singer,
        order: [['createdAt', 'DESC']],
      attributes: {exclude: ["createdAt","updatedAt"]},
      through: {
        attributes: []
      }
      },
      {
        model: Lyricist,
        order: [['createdAt', 'DESC']],
        attributes: {exclude: ["createdAt","updatedAt"]},
        through: {
          attributes: []
        }
      
      }]
      
      }

    })
    res.send(album)
    
  }catch(err){
    console.log(err);
  }
 
};
//*************************************************************************************************************************************************** */
//Retrieve all songs irrespective of albums but with album's info
exports.findAllSongs = async (req, res) => {
  try{
const song = await Song.findAll({
  order: [['createdAt', 'DESC']],
  attributes:{exclude: ["createdAt","updatedAt","albumId"]},
  include:{
    model: Album,
    attributes: {exclude: ["createdAt","updatedAt",],
                }
  }
})
res.send(song)
  }catch(err){
    console.log(err);
  }
 
};
//************************************************************************************************************************************************** */
//fetch single song details using the id given in params
exports.findSong = async (req,res) => {
  try{
    const {albumId,songId} = {...req.params}
    const check_song = await Song.findOne(
      {
        where:{albumId:albumId,id:songId},
        attributes:{exclude: ["createdAt","updatedAt","albumId"] },
        include:[{
          model : Composer,
          order: [['createdAt', 'DESC']],
          attributes: {exclude: ["createdAt","updatedAt",]},
          through: {
            attributes: []
          }

          },
          {
            model: Singer,
            order: [['createdAt', 'DESC']],
          attributes: {exclude: ["createdAt","updatedAt"]},
          through: {
            attributes: []
          }
          },
          {
            model: Lyricist,
            order: [['createdAt', 'DESC']],
            attributes: {exclude: ["createdAt","updatedAt"]},
            through: {
              attributes: []
            }
          
          }]      })
    if( check_song === null){
     return res.status(404).json({error: "There is no such song in the given album"})
    }
    res.status(200).json(check_song)
  
}catch(err){
    console.log(err);
  }
}
//************************************************************************************************************************************************** */
//updating music album info
exports.updateAlbum = async (req, res) => {
  try{
    const albumId = req.params.albumId;
    const check_album = await Album.findByPk(albumId)
      if (!check_album) {
       return  res.status(404).json({ error: "The album could not be found." });
      } 
    const {title,Year} = {...req.body}
    const album = await check_album.update({title:title,Year,Year})
   res.send(album)
  }catch(err){
    console.log(err);
  }
 
};
//************************************************************************************************************************************************** */
//updating song info under an album
exports.updateSong = async (req,res) => {
  try{
    const albumId = req.params.albumId;
    const check_album = await Album.findByPk(albumId)
      if (!check_album) {
       return  res.status(404).json({ error: "The album could not be found." });
      } 
      const songId = req.params.songId;
      const check_song = await Song.findByPk(songId)
      if (!check_song) {
        return  res.status(404).json({ error: "The song could not be found." });
       } 
      const {Name,length} = {...req.body.song}
      const song = await check_song.update({Name:Name,length:length})
      res.send(song)

  }catch(err){
    console.log(err);
  }
 
}
//************************************************************************************************************************************************** */
//creating a new song under an album 
exports.createSong = async (req,res) => {
  try{
    const albumId = req.params.albumId;
  const check_album = await Album.findByPk(albumId)
    if (!check_album) {
     return  res.status(404).json({ error: "The album could not be found." });
    } 
    var song = req.body.song;
      const songs = await check_album.createSong({
        Name: song.Name,
        length: song.length
      })
      //creating singer
      var singer = song.Singer;
      for(var j in singer){
        const check_singer = await Singer.findOne({where:{Name: singer[j].Name}})
        // check if already exists
        if(check_singer === null){
        const Singers = await Singer.create({
          Name: singer[j].Name
        })
        await songs.addSinger(Singers);
      }else{
        await songs.addSinger(check_singer);
      }
      }
     //creating composers
     var composer = song.Composer;
     for(var k in composer){
      const check_composer = await Composer.findOne({where:{Name: composer[k].Name }})
      // check if already exists
       if(check_composer === null){
       const composers = await Composer.create({
         Name: composer[k].Name
       })
       await songs.addComposer(composers);
      }else{
       await songs.addComposer(check_composer);
      }
     }
     //creating lyricists
     var lyricist = song.Lyricist;
     for(var l in lyricist){
       const check_lyricist = await Lyricist.findOne({where:{Name: lyricist[l].Name}})
       // check if already exists
       if(check_lyricist === null){
       const Lyricists = await Lyricist.create({
         Name: lyricist[l].Name
       })
       await songs.addLyricist(Lyricists);
     }else{
       await songs.addLyricist(check_lyricist)
     }
    }
    res.send("Sucessfull!");
  }catch(err){
    console.log(err);
  }
 
}
//************************************************************************************************************************************************** */
//delete the entire music album along with songs 
exports.deleteAlbum = async (req, res) => {
  try{
    const albumId = req.params.albumId;
    const check_album = await Album.findByPk(albumId)
    if(!check_album){
      return  res.status(404).json({ error: "The album could not be found." });
    }
    await check_album.destroy();
    res.send("Deleted Album sucessfully!")
  }catch(err){
    console.log(err);
  }
 
  
};
//************************************************************************************************************************************************** */
//delete a song from an existing music album 
exports.deleteSong = async (req, res) => {
  try{
    const albumId = req.params.albumId;
    const check_album = await Album.findByPk(albumId)
    if(!check_album){
      return  res.status(404).json({ error: "The album could not be found." });
    }
    const songId = req.params.songId;
      const check_song = await Song.findByPk(songId)
      if (!check_song) {
        return  res.status(404).json({ error: "The song could not be found." });
       } 
    await check_song.destroy();
    res.send("Deleted song  sucessfully!")
    
  }catch(err){
    console.log(err);
  }
}
//************************************************************************************************************************************************** */
