import { useContext, type ReactNode } from "react"
import { Navigate, Route, Routes } from "react-router"
import {CharacterContainer} from "../caracters/CharacterContainer"
import { AuthContext } from "../auth/context/AuthContext"
import { AuthContainer } from "../auth/AuthContainer"
import CharacterForm from "../caracters/components/CharacterForm"

const PrivateRoute = ({children}:{children:ReactNode})=>{
    const {state}=useContext(AuthContext)

    return state.isAuthenticated? children:<Navigate to="/" /> 
}

export const AppRouter = ()=>{
    return (
    <Routes>
        <Route path="/*" element={<AuthContainer/>}/>
        <Route path="/characters" element={<PrivateRoute><CharacterContainer/></PrivateRoute>}/>
        <Route path="/characters/:id" element={<PrivateRoute><CharacterForm/></PrivateRoute>}/>
    </Routes>
    )
}