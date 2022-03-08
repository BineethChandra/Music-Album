module.exports = (sequelize, Sequelize) => {
    const Lyricist = sequelize.define("lyricist", {
      Name : {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
return Lyricist;
  };