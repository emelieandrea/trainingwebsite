import { Box, Card } from "@radix-ui/themes";
import React from "react";

interface Props {
  name: string;
  set: [{ repetitions: number; weight: number }];
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
    <Box maxWidth="420px" className="my-2">
      <Card asChild>
        <div>
          <h3>{name}</h3>
          {set.map((s, index) => (
            <p key={index}>
              Set {index + 1}: {s.repetitions} repetitioner med {s.weight} kg
            </p>
          ))}
          <p>{leftright ? "Uppdelat i höger och vänster" : ""}</p>
          <p>
            {level == 1
              ? "Borde ta tyngre nästa gång"
              : level == 2
              ? "Detta var en bra nivå"
              : "Lite gränsfall till för tungt"}
          </p>
        </div>
      </Card>
    </Box>
  );
};

export default ExerciseCard;
