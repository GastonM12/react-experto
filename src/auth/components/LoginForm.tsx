import { zodResolver } from "@hookform/resolvers/zod"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import z from "zod"

import { AuthService } from "../services/AuthService"
import { AuthActionType } from "../models/AuthState"
import { FormInput } from "../../shared/components/FormInput"
import { AuthContext } from "../context"


const loginSchema = z.object({
email:z.string().email("El email no es válido"),
password:z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const {register, handleSubmit, formState} = useForm<LoginFormData>({
 resolver: zodResolver(loginSchema)
  })
 const {dispatch} = useContext(AuthContext)
 const navigate = useNavigate()

 const onSubmit = async (data: LoginFormData) => {
  try{
    const authService = new AuthService();
    const user = await authService.login(data.email,data.password);
    dispatch({type:AuthActionType.LOGIN, payload:user})
    navigate("/characters")

  }catch(error){
    console.error("Error during login:", error);
    alert("Error al iniciar sesión. Por favor, verifica tus credenciales e intenta de nuevo.")
  }
 }
  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
          <FormInput
          label="Email"
          register={register("email")}
          error={formState.errors.email?.message}/>
                    <FormInput
          label="Password"
          register={register("password")}
          error={formState.errors.password?.message}/>
          <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
          <p>No tienes una cuenta? <Link to="/register">Regístrate </Link></p>
    </div>
  )
}

export default LoginForm
