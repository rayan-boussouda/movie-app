import { Routes, Route } from 'react-router-dom'
import { Genre } from './ui/features/genres/Genre'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Movie App</div>} />
      <Route path="/genres" element={<Genre />} />
    </Routes>
  )
}

export default App
