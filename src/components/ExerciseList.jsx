import { useState, useEffect } from 'react';

const API_URL = "https://cardioweb.onrender.com/exercises";

function ExerciseList() {
  // State to store the exercises
  const [exercises, setExercises] = useState([]);

  // Fetch exercises on component mount
  useEffect(() => { 
    fetch(API_URL) 
      .then(res => res.json())
      .then(data => setExercises(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // Add a new exercise
  const handleAdd = () => {  
    const newExercise = { title: "New Exercise", currentWeight: 0 }; 
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExercise)
    })
    .then(res => res.json()) 
    .then(data => setExercises([...exercises, data]));
  };

  // Update exercise weight
  const handleUpdate = (id, currentWeight) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentWeight: currentWeight + 5 })
    })
    .then(res => res.json())
    .then(updated => setExercises(exercises.map(ex => ex.id === id ? updated : ex)));
  };

  // Delete an exercise
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' }) 
    .then(() => setExercises(exercises.filter(ex => ex.id !== id)));
  };

  return (
    <div>
      <button onClick={handleAdd} style={btnStyle}>+ Add New Exercise</button>
      
      <div style={gridStyle}>
        {exercises.map(ex => (
          <div key={ex.id} style={cardStyle}>
            <h2>{ex.title}</h2>
            <p>Weight: <strong>{ex.currentWeight} kg</strong></p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => handleUpdate(ex.id, ex.currentWeight)}>+5kg</button>
              <button onClick={() => handleDelete(ex.id)} style={{ color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styling
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' };
const cardStyle = { border: '1px solid #444', padding: '20px', borderRadius: '12px', background: '#1a1a1a' };
const btnStyle = { marginBottom: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '8px', cursor: 'pointer' };

export default ExerciseList;