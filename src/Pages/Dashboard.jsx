import { useState } from 'react';
import ExerciseList from '../components/ExerciseList.jsx';
import WgerExerciseFeed from '../components/WgerExerciseFeed.jsx';
import { Card, CardContent, Stack, Typography } from '@mui/material';

function Dashboard() {
  const [importedExercise, setImportedExercise] = useState(null);

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            Train Smarter, Not Just Harder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Log every set, monitor progress, and keep each workout aligned with your category goals.
          </Typography>
        </CardContent>
      </Card>

      <ExerciseList importedExercise={importedExercise} />
      <WgerExerciseFeed onImportExercise={setImportedExercise} />
    </Stack>
  );
}

export default Dashboard;