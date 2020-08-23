const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const UsersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./categories/Category");

//View engine
app.set("view engine", "ejs");

//Session
app.use(session({
    secret: "palavrasecretaobrigatoria",
    cookie: { maxAge: 3000000 },
    resave: true,
    saveUninitialized: true
}));

//Static
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com sucesso.");
    }).catch((error) => {
        console.log(error);
    });

//O primeiro parâmetro é um prefixo para acessar as rotas do Controller
app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UsersController);

app.get("/", (request, response) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            response.render("index", {articles: articles, categories: categories });
        });        
    });    
});

app.get("/:slug", (request, response) => {
    var slug = request.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                response.render("article", {article: article, categories: categories });
            });
        } else {
            response.redirect("/");
        }
    }).catch(error => {
        response.redirect("/");
    });
});

app.get("/category/:slug", (request, response) => {
    var slug = request.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                response.render("index", {articles: category.articles, categories: categories });
            });
        } else {
            response.redirect("/");
        }
    }).catch(error => {
        response.redirect("/");
    });
});

app.listen(3000);