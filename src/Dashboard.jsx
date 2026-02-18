import { useState, useEffect } from 'react'

function Dashboard() {
  const [exercises, setExercises] = useState([])
  // Render Live Url

  const API_URL = "https://cardioweb.onrender.com/exercises"; 

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setExercises(data))
  }, [])

  // New exercise 
  const handleAdd = () => {
    const newExercise = {
      title: "New Exercise", // title for new exercise

      currentWeight: 0
    };

    fetch(API_URL, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExercise)
    })
    .then(res => res.json())
    .then(data => setExercises([...exercises, data]));
  };

  const handleUpdate = (id, currentWeight) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentWeight: currentWeight + 5 })
    })
    .then(res => res.json())
    .then(updatedEx => setExercises(exercises.map(ex => ex.id === id ? updatedEx : ex)))
  }

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => setExercises(exercises.filter(ex => ex.id !== id)))
  }

  return (
    <div style={{ padding: '40px', width: '100%' }}>
      <h1>Workout Dashboard</h1>
      
      {/* Ekleme Butonu */}
      <button 
        onClick={handleAdd} 
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        + Yeni Egzersiz Ekle
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {exercises.map((ex) => (
          <div key={ex.id} style={{ border: '1px solid #444', padding: '20px', borderRadius: '12px', background: '#1a1a1a' }}>
            <h2>{ex.title}</h2>
            <p>Weight: <strong>{ex.currentWeight} kg</strong></p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
              <button onClick={() => handleUpdate(ex.id, ex.currentWeight)}>+5kg</button>
              <button onClick={() => handleDelete(ex.id)} style={{ color: '#ff4646' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard