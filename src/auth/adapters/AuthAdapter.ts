import { apiFetch } from "../../shared/adapter";

export class AuthAdapter {
    private BASE_URL = 'http://localhost:4000';
    
    async login(email:string,password:string):Promise<string>{
        const response = await apiFetch(`${this.BASE_URL}/auth/login`,{
            method:'POST',
            body:JSON.stringify({email,password})
        });
        const data = await response.json();
        console.log(data);
        if(!response.ok){
            throw new Error(data.message);
        }
        return data.token;
    }
    async register(email:string,password:string):Promise<string>{
        const response = await apiFetch(`${this.BASE_URL}/auth/register`,{
            method:'POST',
            body:JSON.stringify({email,password})
        });
        const data = await response.json();
        console.log(data);
        if(!response.ok){
            throw new Error(data.message);
        }
        return data.token;
    }

}