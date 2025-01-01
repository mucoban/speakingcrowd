import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [user, setUser] = useState({});

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setToken(token);
    };

    return (<AuthContext.Provider value={{ isLoggedIn, token, user, login }}>
        {children}
    </AuthContext.Provider>);
}

export const useAuth = () => {
    return useContext(AuthContext);
};  