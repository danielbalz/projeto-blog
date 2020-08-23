function adminAuth(request, response, next) {

    if (request.session.user == undefined) {
        response.redirect("/login");
    } else {
        next();
    }
}

module.exports = adminAuth;