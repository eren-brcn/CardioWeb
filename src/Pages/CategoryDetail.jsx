import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://cardio-backend-gfev.onrender.com";

function CategoryDetail() {

  const { categoryName } = useParams(); 
  const navigate = useNavigate();
  
  // // States to store the data 
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [catRes, exRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/exercises`)
        ]);

        // // Find the category in your db.json that matches the URL
        const foundCat = catRes.data.find(c => c.name === categoryName);
        setCategoryInfo(foundCat);

        // // Filter exercises
        const filteredEx = exRes.data.filter(ex => ex.category === categoryName);
        setExercises(filteredEx);
      } catch (error) {
        console.error("Error loading category details:", error);
      }
    };
    
    getData();
    
  }, [categoryName]);

  //Prevents the empty screen while the API coming
  if (!categoryInfo) return <div>Loading guide...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      
      <h1>{categoryInfo.name} Training</h1>
      
      <section>
        <h3>About this workout</h3>
        <p>{categoryInfo.description}</p>
        
        <h3>How to perform</h3>
        <p>{categoryInfo.howTo}</p>
        
        <p><strong>Benefit:</strong> {categoryInfo.benefit}</p>
      </section>

      <section>
        <h3>Recommended Exercises</h3>
        {exercises.length > 0 ? (
          exercises.map(ex => (
            <div key={ex.id}>
              <strong>{ex.title}</strong> — {ex.currentWeight}kg
            </div>
          ))
        ) : (
          <p>No exercises listed for this category yet.</p>
        )}
      </section>
    </div>
  );
}

export default CategoryDetail;