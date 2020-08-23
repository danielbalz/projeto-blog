const express = require("express");
const { response, request } = require("express");
const router = express.Router();
const slugify = require("slugify");
const Category = require("./Category");

router.get("/admin/categories", (request, response) => {
    Category.findAll().then(categories => {
        response.render("admin/categories/index", {categories: categories});
    });    
});

router.get("/admin/categories/new", (request, response) => {
    response.render("admin/categories/new");
});

router.get("/admin/categories/edit/:id", (request, response) => {
    var id = request.params.id;

    if(isNaN(id)) {
        redirectRoute(response);        
    }

    Category.findByPk(id).then(category => {

        if(category != undefined) {
            response.render("admin/categories/edit", {
                category : category
            });
        } else {
            redirectRoute(response);
        }

    }).catch(error => {
        redirectRoute(response);
    });
});

router.post("/categories/save", (request, response) => {
    var title = request.body.title;

    if(title != undefined) {

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            redirectRoute(response);
        });

    } else {
        response.redirect("/admin/categories/new");
    }
});

router.post("/categories/update", (request, response) => {
    var id = request.body.id;
    var title = request.body.title;

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        redirectRoute(response);
    });
});  

router.post("/categories/delete", (request, response) => {
    var id = request.body.id;

    if(id == undefined || isNaN(id)) {
        redirectRoute(response);
    } else {

        Category.destroy({
            where: {
                id: id
            }
        }).then(() => {
            redirectRoute(response);
        });
    }
});

function redirectRoute(response) {
    response.redirect("/admin/categories");
}

module.exports = router;