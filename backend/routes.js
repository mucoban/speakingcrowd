module.exports = function(app) {
    app.get('/routes', (req, res, next) => {
        res.send('Hello routes!');
    });
}