"use client";

import { Flex, TextField } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import { DatePicker } from "@heroui/date-picker";
import {
  today,
  getLocalTimeZone,
  type DateValue,
  parseDate,
} from "@internationalized/date";

interface Props {
  workout: string;
}

interface WorkoutData {
  name?: string;
  date?: string;
  gym?: string;
  finished?: boolean;
}

const SaveWorkout: React.FC<Props> = ({ workout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const gymRef = useRef<HTMLInputElement>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({});
  const [workoutName, setWorkoutName] = useState("");
  const [gymName, setGymName] = useState("");

  // Use DateValue instead of Date for selectedDate
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(
    // Initialize with today's date using the proper function
    today(getLocalTimeZone())
  );

  // Fetch workout data when component mounts
  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (!workout) return;

      try {
        const workoutDocRef = doc(db, "workouts", workout);
        const workoutSnapshot = await getDoc(workoutDocRef);

        if (workoutSnapshot.exists()) {
          const data = workoutSnapshot.data() as WorkoutData;
          setWorkoutData(data);

          // Set form values if data exists
          if (data.name) setWorkoutName(data.name);
          if (data.gym) setGymName(data.gym);

          // Parse date if it exists
          if (data.date) {
            try {
              // Create a Date object from the ISO string
              const date = new Date(data.date);
              
              // Get the local date components to avoid timezone issues
              const year = date.getFullYear();
              const month = date.getMonth() + 1; // getMonth() is 0-indexed
              const day = date.getDate();
              
              // Format properly for parseDate (YYYY-MM-DD)
              const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              console.log("Parsing date string:", dateStr);
              
              const parsedDate = parseDate(dateStr);
              setSelectedDate(parsedDate);
            } catch (error) {
              console.error("Error parsing date:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };

    fetchWorkoutData();
  }, [workout]);

  // Save workout
  const saveWorkout = async () => {
    if (workout && selectedDate) {
      const workoutDocRef = doc(db, "workouts", workout);

      // Convert DateValue to native Date for storage
      const nativeDate = selectedDate.toDate(getLocalTimeZone());
      
      // Ensure we're saving the date properly with the timezone taken into account
      // We'll set the time to noon to avoid timezone day shifts
      const year = nativeDate.getFullYear();
      const month = nativeDate.getMonth(); // JavaScript's Date month is 0-indexed
      const day = nativeDate.getDate();
      
      // Create a new date with noon time to avoid timezone issues
      const fixedDate = new Date(year, month, day, 12, 0, 0);
      
      try {
        await updateDoc(workoutDocRef, {
          finished: true,
          date: fixedDate.toISOString(),
          name: workoutName || "Unnamed Workout",
          gym: gymName || "Unnamed Gym",
        });
        router.push("/workouts");
      } catch (error) {
        console.error("Error updating workout:", error);
        setErrorMessage("Failed to save the workout. Please try again.");
      }
    } else {
      console.error("Error updating workout: Missing workout ID or date");
      setErrorMessage("Please provide all required information.");
    }
  };

  // Update handleDateChange to work with DateValue
  const handleDateChange = (date: DateValue | null) => {
    console.log("Date changed to:", date);
    setSelectedDate(date);
  };

  return (
    <div className="w-full px-0">
      <div className="bg-white p-5">
        <h2 className="text-lg font-semibold mb-4">Spara träningspass</h2>
        <Flex direction="column" gap="4">
          <label>
            <span className="block mb-1 text-sm font-medium">
              Namn på träningspasset
            </span>
            <TextField.Root
              ref={nameRef}
              placeholder="Träningspassets namn"
              className="w-full"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </label>
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <span className="block mb-1 text-sm font-medium">Datum</span>
            <DatePicker
              isRequired
              className="w-full touch-manipulation"
              value={selectedDate}
              onChange={handleDateChange}
              isReadOnly={false}
              granularity="day"
            />
          </div>
          <label>
            <span className="block mb-1 text-sm font-medium">
              Namn på gymmet
            </span>
            <TextField.Root
              ref={gymRef}
              placeholder="Gymmets namn"
              className="w-full"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
            />
          </label>
        </Flex>
        {errorMessage && (
          <p className="text-red-500 mt-3 text-sm">{errorMessage}</p>
        )}
        <Flex gap="3" mt="5" justify="center">
          <Button
            size="4"
            onClick={saveWorkout}
            className="w-full py-3 touch-manipulation"
          >
            Spara träningspass
          </Button>
        </Flex>
        <p className="justify-center text-red-600 text-sm mt-1">
          Detta kommer att spara och avsluta träningspasset.
        </p>
      </div>
    </div>
  );
};

export default SaveWorkout;
