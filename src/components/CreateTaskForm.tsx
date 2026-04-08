import { useState } from 'react'

type Props = {
    onSubmit: (data: {
        title: string;
        task: string;
        criteria: string;
        category: string;
    }) => void;
};

export default function CreateTaskForm({ onSubmit }: Props) {
    const [taskName, setTaskName] = useState<string>("")
    const [newCriteria, setNewCriteria] = useState<string>("")
    const [newTask, setNewTask] = useState<string>("")
    const [newCategory, setNewCategory] = useState<string>("")
    return (
        <form className='form_block' onSubmit={(e) => {
            e.preventDefault();
            e.currentTarget.reset()
            onSubmit({ title: taskName, task: newTask, criteria: newCriteria, category: newCategory });
        }}>
            <input
                type='text'
                placeholder='New task name'
                required
                onChange={(e) => setTaskName(e.target.value)}
            />
            <input
                type='text'
                required
                placeholder='New category'
                onChange={(e) => setNewCriteria(e.target.value)}
            />
            <input
                required type='text' placeholder='new task' onChange={(e) => setNewTask(e.target.value)} />
            <input type='text'
                required placeholder='new category' onChange={(e) => setNewCategory(e.target.value)} />
            <button>Save Changes</button>
        </form>
    )
}
