import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://cardio-backend-gfev.onrender.com";

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [exRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/exercises`),
        axios.get(`${API_URL}/categories`)
      ]);
      setExercises(exRes.data);
      setCategories(catRes.data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      {/* 1. Category Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat)}
            style={navBtnStyle}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 2. Instruction Panel */}
      {activeCategory ? (
        <div style={guideBoxStyle}>
          <h2 style={{ color: '#4CAF50' }}>{activeCategory.name} Training Guide</h2>
          <p><strong>The Goal:</strong> {activeCategory.description}</p>
          <p><strong>How to do it:</strong> {activeCategory.howTo}</p>
          <p style={{ fontStyle: 'italic', color: '#888' }}>Benefit: {activeCategory.benefit}</p>
          
          <h4 style={{ marginTop: '20px' }}>Recommended {activeCategory.name} Exercises:</h4>
          <ul>
            {exercises.filter(ex => ex.category === activeCategory.name).map(ex => (
              <li key={ex.id}>{ex.title} - (Weight/Intensity: {ex.currentWeight}kg)</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Click a category above to see instructions and exercises.</p>
      )}
    </div>
  );
}

const navBtnStyle = {
  padding: '10px 15px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
};

const guideBoxStyle = {
  backgroundColor: '#333',
  padding: '20px',
  borderRadius: '8px',
  marginTop: '20px',
  borderLeft: '4px solid #4CAF50'
};

export default ExerciseList;