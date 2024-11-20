import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cosmograph from './Cosmograph.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Cosmograph />
    </StrictMode>,
)
