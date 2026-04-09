import { useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { tasksArray } from '../data/taskArray'
import {Modal, useModal} from "../utils"
import {type CreateTaskData, CreateTaskForm} from "./index"


interface optionType {
    id: number;
    name: string;
}
export const option: optionType[] = [
    { id: 1, name: "Задание 1" },
    { id: 2, name: "Задание 2" },
    { id: 3, name: "Задание 3" },
    { id: 4, name: "Задание 4" },
    { id: 5, name: "Задание 5" },
    { id: 6, name: "Задание 6" },
    { id: 7, name: "Задание 7" },
    { id: 8, name: "Задание 8" }
]



export default function EditorTasks(){

const [tasks, setTasks] = useState(tasksArray)
const [optionsList, setOptionsList] = useState(option)

const [currentTaskId, setCurrentTaskId] = useState(option[0].id)
const { isOpen, isOpenModaL, closeModal } = useModal()

const createTask = (data: CreateTaskData) => {
    try {

        const newId = tasks.length + 1;

        const newTaskObj = {
            id: newId,
            ...data
        };

        setTasks(prev => [...prev, newTaskObj]);
        setOptionsList(prev => [...prev, {
            id: newId,
            name: data.title
        }]);

        setCurrentTaskId(newId);
        closeModal();
    } catch (e) {
        console.log(e)
    } 
};

const activeTask = tasks.find((el) => el.id === currentTaskId)
const taskContent = activeTask
    ? `\n\n ${activeTask.title} \n\n ${activeTask.task} \n ${activeTask.criteria}`
    : "Задание не выбрано"

return (
    <div className='block_two'>
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <CreateTaskForm onSubmit={createTask}/>
        </Modal>

        <select
            className='select_lang'
            value={currentTaskId}
            onChange={(e) => setCurrentTaskId(Number(e.target.value))}
        >
            {optionsList.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
            ))}
        </select>

        <button className='btn_run' onClick={isOpenModaL}>Create Task</button>

        <Editor
            theme="vs-dark"
            height="50vh"
            width="100%"
            key={currentTaskId}
            value={taskContent}
            language='html'
            options={{ readOnly: true, domReadOnly: true }}
        />
    </div>
)
}

