import { useState, type ChangeEvent } from 'react'
import { Editor } from '@monaco-editor/react'
import { tasksArray } from '../data/taskArray'



const option = [
    { id: 1, name: "Задание 1" },
    { id: 2, name: "Задание 2" },
    { id: 3, name: "Задание 3" },
    { id: 4, name: "Задание 4" },
    { id: 5, name: "Задание 5" },
    { id: 6, name: "Задание 6" },
    { id: 7, name: "Задание 7" },
    { id: 8, name: "Задание 8" }
]


export default function EditorTasks() {

    const [currentTask, setCurrentTask] = useState(option[0].id)

    const optionMap = option.map(({ id, name }) => {    
        return (
            <option key={id} value={id}>
                {name}
            </option>
        )
    })
    const activeId = tasksArray.find((el) => el.id === currentTask)
    const taskContent = activeId 
        ? `\n\n ${activeId.title} \n\n ${activeId.task} \n ${activeId.criteria}` 
        : "Задание не выбрано";

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrentTask(Number(e.target.value))
    }
    return (
        <div className='block_two'>
            <select className='select_lang' value={currentTask} onChange={handleSelectChange}>
                {optionMap}
            </select>
            <Editor theme="vs-dark" height="50vh" width="100%" key={currentTask} value={taskContent} language='html'  options={{readOnly: true, domReadOnly: true, contextmenu: false, quickSuggestions: false}}/>
        </div>
    )
}
