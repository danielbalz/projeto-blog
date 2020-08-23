const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Relacionamento do tipo 1 -> n
Category.hasMany(Article);

// Relacionamento do tipo 1 -> 1
Article.belongsTo(Category);

//Article.sync({force: true});

module.exports = Article;