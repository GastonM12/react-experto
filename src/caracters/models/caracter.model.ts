export enum Status{
    Alive="Alive",
    Dead="Dead",
    Unknown="Unknown"
}

export enum Gender{
    Female="Female",
    Male="Male",
    Genderless="Genderless",
    Unknown="Unknown"
}

export interface Origin {
    name:string,
    url:string
}

export interface Location {
    name:string,
    url:string
}

export interface Character{
    id:number,
    name:string,
    status:Status,
    species:string,
    type:string,
    gender:Gender,
    origin:Origin,
    location:Location,
    image:string,
    episode:string[],
    url:string,
    created:string
}