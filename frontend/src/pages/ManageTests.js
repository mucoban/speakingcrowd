import { useState, useEffect, useMemo } from 'react';
import axiosConfig from '../config/axiosConfig';
const _ = require('lodash');

export default function ManageTests () {

    const [tests, setTests] = useState([]);
    const [activeTest, setActiveTest] = useState();
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState();
    const [inputQuestion, setInputQuestion] = useState();

    const inputsHandler = (e, answerIndex) => {
        if (answerIndex !== undefined) { 
            const answers = inputQuestion.answers.slice();
            answers[answerIndex].text = e.target.value;
            setInputQuestion( { 
                ...inputQuestion, 
                answers
            } );
        } else {
          setInputQuestion( { ...inputQuestion, [e.target.name]: e.target.value} );
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
                return answer?.text !== inputQuestion.answers?.[index]?.text;
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
        setActiveQuestion(inputQuestion);
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
                            onChange={inputsHandler} />
                        </div>
                        <button className="btn btn-secondary m-3" disabled>Add Question</button>
                        <div className="answers mb-5">
                                {inputQuestion.answers.map((answer, index) => <div key={answer.id}
                                    className='answer'>
                                        <span className="answer-text">
                                            <input value={answer.text}
                                                onChange={(event) => inputsHandler(event, index)} />
                                        </span>
                                        <button className="btn btn-secondary m-1">-</button>
                                        <button className="btn btn-secondary m-1">x</button>
                                        <button className={`btn m-1 ${answer?.correct ? 'btn-primary' : 'btn-secondary'}`}>Correct</button>
                                    </div>)}
                        </div>

                    </div>}
                    
                </div>
            </div>
        </div>

    </div>
}