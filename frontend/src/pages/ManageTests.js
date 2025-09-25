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

    const loadActiveTestAndQuestions = () => {
        axiosConfig.get(`/test-q-a/${activeTest?.id}`)
        .then(res => {
            setQuestions(res.data);
        });
    }

    const addAnswer = () => {
        const newAnswerId = 1 + Math.max(0, ...activeQuestion.answers.map(answer => answer.id));
        
        const question = {
            ...inputQuestion,
            answers: [
                ...inputQuestion.answers,
                { 
                    id: newAnswerId, 
                    text: '', 
                    correct: null
                 }
            ]
        };
        setActiveAndInputQuestion(question);
    }

    useEffect(() => {
        if (activeTest?.id) {
            loadActiveTestAndQuestions();
        }
    }, [activeTest]);

    const changed = useMemo(() => {            
            return activeQuestion?.question !== inputQuestion?.question
            || activeQuestion?.answers.some((answer, index) => {
                return answer?.text !== inputQuestion.answers?.[index]?.text
                    || answer?.correct !== inputQuestion.answers?.[index]?.correct;
            } );
        }, [activeQuestion, inputQuestion]);

    const setActiveAndInputQuestion = (question) => {
        const cloneA = _.cloneDeep(question);
        const cloneB = _.cloneDeep(question);
        setActiveQuestion(cloneA);
        setInputQuestion(cloneB);
    }

    const onSubmit = () => {
        const clone = _.cloneDeep(inputQuestion);
        setActiveQuestion(clone);
        
        axiosConfig.put(`/admin/question/${inputQuestion?.id || 0}`, { questionData: JSON.stringify(inputQuestion) } )
            .then(res => {
                if (inputQuestion.isNew) { 
                    
                    setActiveAndInputQuestion({
                        ...inputQuestion,
                        id: res.data.questionId
                    });
                    
                    // loadActiveTestAndQuestions again to fetch all questions including the new one
                    loadActiveTestAndQuestions();
                }

                setActiveAndInputQuestion(res.data.question);
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
                
                    {
                     questions?.length && (
                        <div className="">

                            {questions.map(question => <a key={question.id} 
                                className={`btn m-3 ${question.id === activeQuestion?.id ? 'btn-primary' : 'btn-secondary'}`} 
                                onClick={() => setActiveAndInputQuestion(question)}>Question {question.id}</a>)}

                            <br />

                            <button className="btn btn-light m-3" onClick={() => setQuestions([
                                ...questions, {
                                    isNew: true,
                                    id: 0,
                                    testId: activeTest.id,
                                    question: '',
                                    answers: [],
                                }
                            ])}>Add Question</button>   
                        </div>
                     )   
                    }

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

                        <button className="btn btn-secondary m-1" onClick={addAnswer}>Add Answer</button>

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