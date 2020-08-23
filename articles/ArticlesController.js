const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (request, response) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        response.render("admin/articles/index", {
            articles : articles
        });
    });    
});

router.get("/admin/articles/new", adminAuth, (request, response) => {
    Category.findAll().then(categories => {
        response.render("admin/articles/new", {
            categories: categories
        });
    });
});

router.get("/admin/articles/edit/:id", adminAuth, (request, response) => {
    var id = request.params.id;

    Article.findByPk(id).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                response.render("admin/articles/edit", {article: article, categories: categories});
            });
        } else {
            redirectRoute();
        }
    }).catch(error => {
        redirectRoute();
    });
});

router.get("/articles/page/:num", (request, response) => {
    var page = request.params.num;
    var offset = 0;
    var itensByPage = 4;

    if(isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * itensByPage;
    }

    Article.findAndCountAll({
        order: [
            ['id', 'DESC']
        ],
        limit: itensByPage,
        offset: offset
    }).then(articles => {

        var next = (offset + itensByPage) >= articles.count ? false : true;
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            response.render("admin/articles/page", {result: result, categories: categories});            
        });        
    });
});

router.post("/articles/save", adminAuth, (request, response) => {
    var title = request.body.title;
    var body = request.body.body;
    var category = request.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        redirectRoute(response);
    });
});

router.post("/articles/update", adminAuth, (request, response) => {
    var id = request.body.id;
    var title = request.body.title;
    var body = request.body.body;
    var category = request.body.category;

    Article.update({title: title, slug: slugify(title), body: body, categoryId: category}, {
        where: {
            id: id
        }
    }).then(() => {
        redirectRoute(response);
    });
});

router.post("/articles/delete", adminAuth, (request, response) => {
    var id = request.body.id;

    if(id == undefined || isNaN(id)) {
        redirectRoute(response);
    } else {

        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            redirectRoute(response);
        });
    }
});

function redirectRoute(response) {
    response.redirect("/admin/articles");
}

module.exports = router;