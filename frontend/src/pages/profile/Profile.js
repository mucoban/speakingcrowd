import { useState, useEffect } from 'react';
import axiosConfig from '../../config/axiosConfig';
import './profile.scss';

export default function Profile() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        axiosConfig.get(`/user`)
            .then(res => {
                setUser(res?.data);
            });
    }, []);

    return (
        <div className="container update-profile">
            <div class="row align-items-center mt-5">
                <div class="col">
                    <h3 className="mb-5">Update your profile</h3>

                    <div className="main-holder">
                        <form>
                            <div className="form-group mb-3">
                                <label>Name Lastname</label>
                                <input type="text" 
                                    className="form-control" 
                                    name="username" 
                                    aria-describedby="emailHelp" 
                                    value={user?.fullname}
                                    placeholder="Enter email" />
                            </div>
                            <div>
                                <b>Current Test:</b>
                                <p>{user?.currentTestName}</p>
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}