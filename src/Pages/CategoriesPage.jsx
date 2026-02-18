import { useState, useEffect } from 'react';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const CAT_URL = "https://cardioweb.onrender.com/categories";

  useEffect(() => {
    fetch(CAT_URL)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Exercise Categories</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ padding: '30px', background: '#222', borderRadius: '15px', border: '1px solid #4CAF50', textAlign: 'center', minWidth: '150px' }}>
            <h2 style={{ color: '#4CAF50' }}>{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;