
module.exports = (sequelize, Sequelize) => {
    const Song = sequelize.define("song", {
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validator: {
          len: [1,250],
          is: ["^[ A-Za-z0-9()[]+-*/%]*$", 'i'],
          mssg: 'err'
        }
      },
      length: {
        type: Sequelize.INTEGER
      },
    });
 return Song;
  };