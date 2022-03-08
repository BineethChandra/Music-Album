module.exports = (sequelize, Sequelize) => {
    const Singer = sequelize.define("singer", {
      Name : {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
return Singer;
  };