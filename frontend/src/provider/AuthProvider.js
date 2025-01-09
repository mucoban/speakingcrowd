import { createContext, useContext, useState, useEffect } from "react";
import axiosConfig from '../config/axiosConfig';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token'; 

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [user, setUser] = useState({});
    
    let axiosConfigInterceptors;

    const login = (token, setLocalStorage = true) => {
        if (setLocalStorage) localStorage.setItem(TOKEN_KEY, token);
        setIsLoggedIn(true);
        setToken(token);

        axiosConfigInterceptors = axiosConfig.interceptors.request.use(config => {
            config.headers = {
                Authorization: `Bearer ${token}`
            }
            return config;
        });
    };

    const logout = (token) => {
        localStorage.setItem(TOKEN_KEY, '');
        setIsLoggedIn(false);
        axiosConfigInterceptors.interceptors.request.eject(axiosConfigInterceptors);
    };

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
            login(token, false);
            console.log('automatically logged in');
        }
    }, []);

    return (<AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
        {children}
    </AuthContext.Provider>);
}

export const useAuth = () => {
    return useContext(AuthContext);
};  