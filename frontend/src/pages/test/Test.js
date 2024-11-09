import { useState } from 'react';
import './Test.scss';
import { questions } from "./test-data";

export default function Test() {

    // let activeQuestion = questions[0];

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

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
                        <div className="question">{questions[activeQuestionIndex].question}</div>
                        <div className="answers">
                            { questions[activeQuestionIndex].answers.map( (answer, index) => (
                                <div key={index} className="answer" onClick={() => assess(answer)}>
                                    <span className="answer-letter">{index} - </span>
                                    <span className="answer-text">{answer.content}</span>
                                </div>
                            ) )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}