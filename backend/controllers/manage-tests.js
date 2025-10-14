const jwt = require("jsonwebtoken");
const { query, escape } = require('../db');

async function setQuestion(req, res, next) {

    try {
        const { questionData } = req.body; 

        const question = JSON.parse(questionData);
        console.log(question);

        let update;
        if (question.isNew) {
            update = await query(`INSERT INTO questions SET text = ?, test_id = ?`,  [question.question, question.testId]);
        }
        else {
            update = await query(`UPDATE  questions Q SET Q.text = ? WHERE Q.id = ?`,  [question.question, question.id]);
        }

        const questionId = update.insertId || question.id;
        
        if (!update.affectedRows) return res.json({ status: false, message: 'not saved' });


        // Delete answers of the question ids of which are not found in request. 
        if (question?.answers?.length) {            
            const escapedAnswerIds = await Promise.all(question.answers.map(async({id}) => {                
                return await escape(id);
            }));

            await query(`DELETE FROM answers A WHERE A.id NOT IN (${escapedAnswerIds.join(',')}) AND A.question_id = ?`,
                    [questionId]);
            
        }  
        
        const allAnswersSavedPromises = 
            await question.answers.map(async (answer) => {
                // console.log('answer', answer);

                const correct = answer.correct || 0;
                const updateAnswer = await query(`UPDATE  answers A SET A.text = ?, A.correct = ?
                    WHERE A.id = ? AND A.question_id = ?`,
                    [answer.text, correct, answer.id, questionId]);

                // Create a new answer if the one to be updated is not found
                if (!updateAnswer.affectedRows) {
                    const insertAnswer = await query(`INSERT INTO  answers SET text = ?, correct = ?, question_id = ?`,
                        [answer.text, correct, questionId]); 
                    return insertAnswer.affectedRows;
                }
                
                return updateAnswer.affectedRows;
            });

        const allAnswersSaved = await Promise.all(allAnswersSavedPromises);
        
        if (allAnswersSaved.some(answer => !answer)) return res.json({ status: false, message: 'not saved(answers)' });

        // Fetch the updated question with answers 
        let questionRows = await query(`select 
                    Q.id as q_id, Q.text as q_text,
                    A.id as a_id, A.text as a_text, A.correct as a_correct
                    from questions Q
                    LEFT JOIN answers A ON Q.id = A.question_id
                    where Q.id = ?`, 
                    [questionId]);
        

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

async function deleteQuestion(req, res) {

    try {
        
        const questionId = req.params.id

        const deleteQuestion = await query(`DELETE FROM questions Q WHERE Q.id = ?`,  [questionId]);

        if (!deleteQuestion.affectedRows) return res.json({ status: false, message: 'not deleted' });

        await query(`DELETE FROM answers A WHERE A.question_id = ?`,  [questionId]);

        res.json({ 
            status: true, 
            message: 'deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}


module.exports = {
    setQuestion,
    deleteQuestion
}