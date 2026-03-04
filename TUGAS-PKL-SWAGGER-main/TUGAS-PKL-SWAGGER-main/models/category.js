const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Category = db.define("categories", {
  nama: {
    type: DataTypes.STRING,
  },
});

module.exports = Category;