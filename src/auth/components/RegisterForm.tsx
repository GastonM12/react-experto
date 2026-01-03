import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import z from "zod"
import { AuthService } from "../services/AuthService"
import { FormInput } from "../../shared/components/FormInput"

const registerSchema= z.object({
  email:z.string().email("El email no es válido"),
  password:z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword:z.string().min(6, "La confirmación de la contraseña debe tener al menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path:["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const {register,handleSubmit,formState} = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })
  const navigate = useNavigate()

  const onSubmit = async (data:RegisterFormData)=>{
    try{
      const authService = new AuthService();
      await authService.register(data.email,data.password);
      alert("Registro exitoso! Ahora puedes iniciar sesión.")
      navigate("/login")

    }catch(error){
      console.error("Error during registration:", error);
      if(error instanceof Error){
      alert(error.message||"Error al registrarse. Por favor, intenta de nuevo.")
    }
  }
}
  return (
    <div className="container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormInput
          label="Email"
          register={register("email")}
          error={formState.errors.email?.message}/>
          <FormInput
          label="Password" 
          register={register("password")}
          error={formState.errors.password?.message}/>
          <FormInput
          label="Confirm Password"
          register={register("confirmPassword")}
          error={formState.errors.confirmPassword?.message}
          />
          <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
      <p>¿Ya tienes una cuenta? <Link to="/">Iniciar sesión</Link></p>
    </div>
  )
}


