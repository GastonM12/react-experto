import type { CancelTokenSource} from "axios";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TokenStorage } from "../shared/services/TokenStorage";
import { AuthContext } from "../auth/context";

import { AuthActionType } from "../auth/models";

interface Props <B,D> {
    serviceCall:(Body:B)=>Promise<D>,
    trigger?:boolean;
}
type  Data<D> = D | null;
type  CustomError = string | null;
interface ReturnType<B,D>{
    isLoading:boolean;
    data:Data<D>;
    error:CustomError;
    executeFetch:(body?:B)=>void;

}

/**
 * Hook personalizado `useAxios` para gestionar peticiones HTTP asíncronas con Axios en React.
 *
 * Este hook encapsula la lógica común para realizar peticiones a una API, incluyendo:
 * - Gestión de estado de carga (`isLoading`).
 * - Almacenamiento de datos de respuesta (`data`).
 * - Manejo de errores (`error`).
 * - Cancelación automática de peticiones al desmontar el componente para evitar fugas de memoria.
 * - Inyección automática del token de autenticación desde `TokenStorage`.
 * - Manejo centralizado de errores de autenticación (401 Unauthorized, 403 Forbidden) cerrando la sesión.
 *
 * @template B - (Body) Tipo de los datos que se envían en la petición (ej. cuerpo de un POST o parámetros).
 *               Si la petición no requiere argumentos (como un GET simple), usar `void` o `null`.
 * @template D - Tipo de datos (Data) que retorna la promesa del servicio.
 *
 * @param {Props<B, D>} props - Objeto de configuración del hook.
 * @param {(body: B) => Promise<D>} props.serviceCall - Función asíncrona que realiza la llamada a la API.
 *                                                      Debe retornar una Promesa que resuelva con los datos de tipo `D`.
 *                                                      Esta función suele provenir de una capa de servicios.
 * @param {boolean} [props.trigger=false] - Bandera para controlar la ejecución automática.
 *                                          - `true`: La petición se ejecuta inmediatamente al montar el componente o cuando cambia `serviceCall`.
 *                                          - `false`: La petición no se ejecuta automáticamente. Debe llamarse manualmente usando `executeFetch`.
 *
 * @returns {ReturnType<B, D>} Un objeto con las siguientes propiedades:
 * - `isLoading` (boolean): `true` mientras la petición está en curso, `false` en caso contrario. Útil para mostrar spinners.
 * - `data` (D | null): Los datos recibidos de la API si la petición fue exitosa. Inicialmente es `null`.
 * - `error` (string | null): Mensaje de error si la petición falló. Inicialmente es `null`.
 * - `executeFetch` ((body?: B) => void): Función para ejecutar la petición manualmente.
 *                                        Útil para eventos de usuario (clicks) o para reintentar una petición fallida.
 *                                        Acepta opcionalmente un argumento `body` de tipo `B`.
 *
 * @example
 * // -------------------------------------------------------------------------
 * // Ejemplo 1: Petición GET automática al cargar un componente (Listado)
 * // -------------------------------------------------------------------------
 * // Suponiendo un servicio: getCharacters(): Promise<Character[]>
 *
 * const { data, isLoading, error } = useAxios<void, Character[]>({
 *   serviceCall: characterService.getCharacters,
 *   trigger: true // Se ejecuta al montar
 * });
 *
 * if (isLoading) return <p>Cargando...</p>;
 * if (error) return <p>Error: {error}</p>;
 * return <ul>{data?.map(char => <li key={char.id}>{char.name}</li>)}</ul>;
 *
 * @example
 * // -------------------------------------------------------------------------
 * // Ejemplo 2: Petición manual disparada por el usuario (Eliminar/Crear)
 * // -------------------------------------------------------------------------
 * // Suponiendo un servicio: deleteCharacter(id: number): Promise<void>
 *
 * const { executeFetch, isLoading } = useAxios<number, void>({
 *   serviceCall: (id) => characterService.deleteCharacter(id),
 *   trigger: false // No se ejecuta al montar
 * });
 *
 * const handleDelete = (id: number) => {
 *   executeFetch(id); // Se ejecuta al hacer click
 * };
 *
 * return <button onClick={() => handleDelete(1)} disabled={isLoading}>Eliminar</button>;
 *
 * @requires
 * 1. **Axios**: Debe estar instalado (`npm install axios`).
 * 2. **AuthContext**: El hook consume `AuthContext` para despachar acciones de logout (`AuthActionType.LOGOUT`)
 *    en caso de errores 401/403. La aplicación debe estar envuelta en un `AuthProvider`.
 * 3. **TokenStorage**: Utilidad para obtener el token de autenticación (`TokenStorage.getToken()`).
 *
 * @remarks
 * **Funcionamiento Interno Detallado:**
 * 1. **CancelToken**: Se crea un `CancelTokenSource` de Axios en cada ejecución. Si el componente se desmonta
 *    antes de que termine la petición, se llama a `cancel()` en el `useEffect` de limpieza. Esto previene
 *    actualizaciones de estado en componentes desmontados.
 * 2. **Intercepción de Token**: Antes de realizar la llamada, se obtiene el token de `TokenStorage`.
 *    Si existe, se inyecta en `axios.defaults.headers.common["Authorization"]`.
 *    *Nota: Esto modifica los defaults globales de axios. Considerar usar una instancia de axios o interceptores si se requiere aislamiento.*
 * 3. **Manejo de Errores**:
 *    - Si es un error de cancelación (`axios.isCancel`), se ignora (solo log).
 *    - Si es un error de respuesta HTTP (401/403), se dispara el logout globalmente.
 *    - Otros errores actualizan el estado `error` para ser mostrados en la UI.
 */
export const useAxios= <B,D>({serviceCall,trigger=false}:Props<B,D>):ReturnType<B,D>=>{
const [isLoading,setIsLoading]=useState<boolean>(false);
const [data,setData]=useState<Data<D>>(null)
const [error,setError]=useState<CustomError>(null)
const cancelSource = useRef<CancelTokenSource|null>(null);
const {dispatch} = useContext(AuthContext);

const executeFetch =useCallback(async(body:B = {} as B)=>{
        setIsLoading(true);
        setError(null);

        const source = axios.CancelToken.source();
        
        cancelSource.current = source;

        try{
            const token = TokenStorage.getToken();
       if(token){
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
       }
       const response = await serviceCall(body);

         setData(response); 

        }catch(err:unknown){
            if(axios.isAxiosError(err)){
                console.log("peticion cancelada",(err as Error).message);
            }else if(axios.isAxiosError(err)){
                setError(err.message||"error desconocido ");
                if(err.status==403||err.status==401){
                      dispatch({type:AuthActionType.LOGOUT});
                }
            }else{
                setError("error desconocido");
            }
            }
        finally{
            setIsLoading(false)
        }
},[dispatch,serviceCall])
useEffect(()=>{
    if(trigger){
        executeFetch();
    }
    
    return()=>{
     if(cancelSource.current){
        cancelSource.current.cancel("peticion cancelada");
     }   
    }
},[trigger])
return{isLoading,data,error,executeFetch}
}