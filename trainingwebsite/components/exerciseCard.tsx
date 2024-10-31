import { Box, Card } from "@radix-ui/themes";
import React from "react";

interface Props {
  name: string;
  set: [{ reps: number; weight: number }];
  leftright: boolean;
  level: number;
  sameSet: boolean;
  sets: number;
}

const ExerciseCard: React.FC<Props> = ({
  name,
  set,
  leftright,
  level,
  sameSet,
  sets,
}) => {
  return (
    <Box maxWidth="420px">
      <Card asChild>
        <div>
          <h3>{name}</h3>
          {/* Display additional exercise details here */}
          <p>Sets: {sets}</p>
          <p>Level: {level}</p>
          {/* You might want to format and display the `set` array */}
          {set.map((s, index) => (
            <p key={index}>
              Set {index + 1}: {s.reps} reps at {s.weight} kg
            </p>
          ))}
          <p>Left/Right: {leftright ? "Yes" : "No"}</p>
          <p>Same Set: {sameSet ? "Yes" : "No"}</p>
        </div>
      </Card>
    </Box>
  );
};

export default ExerciseCard;
