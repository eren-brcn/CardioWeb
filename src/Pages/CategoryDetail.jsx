import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://cardio-backend-1-lq31.onrender.com";

function CategoryDetail() {
  const { categoryName } = useParams(); 
  const navigate = useNavigate();
  
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const getDetailData = async () => {
      try {
        const [catRes, exRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/exercises`)
        ]);

        // Matches the name from the URL to the JSON data
        const foundCat = catRes.data.find(c => c.name === categoryName);
        setCategoryInfo(foundCat);

        // Filters list to show only exercises for this category
        const filteredEx = exRes.data.filter(ex => ex.category === categoryName);
        setExercises(filteredEx);
      } catch (error) {
        console.error("Error loading guide:", error);
      }
    };
    
    getDetailData();
  }, [categoryName]);

  if (!categoryInfo) return <div style={{color: 'white', padding: '20px'}}>Loading {categoryName} manual...</div>;

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '5px 15px', cursor: 'pointer' }}>
        ← Back to Categories
      </button>
      
      <h1 style={{ color: '#4CAF50', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
        {categoryInfo.name} Guide
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>📖 About this Training</h3>
          <p style={{ lineHeight: '1.6', opacity: 0.9 }}>{categoryInfo.description}</p>
        </div>

        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>⚙️ How to Perform</h3>
          <p style={{ lineHeight: '1.6', opacity: 0.9 }}>{categoryInfo.howTo}</p>
        </div>

        <div style={{ background: '#222', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #4CAF50' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>💡 Benefit:</h3>
          <p style={{ fontWeight: 'bold' }}>{categoryInfo.benefit}</p>
        </div>
      </div>

      <h2 style={{ marginTop: '40px' }}>Related Exercises in your List</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {exercises.map(ex => (
          <div key={ex.id} style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
            <strong>{ex.title}</strong> — Currently at {ex.currentWeight}kg
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryDetail;