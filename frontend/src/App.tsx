import { Routes, Route } from "react-router-dom";
import { Genre } from "./ui/features/genres/pages/genre/Genre";
import { Login } from "./ui/features/genres/pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Movie App</div>} />
      <Route path="/genres" element={<Genre />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
