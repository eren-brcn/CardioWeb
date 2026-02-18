// Import the ExerciseList component
import ExerciseList from '../components/ExerciseList.jsx';

// Dashboard page - main area with exercise list
function Dashboard() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Workout Dashboard</h1>
      <ExerciseList />
    </div>
  );
}

export default Dashboard;