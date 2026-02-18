import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [exercises, setExercises] = useState([])

  // 1. READ: Fetch all exercises from the backend
  useEffect(() => {
    fetch("http://localhost:5005/exercises")
      .then(res => res.json())
      .then(data => setExercises(data))
      .catch(err => console.error("Error fetching:", err))
  }, [])

  // 2. CREATE: Add a new exercise to the list
  const handleAddExercise = (e) => {
    e.preventDefault();
    const newEx = {
      title: e.target.title.value,
      currentWeight: parseInt(e.target.weight.value) || 0,
      targetWeight: parseInt(e.target.target.value) || 0,
      categoryId: "1", // Default category
      isCompleted: false
    };

    fetch("http://localhost:5005/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEx)
    })
    .then(res => res.json())
    .then(data => {
      setExercises([...exercises, data]);
      e.target.reset(); // Clear the form
    });
  };

  // 3. UPDATE: Increase weight by 5kg
  const handleUpdate = (id, currentWeight) => {
    fetch("http://localhost:5005/exercises/" + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentWeight: currentWeight + 5 })
    })
    .then(res => res.json())
    .then(updatedEx => {
      setExercises(exercises.map(ex => ex.id === id ? updatedEx : ex))
    })
  }

  // 4. DELETE: Remove an exercise
  const handleDelete = (id) => {
    fetch("http://localhost:5005/exercises/" + id, { method: 'DELETE' })
      .then(() => {
        setExercises(exercises.filter(ex => ex.id !== id))
      })
  }

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>💪 CardioWeb Dashboard</h1>

      {/* CREATE FORM */}
      <section style={{ marginBottom: '40px', background: '#242424', padding: '20px', borderRadius: '10px' }}>
        <h3>Add New Workout</h3>
        <form onSubmit={handleAddExercise} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input name="title" placeholder="Exercise Name (e.g. Squats)" required style={{ padding: '8px' }} />
          <input name="weight" type="number" placeholder="Current Weight (kg)" required style={{ padding: '8px', width: '150px' }} />
          <input name="target" type="number" placeholder="Target Weight (kg)" required style={{ padding: '8px', width: '150px' }} />
          <button type="submit" style={{ backgroundColor: '#646cff' }}>Add Exercise</button>
        </form>
      </section>

      {/* EXERCISE LIST */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {exercises.length > 0 ? (
          exercises.map((ex) => (
            <div key={ex.id} style={{ border: '1px solid #444', padding: '20px', borderRadius: '12px', width: '250px', background: '#1a1a1a', textAlign: 'left' }}>
              <h2 style={{ marginTop: 0 }}>{ex.title}</h2>
              <p>Current: <strong style={{ color: '#646cff' }}>{ex.currentWeight} kg</strong></p>
              <p>Target: {ex.targetWeight} kg</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={() => handleUpdate(ex.id, ex.currentWeight)}>+5kg</button>
                <button onClick={() => handleDelete(ex.id)} style={{ backgroundColor: '#ff4646' }}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No exercises found. Use the form above to add your first workout!</p>
        )}
      </div>
    </div>
  )
}

export default App