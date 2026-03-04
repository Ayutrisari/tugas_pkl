const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Category = require("./category");
const User = require("./user");

const Post = db.define("posts", {
  judul: DataTypes.STRING,
  isi: DataTypes.TEXT,
  url_gambar: DataTypes.STRING,
});

Post.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Post, { foreignKey: "category_id" });

Post.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Post, { foreignKey: "user_id" });

module.exports = Post;