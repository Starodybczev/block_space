import { type RefObject } from 'react';
import { editor } from 'monaco-editor';;
import { useAssets } from '../../contex/AssetsContext';
import { type SupportedLanguage, createSafeScript, ExceptionReader, validateJS, buildByLang, buildDocument, createTextMessage } from "../index"


type CodeTypeRunner = {
    editorRef: RefObject<editor.IStandaloneCodeEditor | null>,
    iframeRef: RefObject<HTMLIFrameElement | null>
}

export function useCodeRunner({ editorRef, iframeRef }: CodeTypeRunner) {

    const { assets } = useAssets()

    const assetsMap = Object.fromEntries(
        assets.map((a) => [`/assets/${a.name}`, a.url])
    );

    const runCode = (currentLang: SupportedLanguage) => {
        if (!editorRef.current || !iframeRef.current) return;

        const code = editorRef.current.getValue().trim();
        const iframe = iframeRef.current;


        if (!code) {
            createTextMessage({ iframe, content: `<h3>Редактор пуст</h3>` })
            return;
        }


        if (currentLang === "javascript") {
            const error = ExceptionReader(code) || validateJS(code);

            if (error) {
                createTextMessage({ iframe, content: `<pre style="color:red">${error}</pre>` })
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

        createTextMessage({ iframe, content: fullDoc })

        console.log(assetsMap)
    };

    return { runCode }
}
