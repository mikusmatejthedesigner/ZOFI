import './flag'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router'
import '@fontsource-variable/inter'
import '../styles/base.css'
import '../styles/magicui.css'
import AppRoutes from '../app/AppRoutes'
import { playerDemo } from '../app/hooks'
import { Bridge } from './Bridge'
import './demo.css'

/* Ukázka aplikace pro web: skutečná aplikace v paměťovém routeru,
   kterou řídí scénář (director.ts). Web ji vkládá do <iframe>. */
playerDemo.on = true
const params = new URLSearchParams(location.search)
const start = params.get('start') ?? '/app/videa'

createRoot(document.getElementById('root')!).render(
  <MemoryRouter initialEntries={[start]}>
    <Routes>
      <Route path="/app/*" element={<AppRoutes />} />
    </Routes>
    <Bridge touch={params.get('touch') === '1'} />
  </MemoryRouter>,
)
