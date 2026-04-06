import { useCallback, type RefObject } from 'react';
import { editor } from 'monaco-editor';

type CodeTypeRunner = {
    editorRef: RefObject<editor.IStandaloneCodeEditor | null>,
    iframeRef: RefObject<HTMLIFrameElement | null>
}

export type SupportedLanguage = "javascript" | "css" | "html"

export function useCodeRunner({editorRef, iframeRef}: CodeTypeRunner){
    
   const runCode = (currentLang: SupportedLanguage) => {
        if (!editorRef.current || !iframeRef.current) return;

        const code = editorRef.current.getValue();
        const iframe = iframeRef.current;
        
        let html = "";
        let css = "";
        let js = "";

        if (currentLang === 'html') html = code;
        if (currentLang === 'css') css = `<style>${code}</style>`;
        if (currentLang === 'javascript') js = `<script>${code}<\/script>`;

        const fullDoc = `
            <!DOCTYPE html>
            <html>
                <head>${css}</head>
                <body>
                    ${html}
                    ${js}
                    <script>
                        // Базовая защита: перехват ошибок, чтобы они не вешали основной поток
                        window.onerror = function(msg, url, line) {
                            parent.postMessage({type: 'error', msg: msg, line: line}, '*');
                        };
                    </script>
                </body>
            </html>
        `;

        iframe.srcdoc = fullDoc;
    };

    return { runCode };
};