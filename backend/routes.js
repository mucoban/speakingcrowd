const tests = require("./controllers/tests");
const { login, register, giveHash } = require("./controllers/auth");
const { checkAuthentication } = require("./controllers/jwt-helper");

module.exports = function(app) {
    app.get('/routes', (req, res, next) => {
        res.send('Hello routes!');
    });
    app.get('/tests', tests.getTests);
    app.get('/test-q-a/:id', checkAuthentication, tests.getTestQuestionsAnswers);
    app.get('/login', login);
    app.get('/register', register);
    app.get('/give-hash', giveHash);
}