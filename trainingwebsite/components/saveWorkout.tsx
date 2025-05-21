"use client";

import { Flex, TextField } from "@radix-ui/themes";
import React, { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import { DatePicker } from "@heroui/date-picker";
import {
  today,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";

interface Props {
  workout: string;
}

const SaveWorkout: React.FC<Props> = ({ workout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const gymRef = useRef<HTMLInputElement>(null);

  // Use DateValue instead of Date for selectedDate
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(
    // Initialize with today's date using the proper function
    today(getLocalTimeZone())
  );

  // Save workout
  const saveWorkout = async () => {
    if (workout && selectedDate) {
      const workoutDocRef = doc(db, "workouts", workout);

      // Convert DateValue to native Date for storage
      const nativeDate = selectedDate.toDate(getLocalTimeZone());

      try {
        await updateDoc(workoutDocRef, {
          finished: true,
          date: nativeDate.toISOString(),
          name: nameRef.current?.value || "Unnamed Workout",
          gym: gymRef.current?.value || "Unnamed Gym",
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
    <div className="w-full px-4 sm:px-0 max-w-md mx-auto">
      <div className="bg-white p-5 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Spara träningspass</h2>
        <Flex direction="column" gap="4">
          <label>
            <span className="block mb-1 text-sm font-medium">
              Namn på träningspasset
            </span>
            <TextField.Root
              ref={nameRef}
              placeholder="Lägg till träningspassets namn"
              className="w-full"
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
              placeholder="Lägg till vilket gym du tränat på"
              className="w-full"
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
      </div>
    </div>
  );
};

export default SaveWorkout;
