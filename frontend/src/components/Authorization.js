import { Outlet } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const Authorization = () =>  {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <Outlet /> : <h1>Authorized!</h1>;
}

export default Authorization;