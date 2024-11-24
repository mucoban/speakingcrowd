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

        // console.log('rows', rows);

        if (rows.length) {
            rows = rows.reduce((total, item) => {
                // const found = total.find(t => t.q_id === item.q_id);
                const foundIndex = total.findIndex(t => t.q_id === item.q_id);
                // console.log('foundIndex', foundIndex);
                if (foundIndex === -1) {
                    total.push({ q_id: item.q_id, answers: [item] });
                }
                else {
                    // found.answers.push(item);
                    total[foundIndex].answers.push(item);
                }
                // console.log('total', total);
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