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

        const code = editorRef.current.getValue().trim(); // Убираем пробелы
        const iframe = iframeRef.current;

        // 1. Проверка на пустой редактор
        if (!code) {
            iframe.srcdoc = `
                <html>
                    <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 90vh; margin: 0;">
                        <div style="text-align: center; color: #ef4444; border: 1px dashed #ef4444; padding: 20px; border-radius: 8px;">
                            <h3 style="margin: 0;">⚠️ Внимание</h3>
                            <p>Редактор пуст. Напишите что-нибудь, чтобы увидеть результат.</p>
                        </div>
                    </body>
                </html>
            `;
            return;
        }

        let html = "";
        let css = "";
        let js = "";

        // 2. Сборка документа
        if (currentLang === 'html') {
            html = code;
        } else if (currentLang === 'css') {
            css = `<style>${code}</style>`;
        } else if (currentLang === 'javascript') {

            const checkJsErrors = (code: string): string | null => {
                try {
                    new Function(code);
                    return null;
                } catch (err: any) {
                    return err.message;
                }
            };

            if (currentLang === 'javascript') {
                const syntaxError = checkJsErrors(code);

                if (syntaxError) {
                    iframe.srcdoc = `
            <div style="color: #ff4d4f; background: #fff2f0; border: 1px solid #ffccc7; padding: 15px; font-family: monospace;">
                <h4 style="margin: 0 0 10px 0;">❌ Syntax Error:</h4>
                <pre style="white-space: pre-wrap; margin: 0;">${syntaxError}</pre>
            </div>
            `;
                    return; 
                }
            }

                html = '<div id="app"></div>';
                js = `
                <script>
                    try {
                        ${code}
                    } catch (err) {
                        document.body.innerHTML = \`
                            <div style="color: red; padding: 20px; font-family: monospace;">
                                <h3>Runtime Error:</h3>
                                <pre>\${err.message}</pre>
                            </div>
                        \`;
                    }
                <\/script>
            `;
            }

            const fullDoc = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { margin: 0; padding: 10px; font-family: sans-serif; }
                    </style>
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