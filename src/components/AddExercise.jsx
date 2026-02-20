import { useState } from "react";
import axios from "axios";

const API_URL = "https://cardio-backend-gfev.onrender.com";

function AddExercise({ onExerciseAdded }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Chest");
  const [weight, setWeight] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExercise = {
      title,
      category,
      currentWeight: Number(weight),
      // Generates a unique string ID for the database
      id: Date.now().toString() 
    };

    try {
      // POST sends the new data to your Render backend
      await axios.post(`${API_URL}/exercises`, newExercise);
      
      // Reset form fields
      setTitle("");
      setWeight("");
      
      // Trigger the refresh in the parent component
      onExerciseAdded(); 
    } catch (err) {
      console.error("Error adding exercise:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      background: '#222', 
      padding: '20px', 
      borderRadius: '8px', 
      marginBottom: '30px' 
    }}>
      <h3 style={{ marginTop: 0 }}>Add New Workout</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          placeholder="Exercise Name" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
        />
        <input 
          placeholder="Weight (kg)" 
          type="number"
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
          required 
          style={{ padding: '8px', borderRadius: '4px', border: 'none', width: '100px' }}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px' }}
        >
          <option value="Chest">Chest</option>
          <option value="Back">Back</option>
          <option value="Legs">Legs</option>
          <option value="Cardio">Cardio</option>
          <option value="Yoga">Yoga</option>
        </select>
        <button type="submit" style={{ 
          padding: '8px 16px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add Exercise
        </button>
      </div>
    </form>
  );
}

export default AddExercise;