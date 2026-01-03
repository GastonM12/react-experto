import { TokenStorage } from "../../shared/services/TokenStorage";
import { AuthAdapter } from "../adapters/AuthAdapter";
import type { User } from "../models";


export class AuthService {
    private authAdapter=new AuthAdapter();

    async login(username: string, password: string): Promise<User> {
        const token=await this.authAdapter.login(username, password);
        TokenStorage.setToken(token);
        const user:User=TokenStorage.decodeToken(token) ;
        return user;
    }

    async register( password:string, email:string): Promise<void>{
        await this.authAdapter.register( password, email);
    
    }

    async logout(): Promise<void>{
        TokenStorage.removeToken();
    
    }
    getUser(): User | null {
    const token = TokenStorage.getToken();
    if (token) {
        try{
            const user: User = TokenStorage.decodeToken(token);
            return user;

        }
        catch(error){
            console.error("Failed to decode token:", error);
            TokenStorage.removeToken();
            return null;
        }
    }
    return null;
    
    }
}