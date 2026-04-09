import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { CreateTaskData } from './index';

type Props = {
    onSubmit: (data: {
        title: string;
        task: string;
        criteria: string;
        category: string;
    }) => void;
};

type FieldType = {
    name: keyof CreateTaskData;
    placeholder: string;
}

const fields: FieldType[] = [
    { name: "title", placeholder: "New task name" },
    { name: "criteria", placeholder: "New criteria" },
    { name: "task", placeholder: "New task" },
    { name: "category", placeholder: "New category" }
]

export default function CreateTaskForm({ onSubmit }: Props) {
    const [task, setTask] = useState<CreateTaskData>({
        title: "",
        criteria: "",
        task: "",
        category: ""
    })

    const handleValues = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setTask((prev) => ({ ...prev, [name as keyof CreateTaskData]: value }))
    }

    const handleSubbmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(task)

        setTask({
            title: "",
            criteria: "",
            task: "",
            category: ""
        })
    }

    const fieldInput = fields.map(({ name, placeholder }) => {
        return (
            <input key={name} name={name} value={task[name]} type="text" required placeholder={placeholder} onChange={handleValues} />
        )
    })
    return (
        <form className='form_block' onSubmit={handleSubbmit}>
            {fieldInput}
            <button>Save Changes</button>
        </form>
    )
}
