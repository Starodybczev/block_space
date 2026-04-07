import { lazy } from 'react'

const AppEditor = lazy(() => import("./components/AppEditor"))

export default function App() {
  return (
    <div>
      <AppEditor/>
    </div>
  )
}
