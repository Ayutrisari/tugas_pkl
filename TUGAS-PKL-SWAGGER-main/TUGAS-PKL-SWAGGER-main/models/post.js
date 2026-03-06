const { DataTypes } = require("sequelize");
const db = require("../config/db"); // Sesuaikan path config DB kamu
const Category = require("./category");
const User = require("./user");

const Post = db.define("posts", {
  judul: {
    type: DataTypes.STRING,
    allowNull: false // Judul tidak boleh kosong
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url_gambar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Definisikan kolom foreign key secara eksplisit
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  freezeTableName: true, // Nama tabel tetap 'posts'
  underscored: true,     // Menggunakan snake_case (category_id)
  timestamps: true       // Otomatis mengelola created_at & updated_at
});

// Relasi
Post.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Post, { foreignKey: "category_id" });

Post.belongsTo(User, { foreignKey: "user_id", as: "author" });
User.hasMany(Post, { foreignKey: "user_id" });

module.exports = Post;