import { useState, useEffect } from 'react';
import axiosConfig from '../../config/axiosConfig';
import { Link } from 'react-router-dom';

export default function Tests() {

    const [tests, setTests] = useState([]);

    useEffect(() => {
        axiosConfig.get(`/tests`, { params: { includeUserPassed: true } })
        .then(res => {
            const tests = res.data;
            setTests(tests);
        });
    }, []);

    return <div className="test-page">
        <div className="container">
            <p className="page-title">All Tests</p>
            <div className="section">
                <p className="section-title">Your Rank:</p>
                <p className="rank">Beginner</p>
            </div>
            <div className="section">
                <p className="section-title">Tests:</p>
                <div className="test-cards">
                    { tests.map((test, index) => 
                        <Link 
                            className="tcard" 
                            key={index} to={`/test/${test.id}`} 
                            onClick={ (event) => test.userPassed || event.preventDefault() }>
                            {test.name} { test.userPassed || '- Locked' }
                        </Link>
                        ) }
                </div>
            </div>
        </div>
    </div>
}