module.exports = (sequelize, Sequelize) => {
    const Album = sequelize.define("album", {
      title: {
        type: Sequelize.STRING,
        allowNull: false ["Title of the Album is required"],
        unique: true,
        validator: {
          len: [1,250],
          is: ["^[ A-Za-z0-9()[]+-*/%]*$", 'i'],
          mssg: 'err'
        }
      },
      Year: {
        type: Sequelize.INTEGER,
        allowNull: false
       
      },
    });
return Album;
  };