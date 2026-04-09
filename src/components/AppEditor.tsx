import { useRef, useState, type ChangeEvent } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react';
import { useCodeRunner, type SupportedLanguage } from '../utils/hooks/useCodeRunner';
import useModal from '../utils/hooks/useModal';
import Modal from '../utils/const/Modal';
import {EditorTasks, AssetsProviderFile} from "./index"


    const options = [
        {
            id: 1,
            name: "javascript",
            firstVal: "// Напишите ваш скрипт\nconsole.log('Hello World!');"
        },
        {
            id: 2,
            name: "html",
            firstVal: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`
        },
        {
            id: 3,
            name: "css",
            firstVal: "/* Стили */\nbody {\n  margin: 0;\n  padding: 0;\n}"
        }
    ];

export default function AppEditor() {

    const [currentLang, setCurrentLang] = useState<SupportedLanguage>("html")

    const editorRef = useRef<any>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const { isOpenModaL, isOpen, closeModal } = useModal()

    const { runCode } = useCodeRunner({ editorRef, iframeRef })


    const currentConfig = options.find((item) => item.name === currentLang)



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
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <AssetsProviderFile/>
            </Modal>
            <select className='select_lang' value={currentLang} onChange={handleChangeValue}>
                {optionMap}
            </select>
            <button className='btn_run' onClick={() => runCode(currentLang)}>
                run
            </button>
            <button className='assets_btn' onClick={() => isOpenModaL()}>assets</button>
            <div className='block_editor'>
                <Editor theme="vs-dark" height="50vh" width="100%" path={currentLang} defaultValue={currentConfig?.firstVal} language={currentLang} onMount={handleEditorDidMount} />
                <EditorTasks />
            </div>
            <div className='run_editor' style={{ flex: 1, borderTop: '5px solid #444', background: 'white' }}>
                <iframe
                    className='iframe_block'
                    ref={iframeRef}
                    title="output"
                    sandbox="allow-scripts allow-modals allow-same-origin"
                    srcDoc={`<html><head><style>body{cursor:url('/cursore.svg') 0 0, auto; height:100vh; margin:0;}</style></head><body></body></html>`}
                    style={{ width: '100%', height: '400px', border: 'none' }}
                />
            </div>
        </div>
    )
}
