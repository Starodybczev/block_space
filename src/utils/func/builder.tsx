import type { SupportedLanguage } from "../hooks/useCodeRunner";

interface BuildLang {
    lang: SupportedLanguage;
    code: string;
    createSafeScript: (code: string) => string
}
export function buildByLang({ lang, code, createSafeScript }: BuildLang) {
    switch (lang) {
        case "html":
            return { html: code, css: "", js: "" };

        case "css":
            return { html: "", css: `<style>${code}</style>`, js: "" };

        case "javascript":
            return {
                html: '<div id="app"></div>',
                css: "",
                js: createSafeScript(code)
            };

        default:
            return { html: "", css: "", js: "" };
    }
}