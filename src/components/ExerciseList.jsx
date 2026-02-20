import { useState, useEffect } from "react";
import axios from "axios";
import AddExercise from "./AddExercise";

const API_URL = "https://cardio-backend-gfev.onrender.com";

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/exercises`);
      setExercises(res.data);
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };

  // // UPDATE: This function changes the weight in the database
  const updateWeight = async (exercise, amount) => {
    const updatedExercise = { 
      ...exercise, 
      currentWeight: exercise.currentWeight + amount 
    };

    try {
      // PUT updates an existing item in your Render backend
      await axios.put(`${API_URL}/exercises/${exercise.id}`, updatedExercise);
      fetchData(); // Refresh the list to show the new weight
    } catch (err) {
      console.error("Error updating weight:", err);
    }
  };

  const deleteExercise = async (id) => {
    if (window.confirm("Delete this workout?")) {
      try {
        await axios.delete(`${API_URL}/exercises/${id}`);
        fetchData();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExercises = exercises.filter((ex) =>
    ex.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <AddExercise onExerciseAdded={fetchData} />

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '5px',
            border: '1px solid #4CAF50',
            background: '#222',
            color: 'white'
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredExercises.map((ex) => (
          <div key={ex.id} style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid #333',
            position: 'relative'
          }}>
            <button 
              onClick={() => deleteExercise(ex.id)}
              style={{
                position: 'absolute', top: '10px', right: '10px',
                background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px'
              }}
            >
              X
            </button>

            <h3 style={{ color: '#4CAF50', marginTop: 0 }}>{ex.title}</h3>
            <p style={{ margin: '5px 0', opacity: 0.7 }}>{ex.category}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <button 
                onClick={() => updateWeight(ex, -2.5)}
                style={{ padding: '5px 10px', cursor: 'pointer' }}
              >
                -
              </button>
              
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {ex.currentWeight} kg
              </span>

              <button 
                onClick={() => updateWeight(ex, 2.5)}
                style={{ padding: '5px 10px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseList;