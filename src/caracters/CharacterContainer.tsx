import { useState } from "react"
import { useAxios } from "../hooks/useAxios"
import type { Character } from "./models"
import { CharacterList } from "./components/CharacterList"

export const CharacterContainer = () => {
  const [trigger,setTrigger]= useState<boolean>(false)

  const {isLoading,data: characters,error}=useAxios<void,Character[]>({
    url:"http://localhost:4000/characters",
    method:"GET",
    trigger:trigger
  })
  const triggerChange = () => {
    setTrigger((prev)=>(!prev))
  }
  if(isLoading){
    return <p>Cargando...</p>
  }
  if(error){
    return <p>Error al cargar los personajes {error} </p>
  }
  return (
    <>
    {
     characters && characters?.length > 0 ?
      <CharacterList characters={characters} onDelete={triggerChange}>
      </CharacterList>:
      <p>No hay personajes</p>
    }
    </>
  )
}


