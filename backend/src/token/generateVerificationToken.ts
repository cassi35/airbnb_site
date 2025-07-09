export const generateVerificationToken =():string=>{
    const token:string = Math.floor(10000+Math.random()*90000).toString() 
    return token 
}