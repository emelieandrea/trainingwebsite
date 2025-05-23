"use client";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { Box } from "@radix-ui/themes/components/box";
import { Card } from "@radix-ui/themes/components/card";
import {
  Flex,
  RadioCards,
  Text,
  Heading,
} from "@radix-ui/themes/components/index";
import { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../Context/AuthContext";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import ExerciseCard from "../../components/exerciseCard";
import { Button } from "@heroui/react";
import DeleteWorkout from "../../components/deleteWorkout";

type Workout = {
  id: string;
  date?: string;
  name?: string;
  finished: boolean;
  gym?: string;
  [key: string]: any;
};

type Exercise = {
  id: string;
  name: string;
  sets: number;
  sameSet: boolean;
  leftright: boolean;
  level: string;
  set: { repetitions: number; weight: number }[];
};

type Props = {};

export default function Workouts({}: Props) {
  const { user, loading } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [workoutDetails, setWorkoutDetails] = useState<{
    workout: Workout | null;
    exercises: Exercise[];
  }>({
    workout: null,
    exercises: [],
  });
  const router = useRouter();

  const fetchWorkout = useCallback(async () => {
    try {
      const workoutsQuery = query(
        collection(db, "workouts"),
        where("owner", "==", user?.uid)
      );

      const myWorkouts: Workout[] = [];
      const allWorkouts = await getDocs(workoutsQuery);

      allWorkouts.forEach((doc) => {
        myWorkouts.push({ id: doc.id, ...doc.data() } as Workout);
      });

      // Sort workouts by date, newest first
      const sortedWorkouts = myWorkouts.sort((a, b) => {
        // Handle missing dates by treating them as oldest
        if (!a.date) return 1;
        if (!b.date) return -1;
        // Compare dates in descending order (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setWorkouts(sortedWorkouts);
      console.log("Fetched workouts:", sortedWorkouts);
    } catch (error) {
      console.error("Error fetching workout:", error);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user || loading) return;

    fetchWorkout();
  }, [user, loading, fetchWorkout]);

  const handleWorkoutSelect = async (workoutId: string) => {
    setSelectedWorkout(workoutId);

    // Fetch the details of the selected workout
    try {
      // Get workout document
      const workoutRef = doc(db, "workouts", workoutId);
      const workoutSnap = await getDoc(workoutRef);

      if (!workoutSnap.exists()) {
        console.error("No workout found with ID:", workoutId);
        return;
      }

      const workoutData = {
        id: workoutSnap.id,
        ...workoutSnap.data(),
      } as Workout;

      // Get exercises for this workout
      const exercisesQuery = collection(workoutRef, "exercises");
      const exercisesSnap = await getDocs(exercisesQuery);

      const exercises: Exercise[] = [];
      exercisesSnap.forEach((doc) => {
        exercises.push({ id: doc.id, ...doc.data() } as Exercise);
      });

      setWorkoutDetails({
        workout: workoutData,
        exercises: exercises,
      });

      console.log("Selected workout details:", workoutData);
      console.log("Workout exercises:", exercises);
    } catch (error) {
      console.error("Error fetching workout details:", error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Inget datum";

    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      return "Ogiltigt datum";
    }
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <div className="ml-2 mt-2">
            <SidebarTrigger />
          </div>

          <div className="p-4 max-w-screen-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mina träningspass</h1>

            <div className="flex flex-col md:flex-row gap-4 max-w-full">
              {/* Left Column - Workout List */}
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <Box maxWidth="100%" className="sticky top-4">
                  {workouts.length > 0 ? (
                    <RadioCards.Root
                      value={selectedWorkout || undefined}
                      onValueChange={handleWorkoutSelect}
                      className="[&_[role=radio]]:py-2 [&_[role=radio]]:min-h-0 touch-manipulation"
                    >
                      {workouts.map((workout) => (
                        <RadioCards.Item
                          key={workout.id}
                          value={workout.id}
                          className="py-2 mb-2 touch-action-manipulation"
                        >
                          <Flex direction="column" width="100%" className="p-1">
                            <p className="font-bold text-base">
                              {workout.name || "Inget namn"}
                            </p>
                            <div className="flex justify-between text-sm mt-1">
                              <p>{formatDate(workout.date)}</p>
                              <p>
                                {workout.finished ? "Avslutad" : "Pågående"}
                              </p>
                            </div>
                          </Flex>
                        </RadioCards.Item>
                      ))}
                    </RadioCards.Root>
                  ) : (
                    <p className="text-center p-6 text-base">
                      Hittar inga träningspass. Skapa ditt första träningspass!
                    </p>
                  )}
                </Box>
              </div>

              {/* Right Column - Workout Details */}
              <div className="w-full md:w-1/2 mt-0 md:mt-0 order-1 md:order-2 mb-6 md:mb-0">
                {selectedWorkout && workoutDetails.workout ? (
                  <Card className="p-4 shadow-sm rounded-lg">
                    <Heading size="6" className="mb-3">
                      {workoutDetails.workout.name || "Unnamed Workout"}
                    </Heading>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                      <DeleteWorkout
                        workoutId={workoutDetails.workout.id}
                        onDelete={() => {
                          fetchWorkout();
                          setSelectedWorkout(null);
                        }}
                      />
                    </div>
                    <Text as="p" className="mb-3 text-base">
                      Gym: {workoutDetails.workout.gym || "Inget gym angivet"}
                    </Text>
                    <Heading size="5" className="mb-4">
                      Övningar
                    </Heading>
                    {workoutDetails.exercises.length > 0 ? (
                      <div className="space-y-5">
                        {workoutDetails.exercises.map((exercise) => (
                          <ExerciseCard
                            key={exercise.id}
                            id={exercise.id}
                            name={exercise.name}
                            sets={exercise.sets}
                            set={exercise.set}
                            leftright={exercise.leftright}
                            level={exercise.level}
                            sameSet={exercise.sameSet}
                            workout={workoutDetails.workout?.id || ""}
                            active={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <Text as="p" className="p-4 text-center">
                        Inga övningar hittade för detta träningspass.
                      </Text>
                    )}
                  </Card>
                ) : (
                  <div className="h-full flex items-center justify-center border border-dashed rounded-md p-8 bg-gray-50">
                    <Text as="p" color="gray" className="text-center text-base">
                      Välj ett träningspass för att se detaljer.
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
