import { useState, useEffect, useMemo } from 'react';
import axiosConfig from '../config/axiosConfig';
const _ = require('lodash');

export default function ManageTests () {

    const updateItem = {
        questionText: 0,
        answerText: 1,
        answerCorrectness: 2,
    };

    const [tests, setTests] = useState([]);
    const [activeTest, setActiveTest] = useState();
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState();
    const [inputQuestion, setInputQuestion] = useState();

    const inputsHandler = (params) => {
        switch(params.updateItem) {
            case updateItem.questionText:
                setInputQuestion( { ...inputQuestion, [params.event.target.name]: params.event.target.value} );
                break;
            case updateItem.answerText:
                const answers = inputQuestion.answers.slice();
                answers[params.answerIndex].text = params.event.target.value;
                setInputQuestion( { 
                    ...inputQuestion, 
                    answers
                } );
                break;
            case updateItem.answerCorrectness:
                const answersB = inputQuestion.answers.slice();
                const correctAnswer = answersB.find(answer => answer.correct === 1);
                correctAnswer && (correctAnswer.correct = 0);
                answersB[params.answerIndex].correct = 1;
                setInputQuestion( { 
                    ...inputQuestion, 
                    answersB
                } );
                break;
            default:
        }     
    }

    useEffect(() => {
        axiosConfig.get(`/tests`)
            .then(res => {
                setTests(res.data);
            });
    }, []);

    useEffect(() => {
        if (activeTest?.id) {
            axiosConfig.get(`/test-q-a/${activeTest?.id}`)
            .then(res => {
                setQuestions(res.data);
            });
        }
    }, [activeTest]);

    const changed = useMemo(() => {            
            return activeQuestion?.question !== inputQuestion?.question
            || activeQuestion?.answers.some((answer, index) => {
                return answer?.text !== inputQuestion.answers?.[index]?.text
                    || answer?.correct !== inputQuestion.answers?.[index]?.correct;
            } );
        }, [activeQuestion, inputQuestion]);

    const selectQuestion = (question) => {
        const cloneA = _.cloneDeep(question);
        const cloneB = _.cloneDeep(question);
        setActiveQuestion(cloneA);
        setInputQuestion(cloneB);
    }

    const onSubmit = () => {
        console.log(inputQuestion);
        const clone = _.cloneDeep(inputQuestion);
        setActiveQuestion(clone);
        
        axiosConfig.put(`/admin/question/${inputQuestion?.id}`, { questionData: JSON.stringify(inputQuestion) } )
            .then(res => {
                if (res.status) { return alert('Question has been saved successfully!'); }
                
                alert('Question has NOT been saved!');
            });
    }

    return <div className="test-page">

        <div className="container">
            <div className="row">
                <div className="col text-center">

                    <h3 className="text-center m-5">Manage Tests</h3>

                    <div className="">
                        {tests && tests.map(test => <a key={test.id} 
                            className={`btn m-3 ${test.id === activeTest?.id ? 'btn-primary' : 'btn-secondary'}`} 
                            onClick={() => setActiveTest(test)}>{test.name}</a>)}
                    </div>

                    <div className="">
                        {questions && questions.map(question => <a key={question.id} 
                            className={`btn m-3 ${question.id === activeQuestion?.id ? 'btn-primary' : 'btn-secondary'}`} 
                            onClick={() => selectQuestion(question)}>Question {question.id}</a>)}
                    </div>

                    <div className="main-title">Test</div>

                    {activeQuestion && <div>

                        <div className="question">
                            <button className="btn btn-primary m-3" disabled={!changed} onClick={onSubmit}>Save</button>
                            <br />
                            <textarea className="w-100" 
                                name='question' 
                                value={inputQuestion?.question} 
                                onChange={(event) => inputsHandler({ event, updateItem: updateItem.questionText })} />
                        </div>
                        <button className="btn btn-secondary m-3" disabled>Add Question</button>
                        <div className="answers mb-5">
                                {inputQuestion.answers.map((answer, index) => <div key={answer.id}
                                    className='answer'>
                                        <span className="answer-text">
                                            <input value={answer.text}
                                                onChange={(event) => inputsHandler({ 
                                                    event, 
                                                    updateItem: updateItem.answerText,
                                                    answerIndex: index 
                                                })} />
                                        </span>
                                        <button className="btn btn-secondary m-1">-</button>
                                        <button className="btn btn-secondary m-1">x</button>
                                        <button 
                                            className={`btn m-1 ${answer?.correct ? 'btn-primary' : 'btn-secondary'}`} 
                                            onClick={() => inputsHandler({ 
                                                updateItem: updateItem.answerCorrectness,
                                                answerIndex: index 
                                            })}>Correct</button>
                                    </div>)}
                        </div>

                    </div>}
                    
                </div>
            </div>
        </div>

    </div>
}