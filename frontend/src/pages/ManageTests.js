import { useState, useEffect } from 'react';
import axiosConfig from '../config/axiosConfig';

export default function ManageTests () {

    const [tests, setTests] = useState([]);
    const [activeTest, setActiveTest] = useState();
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState();

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
                            onClick={() => setActiveQuestion(question)}>Question {question.id}</a>)}
                    </div>

                    <div className="main-title">Test</div>

                    {activeQuestion && <div>

                        <div className="question">
                        <button className="btn btn-primary m-3" disabled>Save</button>
                        <br />
                        <textarea className="w-100" value={activeQuestion?.question} />
                        </div>
                        <button className="btn btn-secondary m-3" disabled>Add Question</button>
                        <div className="answers mb-5">
                                {activeQuestion.answers.map(answer => <div key={answer.id}
                                    className='answer'>
                                        <span className="answer-text"><input value={answer.text} /></span>
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