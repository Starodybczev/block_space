import { createRoot } from 'react-dom/client'
import "./styles/index.css"
import App from './App.tsx'
import { AssetsProvider } from './contex/AssetsContext.tsx'


createRoot(document.getElementById('root')!).render(
    <AssetsProvider>
        <App/>
    </AssetsProvider>
)
