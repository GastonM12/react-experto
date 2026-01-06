import { useCallback, useState } from "react"
import { useAxios } from "../hooks/useAxios"
import type { Character } from "./models"
import { CharacterList } from "./components/CharacterList"
import { characterService } from "./services"

export const CharacterContainer = () => {
  const serviceCall = useCallback(() => characterService.getCharacters(),[])
  const {isLoading,data: characters,error}=useAxios<void,Character[]>({
    serviceCall,
    trigger:true
  })
  const triggerChange = () => {
   // setTrigger((prev)=>(!prev))
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


