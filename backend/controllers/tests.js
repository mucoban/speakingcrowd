const jwt = require("jsonwebtoken");
const db = require('../db');

async function getTests(req, res, next) {
    try {
        const rows = await db.query(`select * from tests`);

        if (req.query.includeUserPassed) {
            
            const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const passedTestId = decoded.passed_test_id;

            const updatedRows = rows.map(test => ({
                ...test,
                userPassed: test.id <= passedTestId
            }));        

            return res.json(updatedRows);
        }
        res.json(rows);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

async function getTestQuestionsAnswers(req, res, next) {
    try {
        let rows = await db.query(`select 
            T.id as t_id, T.name as t_name, Q.id as q_id, Q.text as q_text,
            A.id as a_id, A.text as a_text, A.correct as a_correct
            from tests T, questions Q, answers A 
            where Q.test_id = T.id AND A.question_id = Q.id AND T.id = ?`, 
            [req.params.id]);

        if (rows.length) {
            rows = rows.reduce((total, item) => {
                const foundIndex = total.findIndex(t => t.id === item.q_id);

                const answer = {
                    id: item.a_id,
                    text: item.a_text,
                    correct: item.a_correct,
                }

                if (foundIndex === -1) {
                    total.push({
                        id: item.q_id,
                        question: item.q_text,
                        answers: [answer]
                    });
                }
                else {
                    total[foundIndex].answers.push(answer);
                }

                return total;
            }, []);
        }
        
        res.json(rows);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

async function assessSelection(req, res) {
    try {
        const { testId, questionId, answerId } = req.body;

        if (!testId) return res.json({ status: false, message: 'testId is missing' });
        if (!questionId) return res.json({ status: false, message: 'questionId is missing' });
        if (!answerId) return res.json({ status: false, message: 'answerId is missing' });

        const rows = await db.query(`SELECT Q.id as qId, A.correct,
            (SELECT IF(Q2.id = Q.id, true, false) FROM questions Q2 WHERE Q2.test_id = T.id ORDER BY Q2.id DESC LIMIT 1) as isLastQuestion
            FROM tests T, questions Q, answers A
            WHERE  A.question_id = Q.id AND Q.test_id = T.id 
            AND T.id = ? and Q.id = ? and A.id = ?`, [testId, questionId, answerId]);
        
        if (rows?.[0]?.correct === 1) {
            
            if (rows?.[0]?.isLastQuestion) {

                const token = req.headers.authorization && req.headers.authorization.split(" ")[1];     
                if (!token) return res.sendStatus(401);
            
                const user = jwt.verify(token, process.env.TOKEN_SECRET);
                
                const newPassedTestId = testId + 1;
                await db.query(`UPDATE users SET passed_test_id = ? WHERE username = ?`, [newPassedTestId, user.username]);

                return res.json({
                    status: true,
                    message: 'Answer is correct and test is passed'
                });
            }

            return res.json({
                status: true,
                message: 'Answer is correct'
            });
        } 

        return res.json({
            status: false,
            message: 'Answer is incorrect'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getTests,
    getTestQuestionsAnswers,
    assessSelection
}