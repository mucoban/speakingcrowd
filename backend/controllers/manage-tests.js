const jwt = require("jsonwebtoken");
const db = require('../db');

async function setQuestion(req, res, next) {

    try {
        const { questionData } = req.body; 
        console.log('req.body', req.body);

        const question = JSON.parse(questionData);
        console.log(question);

        let update;
        if (question.isNew) {
            update = await db.query(`INSERT INTO questions SET text = ?, test_id = ?`,  [question.question, question.testId]);
        }
        else {
            update = await db.query(`UPDATE  questions Q SET Q.text = ? WHERE Q.id = ?`,  [question.question, question.id]);
        }
        
        if (!update.affectedRows) return res.json({ status: false, message: 'not saved' });

        const allAnswersSavedPromises = 
            await question.answers.map(async (answer) => {
                console.log('answer', answer);

                const correct = answer.correct || 0;
                const updateAnswer = await db.query(`UPDATE  answers A SET A.text = ?, A.correct = ? WHERE A.id = ?`,
                    [answer.text, correct, answer.id]);
                console.log(updateAnswer);
                
                return updateAnswer.affectedRows;
            });

        const allAnswersSaved = await Promise.all(allAnswersSavedPromises);
        console.log('allAnswersSaved', allAnswersSaved);
        
        if (allAnswersSaved.some(answer => !answer)) return res.json({ status: false, message: 'not saved(answers)' });

        res.json({ 
            status: true, 
            message: 'saved successfully', 
            questionId: update.insertId || null 
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    setQuestion
}