import { type RefObject } from 'react';
import { editor } from 'monaco-editor';
import { ExceptionReader } from '../func/ExceptionReader';
import { createSafeScript } from '../func/createSafeScript';
import { useAssets } from '../../contex/AssetsContext';
import { validateJS } from '../func/validator';
import { buildByLang } from '../func/builder';
import { buildDocument } from '../func/buildDoc';

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

        const assetsMap = Object.fromEntries(
            assets.map((a) => [`/assets/${a.name}`, a.url])
        );


        if (!code) {
            iframe.srcdoc = `<h3>Редактор пуст</h3>`;
            return;
        }


        if (currentLang === "javascript") {
            const error = ExceptionReader(code) || validateJS(code);

            if (error) {
                iframe.srcdoc = `<pre style="color:red">${error}</pre>`;
                return;
            }
        }

        const { html, css, js } = buildByLang({
            lang: currentLang,
            code,
            createSafeScript
        });


        const fullDoc = buildDocument({
            html,
            css,
            js,
            assets: assetsMap
        });

        iframe.srcdoc = fullDoc;
    };

    return {runCode}
}
