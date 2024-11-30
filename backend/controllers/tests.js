const db = require('../db');

async function getTests(req, res, next) {
    try {
        const rows = await db.query(`select * from tests`);
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

module.exports = {
    getTests,
    getTestQuestionsAnswers
}