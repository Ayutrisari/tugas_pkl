const { DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define("users", {
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
});

module.exports = User;