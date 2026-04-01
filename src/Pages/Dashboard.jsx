import { useState } from 'react';
import ExerciseList from '../components/ExerciseList.jsx';
import WgerExerciseFeed from '../components/WgerExerciseFeed.jsx';
import UserProgramCenter from '../components/UserProgramCenter.jsx';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const [importedExercise, setImportedExercise] = useState(null);
  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            {t("dashboard.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("dashboard.subtitle")}
          </Typography>
        </CardContent>
      </Card>

      <ExerciseList importedExercise={importedExercise} />
      <UserProgramCenter />
      <WgerExerciseFeed onImportExercise={setImportedExercise} />
    </Stack>
  );
}

export default Dashboard;