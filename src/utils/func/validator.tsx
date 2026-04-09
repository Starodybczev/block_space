export function validateJS(code: string){
    try {
        new Function(code)
        return null
    } catch (error) {
        console.log(error)
    }
}   