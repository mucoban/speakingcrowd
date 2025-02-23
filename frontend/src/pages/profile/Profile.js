import { useState, useEffect, useMemo } from 'react';
import axiosConfig from '../../config/axiosConfig';
import './profile.scss';

export default function Profile() {

    const [user, setUser] = useState(null);
    
    const [inputData, setInputData] = useState({
        fullname: ''
    });

    const [passwordsData, setPasswordsData] = useState({
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
    });

    const [editSwitchers, setEditSwitchers] = useState({
        fullname: false,
        changePassword: false
    });

    const inputsHandler = (e) => {
        setInputData( { ...inputData, [e.target.name]: e.target.value} );
    }

    const passwordsInputsHandler = (e) => {
        setPasswordsData( { ...passwordsData, [e.target.name]: e.target.value} );
    }

    useEffect(() => {
        axiosConfig.get(`/user`)
            .then(res => {
                setUser(res?.data);
                setInputData(res?.data);
            });
    }, []);

    const changed = useMemo(() => {
        return user?.fullname !== inputData.fullname
    }, [user, inputData]);

    const changedPasswords = useMemo(() => {        
        return passwordsData.currentPassword 
            && passwordsData.newPassword 
            && passwordsData.newPassword === passwordsData.repeatPassword;
    }, [passwordsData]);

    const onSubmit = (e) => {
        e.preventDefault();

        const data = { fullname: inputData.fullname };
        axiosConfig.post(`/user`, data)
            .then(res => {
                if (res.data.status) {
                    setUser(inputData);
                    return alert('saved successfully');
                } 
            });
    }

    const onSubmitPasswords = () => {
       const data = {...passwordsData};
       delete data.passwordsData;

       axiosConfig.post(`/crendentials`, passwordsData)
            .then(res => {
                if (res.data.status) {
                    setPasswordsData({});
                    setEditSwitchers({});
                    return alert('Password has been changed successfully');
                }
                
                return alert('An error occured');
            });
    }

    return (
        <div className="container update-profile">
            <div className="row align-items-center mt-5">
                <div className="col">
                    <h3 className="mb-5">Update your profile</h3>

                    <div className="main-holder">
                        <form onSubmit={onSubmit}>
                            <div className="form-group mb-3">
                                <label>Name Lastname</label>
                                <div className='info-card'>
                                    {editSwitchers.fullname ? 
                                        <div>
                                            <input type="text" 
                                                className="form-control" 
                                                name="fullname" 
                                                value={inputData.fullname}
                                                placeholder="Fullname"
                                                onChange={inputsHandler} />
                                        </div> :
                                        <div>
                                            <p>{inputData.fullname}</p>
                                        </div>
                                    }

                                    <button type='button' className='btn btn-secondary' onClick={() => setEditSwitchers({ fullname: !editSwitchers.fullname })}>{
                                        editSwitchers.fullname ? 'close' : 'edit'
                                    }</button>
                                </div>                            
                            </div>
                            <div>
                                <b>Current Test:</b>
                                <p>{user?.currentTestName}</p>
                            </div>
                            <div className="text-end">
                                <button disabled={!changed} type="submit" className="btn btn-primary">Save</button>
                            </div>
                            <div>

                                <a className='btn btn-dark mb-3' onClick={() => setEditSwitchers({ changePassword: !editSwitchers.changePassword })}>Change Password</a>

                                { !editSwitchers.changePassword ||
                                    <div className='info-card row'>
                                        <input type="password" 
                                            className="form-control" 
                                            name="currentPassword"
                                            placeholder="Current Password" 
                                            onChange={passwordsInputsHandler} />
                                        <input type="password" 
                                            className="form-control" 
                                            name="newPassword"
                                            placeholder="New Password" 
                                            onChange={passwordsInputsHandler} />
                                        <input type="password" 
                                            className="form-control" 
                                            name="repeatPassword"
                                            placeholder="Repeat Password"
                                            onChange={passwordsInputsHandler} />
                                        <div className="text-end">
                                            <button 
                                                disabled={!changedPasswords} 
                                                type="button" 
                                                className="btn btn-primary" 
                                                onClick={onSubmitPasswords}>Save Password</button>
                                        </div>
                                    </div>
                                }
                            </div>
                           
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}