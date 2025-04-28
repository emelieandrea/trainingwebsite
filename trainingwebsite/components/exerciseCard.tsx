import React from "react";
import { Box } from "@radix-ui/themes/components/box";
import { Text } from "@radix-ui/themes/components/index";

interface Props {
  name: string;
  set: { repetitions: number; weight: number }[];
  leftright: boolean;
  level: string | number; // Updated to accept either string or number
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
    <Box className="p-3 border rounded-md">
      <Text as="p" weight="bold">
        {name}
      </Text>
      {/* Exercise Sets */}
      <div className="mt-2">
        {set?.map((set, idx) => (
          <div key={idx} className="flex gap-4 text-sm">
            <Text as="p">
              Set {idx + 1}: {set.repetitions} reps med {set.weight} kg{" "}
              {leftright ? "på varje sida" : ""}
            </Text>
          </div>
        ))}
      </div>
      <Text as="p">
        Nivå:{" "}
        {Number(level) === 1
          ? "Lääätt 🧘"
          : Number(level) === 2
          ? "Stark 🏋"
          : "Tungt.. 🥵"}
      </Text>
    </Box>
  );
};

export default ExerciseCard;
