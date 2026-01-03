import { createContext, useEffect, useReducer } from "react";
import { AuthActionType, type AuthAction, type AuthState, type User } from "../models/AuthState";
import { TokenStorage } from "../../shared/services/TokenStorage";



const initialState : AuthState= {
  isAuthenticated: false,
  user: null,
};

export const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}>
({
    state: initialState,
    dispatch: () => null
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
switch(action.type){
    case AuthActionType.LOGIN:
        return {
            isAuthenticated: true,
            user: action.payload
        };
    case AuthActionType.LOGOUT:
        return initialState;
    default:
        return state;
}
} 

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
   useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const user: User= TokenStorage.decodeToken(token);
            dispatch({ type: AuthActionType.LOGIN, payload: user });
        } catch (error) {
            console.error('Invalid token:', error);
            TokenStorage.removeToken();
        }
    } 
   }, []);
    return (
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
    );
   }