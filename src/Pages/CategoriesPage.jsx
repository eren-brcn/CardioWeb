import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "https://cardio-backend-gfev.onrender.com";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // // Fetching the categories backend  
    axios.get(`${API_URL}/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div>
      <h1>Training Guides</h1>
      
      <div>
        {categories.map((cat) => (
         
          <div key={cat.id}>
            <Link to={`/categories/${cat.name}`}>
              <h3>{cat.name}</h3>
              <p>View {cat.name} Training Guide</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;