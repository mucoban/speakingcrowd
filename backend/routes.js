const tests = require("./controllers/tests");
const user = require("./controllers/user");
const { login, register, giveHash } = require("./controllers/auth");
const { checkAuthentication } = require("./controllers/jwt-helper");

module.exports = function(app) {
    app.get('/routes', (req, res, next) => {
        res.send('Hello routes!');
    });
    app.post('/login', login);
    app.post('/register', register);
    app.get('/give-hash', giveHash);
    app.get('/tests', tests.getTests);
    app.get('/user', user.getDetails);
    app.post('/user', user.setDetails);
    app.post('/crendentials', user.setPassword);
    app.get('/test-q-a/:id', checkAuthentication, tests.getTestQuestionsAnswers);
    app.post('/assess-selection', checkAuthentication, tests.assessSelection);
}