import { useState, useEffect } from 'react';
import axiosConfig from '../../config/axiosConfig';
import './Test.scss';
import { useParams } from 'react-router-dom';
// import RegisterBox from '../../components/RegisterBox';
// import { questions } from "./test-data";

export default function Test() {

    const params = useParams();
    const [questions, setQuestions] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        axiosConfig.get(`/test-q-a/${params.id}`)
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

                        {/* <RegisterBox /> */}

                        <div className="question">{ questions && questions[activeQuestionIndex]?.question}</div>
                        <div className="answers">
                            { questions && questions[activeQuestionIndex]?.answers.map( (answer, index) => (
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