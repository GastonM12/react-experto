import type { UseFormRegisterReturn } from "react-hook-form";

type Props ={
    label:string;
    register:UseFormRegisterReturn,
    error?:string,
    type?:string
}

export const FormInput = ({label, register, error, type="text"}:Props) => { {
  return (
    <div className="formgroup">
      <label>{label}</label>
      <input type={type} {...register} className={`form-control ${error ? "is-invalid" : ""}`} />
      {error && <div className="error">{error}</div>}
    </div>
  )
}
}
