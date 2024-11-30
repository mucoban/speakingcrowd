import { useState, useEffect } from 'react';
import axios from 'axios';
import './Test.scss';
// import { questions } from "./test-data";

export default function Test() {

    const [questions, setQuestions] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:3000/test-q-a/1`)
        .then(res => {
            setQuestions(res.data);
        });
    }, []);

    const assess = answer => {
        if (!answer.correct) { alert("Wrong answer!"); }
        else { 
            alert("CORRECT!");
            const nextIndex = activeQuestionIndex + 1
            if (questions.length > nextIndex)
                setActiveQuestionIndex(nextIndex);
            else
                alert("You have completed the test");
        }
    }

    return (
        <div className="test-page">
            <div className="container">
                <div className="row">
                    <div className="col text-center">
                        <div className="main-title">Test</div>
                        <div className="question">{ questions && questions[activeQuestionIndex].question}</div>
                        <div className="answers">
                            { questions && questions[activeQuestionIndex].answers.map( (answer, index) => (
                                <div key={index} className="answer" onClick={() => assess(answer)}>
                                    <span className="answer-letter">{index} - </span>
                                    <span className="answer-text">{answer.text}</span>
                                </div>
                            ) )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}