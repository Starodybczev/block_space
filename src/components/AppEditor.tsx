import React, { useRef, useState, type ChangeEvent } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react';
import { useCodeRunner, type SupportedLanguage } from '../utils/hooks/useCodeRunner';
import EditorTasks from './EditorTasks';

export default function AppEditor() {

    const [currentLang, setCurrentLang] = useState<SupportedLanguage>("html")

    const editorRef = useRef<any>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const { runCode } = useCodeRunner({ editorRef, iframeRef })


    const options = [
        { id: 1, name: "javascript" },
        { id: 2, name: "html" },
        { id: 3, name: "css" }
    ]


    const optionMap = options.map(({ id, name }) => {
        return (
            <option key={id} value={name}>
                {name}
            </option>
        )
    })

    const handleChangeValue = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrentLang(e.target.value as SupportedLanguage)
    }

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor
    }


    return (
        <div className='block_alls'>
            <select value={currentLang} onChange={handleChangeValue}>
                {optionMap}
            </select>
            <button onClick={() => runCode(currentLang)}>
                run
            </button>
            <div className='block_editor'>
                <Editor height="50vh" width="100%" defaultValue="// some comment" language={currentLang} onMount={handleEditorDidMount} />
                <EditorTasks handleEditorDidMount={handleEditorDidMount} />
            </div>
            <div style={{ flex: 1, borderTop: '5px solid #444', background: 'white' }}>
                <iframe
                    ref={iframeRef}
                    title="output"
                    sandbox="allow-scripts allow-modals allow-same-origin"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </div>
        </div>
    )
}
