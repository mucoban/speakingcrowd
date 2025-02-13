import { useState, useEffect } from 'react';
import axiosConfig from '../../config/axiosConfig';
import './Test.scss';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

export default function Test() {

    const navigate = useNavigate();
    const params = useParams();
    const [questions, setQuestions] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        axiosConfig.get(`/test-q-a/${params.id}`)
            .then(res => {
                res.data.map(q => {

                    const answers = q.answers.slice();
                    const shuffledAnswers = answers.slice().reduce((newAnswers, answer) => { 
                        const newIndex = Math.floor(Math.random() * answers.length);
                        const foundAnswer = answers[newIndex];
                        answers.splice(newIndex, 1);
                        console.log({ newIndex, foundAnswer, answers });
                        return [...newAnswers, foundAnswer];
                    }, []);

                    q.answers = shuffledAnswers;
                    return q;
                });

                setQuestions(res.data);
            });
    }, [params.id]);

    const assess = answer => {

        const data = { 
            testId: params.id, 
            questionId: questions[activeQuestionIndex]?.id, 
            answerId: answer.id 
        };

        axiosConfig.post(`/assess-selection`, data).then(res => {
            
            if (!res.data?.status)
                return alert("Wrong answer!");

            if (res.data?.testPassed) {
                alert("You have completed the test");
                return navigate('/tests');
            }

            const nextIndex = activeQuestionIndex + 1;
            setActiveQuestionIndex(nextIndex);
    
        });

    }

    return (
        <div className="test-page">
            <div className="container">
                <div className="row">
                    <div className="col text-center">
                        <div className="main-title">Test</div>

                        <div className="question">{ questions && questions[activeQuestionIndex]?.question}</div>
                        <div className="answers">
                            { questions && questions[activeQuestionIndex]?.answers.map( (answer, index) => (
                                <div key={index} className="answer" onClick={() => assess(answer)}>
                                    <span className="answer-letter">{index}{!answer.correct || 'c'} - </span>
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