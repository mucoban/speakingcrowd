const tests = require("./controllers/tests");

module.exports = function(app) {
    app.get('/routes', (req, res, next) => {
        res.send('Hello routes!');
    });
    app.get('/tests', tests.getTests);
    app.get('/test-q-a/:id', tests.getTestQuestionsAnswers);
}