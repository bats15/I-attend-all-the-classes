function staticRoute(app){
    app.get('/signup', (req, res) => {
        res.render('signup');
    });
    app.get('/login', (req, res) => {
        res.render('login');
    });
    app.get('/', (req, res) => {
        res.render('homepage');
    });
}

module.exports = staticRoute;