import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "https://cardio-backend-1-lq31.onrender.com";

function CategoryDetail() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetailData = async () => {
      try {
        setLoading(true);
        const [catRes, exRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/exercises`)
        ]);

        // Matches the name from the URL to the JSON data
        const foundCat = catRes.data.find((c) => c.name === categoryName);
        setCategoryInfo(foundCat);

        // Filters list to show only exercises for this category
        const filteredEx = exRes.data.filter((ex) => ex.category === categoryName);
        setExercises(filteredEx);
      } catch (error) {
        console.error("Error loading guide:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetailData();
  }, [categoryName]);

  if (loading) {
    return <div className="category-detail-container">Loading {categoryName} guide...</div>;
  }

  if (!categoryInfo) {
    return (
      <div className="category-detail-container">
        <h1>Category not found</h1>
        <Link to="/categories" className="back-link">Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="category-detail-container">
      <button onClick={() => navigate(-1)} className="back-link">
        ← Back to Categories
      </button>

      <h1 className="category-title">
        {categoryInfo.name} Guide
      </h1>

      <div className="info-section">
        <div className="info-box">
          <h3>📖 About this Training</h3>
          <p>{categoryInfo.description || "No description available yet."}</p>
        </div>

        <div className="info-box">
          <h3>⚙️ How to Perform</h3>
          <p>{categoryInfo.howTo || "Instructions coming soon."}</p>
        </div>

        <div className="info-box">
          <h3>💡 Benefit</h3>
          <p>{categoryInfo.benefit || "Benefits will be updated shortly."}</p>
        </div>
      </div>

      <div className="related-exercises">
        <h2>Related Exercises in your List</h2>
        {exercises.length > 0 ? (
          exercises.map((ex) => (
            <div key={ex.id} className="exercise-card">
              <p>{ex.title} — <span>Currently at {ex.currentWeight}kg</span></p>
            </div>
          ))
        ) : (
          <p style={{ color: '#888' }}>No exercises added for this category yet.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryDetail;