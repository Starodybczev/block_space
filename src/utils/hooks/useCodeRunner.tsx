import { type RefObject } from 'react';
import { editor } from 'monaco-editor';
import { ExceptionReader } from '../func/ExceptionReader';
import { createSafeScript } from '../func/createSafeScript';
import { useAssets } from '../../contex/AssetsContext';

type CodeTypeRunner = {
    editorRef: RefObject<editor.IStandaloneCodeEditor | null>,
    iframeRef: RefObject<HTMLIFrameElement | null>
}

export type SupportedLanguage = "javascript" | "css" | "html"

export function useCodeRunner({ editorRef, iframeRef }: CodeTypeRunner) {

    const { assets } = useAssets()

    const runCode = (currentLang: SupportedLanguage) => {
        if (!editorRef.current || !iframeRef.current) return;

        const code = editorRef.current.getValue().trim();
        const iframe = iframeRef.current;

        let sintaxError: string | null = null

        const assetsMap = Object.fromEntries(
            assets.map((a) => [`/assets/${a.name}`, a.url])
        )

        if (currentLang === "javascript") {
            sintaxError = ExceptionReader(code)
        }



        if (sintaxError) {
            iframe.srcdoc = `
                <div style="color:red;padding:20px;font-family:monospace;">
                    <h3>Ошибка:</h3>
                    <pre>${sintaxError}</pre>
                </div>
            `
            return
        }

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

            js = createSafeScript(code)


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

        }

        const fullDoc = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                            html, body { 
                    margin: 0; 
                    padding: 10px; 
                    min-height: 100vh;
                    /* Используем тот же путь, он подтянется из корня сайта */
                    cursor: url("/cursore.svg") 0 0, auto !important; 
                }
                    </style>
                    ${css}
                </head>
                <body>
                    ${html}
                    <script>
  window.__ASSETS__ = ${JSON.stringify(assetsMap)};

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach(img => {
      const src = img.getAttribute("src");
      if (window.__ASSETS__[src]) {
        img.src = window.__ASSETS__[src];
      }
    });
  });
</script>
                    ${js}
                </body>
            </html>
        `;

        iframe.srcdoc = fullDoc;
    };

    return { runCode };
};