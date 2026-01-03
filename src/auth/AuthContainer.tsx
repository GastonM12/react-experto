import { Navigate, Route, Routes } from "react-router";
import LoginForm from "./components/LoginForm";
import { RegisterForm ,} from "./components/RegisterForm";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
    
 export const AuthContainer = ()=>{

    const {state} = useContext(AuthContext);

    if(state.isAuthenticated){
        return <Navigate to="/characters" />;
    }
        return( 
        <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm/>} />
        </Routes>
      )
    
 }    
   