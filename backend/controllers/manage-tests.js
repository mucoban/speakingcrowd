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

        const questionId = update.insertId || question.id;
        
        if (!update.affectedRows) return res.json({ status: false, message: 'not saved' });

        const allAnswersSavedPromises = 
            await question.answers.map(async (answer) => {
                console.log('answer', answer);

                const correct = answer.correct || 0;
                const updateAnswer = await db.query(`UPDATE  answers A SET A.text = ?, A.correct = ?
                    WHERE A.id = ? AND A.question_id = ?`,
                    [answer.text, correct, answer.id, questionId]);
                console.log({updateAnswer});

                // Create a new answer if the one to be updated is not found
                if (!updateAnswer.affectedRows) {
                    const insertAnswer = await db.query(`INSERT INTO  answers SET text = ?, correct = ?, question_id = ?`,
                        [answer.text, correct, questionId]); 
                    return insertAnswer.affectedRows;
                }
                
                return updateAnswer.affectedRows;
            });

        const allAnswersSaved = await Promise.all(allAnswersSavedPromises);
        console.log('allAnswersSaved', allAnswersSaved);
        
        if (allAnswersSaved.some(answer => !answer)) return res.json({ status: false, message: 'not saved(answers)' });

        // Fetch the updated question with answers 
        let questionRows = await db.query(`select 
                    Q.id as q_id, Q.text as q_text,
                    A.id as a_id, A.text as a_text, A.correct as a_correct
                    from questions Q
                    LEFT JOIN answers A ON Q.id = A.question_id
                    where Q.id = ?`, 
                    [questionId]);
        console.log('questionRows', { questionId: { a: update.insertId, b: question.id }, questionRows});
        

        const updatedQuestion = {
            id: questionId,
            question: questionRows[0].q_text,
            answers: []
        };

        questionRows.forEach((item) => {

            const answer = {
                id: item.a_id,
                text: item.a_text,
                correct: item.a_correct,
            }
            updatedQuestion.answers.push(answer);

        });

        res.json({ 
            status: true, 
            message: 'saved successfully', 
            questionId: update.insertId || null,
            question: updatedQuestion
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    setQuestion
}