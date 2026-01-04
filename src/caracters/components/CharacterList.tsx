import type { Character } from "../models"
import { CharacterService } from "../services"
import { CharacterItem } from "./CharacterItem"

interface Props {
    characters: Character[],
    onDelete:()=>void
}

export const CharacterList = ({characters,onDelete}:Props) => {
    
    const characterService = new CharacterService()

    const handeDelete = async (id:number)=>{
    try{
      await characterService.deleteCharacter(id)

      onDelete()
    }catch(error){
      console.log("Error al eliminar el personaje",error)}
  }
  return (
    <ul>
      {
        characters.map(character => (
        <CharacterItem key={character.id} character={character} >   
         <button onClick={()=>handeDelete(character.id)}>Eliminar</button>
        </CharacterItem>
        ))
      }
    </ul>
  )
}
