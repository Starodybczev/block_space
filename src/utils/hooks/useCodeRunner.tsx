import { useCallback, type RefObject } from 'react';
import { editor } from 'monaco-editor';

type CodeTypeRunner = {
    editorRef: RefObject<editor.IStandaloneCodeEditor | null>,
    iframeRef: RefObject<HTMLIFrameElement | null>
}

export type SupportedLanguage = "javascript" | "css" | "html"

export function useCodeRunner({ editorRef, iframeRef }: CodeTypeRunner) {

    const runCode = (currentLang: SupportedLanguage) => {
        if (!editorRef.current || !iframeRef.current) return;

        const code = editorRef.current.getValue();
        const iframe = iframeRef.current;

        let html = "";
        let css = "";
        let js = "";

        // Настраиваем сборку в зависимости от того, что сейчас в редакторе
        if (currentLang === 'html') {
            html = code;
        } else if (currentLang === 'css') {
            css = `<style>${code}</style>`;
        } else if (currentLang === 'javascript') {
            html = '<div id="app"></div>';
            js = `<script>${code}<\/script>`;
        }

        const fullDoc = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    ${css}
                </head>
                <body>
                    ${html}
                    ${js}
                </body>
            </html>
         `;

        iframe.srcdoc = fullDoc;
    };

    return { runCode };
};