module.exports = (sequelize, Sequelize) => {
    const Composer = sequelize.define("composer", {
      Name : {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
 return Composer;
  };