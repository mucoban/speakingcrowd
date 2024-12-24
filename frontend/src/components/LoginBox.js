import axiosConfig from '../config/axiosConfig';

export default function LoginBox() { 

    const handleSubmit = event => {
        event.preventDefault();

        const data = {
            username: event.target.username.value,
            password: event.target.password.value,
        };

        axiosConfig.post(`/login`, data)
            .then(res => {
                if (res.status === 200) { 
                    alert("Login successful"); 
                    event.target.reset();
                }
            })
            .catch( error => {
                console.log(error);
                alert(error?.response?.data);
            });
        
    }

    return  <div style={{maxWidth: '600px'}} className="text-start m-auto">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="text" className="form-control" name="username" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <div className="form-group mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control" name="password" placeholder="Password" />
                    </div>
                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>;    
}