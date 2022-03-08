const Sequelize = require("sequelize");
const sequelize = new Sequelize('Music', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql' ,
  pool:{
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.albums = require("./albumModel")(sequelize, Sequelize);
db.composers = require("./composerModel")(sequelize, Sequelize);
db.lyricists = require("./lyricistModel")(sequelize, Sequelize);
db.singers = require("./singerModel")(sequelize, Sequelize);
db.songs = require("./songModel")(sequelize, Sequelize);
//Assosiations
db.albums.hasMany(db.songs,{onDelete: 'CASCADE', onUpdate: 'RESTRICT'})
db.songs.belongsTo(db.albums,{onDelete: 'RESTRICT',onUpdate: 'RESTRICT'});

db.songs.belongsToMany(db.composers, {through: 'SongComposer'});
db.composers.belongsToMany(db.songs, {through: 'SongComposer'});

db.songs.belongsToMany(db.singers, {through: 'SongSinger'});
db.singers.belongsToMany(db.songs, {through: 'SongSinger'});

db.songs.belongsToMany(db.lyricists, {through: 'SongLyricist'});  
db.lyricists.belongsToMany(db.songs, {through: 'SongLyricist'});   



module.exports = db;