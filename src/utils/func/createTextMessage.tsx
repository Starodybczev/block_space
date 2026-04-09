interface TextType{
    iframe: HTMLIFrameElement;
    content: string
}

export function createTextMessage({iframe, content}: TextType){
    iframe.srcdoc = content
}