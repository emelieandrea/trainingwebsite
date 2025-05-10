"use client";
import { Button } from "@radix-ui/themes";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import AddExercise from "../../components/addExercise";
import { AppSidebar } from "../../components/app-sidebar";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import ExerciseCard from "../../components/exerciseCard";
import { useAuth } from "../../Context/AuthContext";
import { Save } from "lucide-react";
import SaveWorkout from "../../components/saveWorkout";
import { Spinner } from "@heroui/react";

export default function CreateWorkout() {
  const [workout, setWorkout] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<
    { id: string; [key: string]: any }[]
  >([]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Get active workout or create new one
  useEffect(() => {
    if (!user || loading) return;

    const fetchWorkout = async () => {
      try {
        const workoutsQuery = query(
          collection(db, "workouts"),
          where("owner", "==", user.uid),
          where("finished", "==", false)
        );

        const activeWorkout = await getDocs(workoutsQuery);

        if (!activeWorkout.empty) {
          setWorkout(activeWorkout.docs[0].id);
        } else {
          console.log("No active workout found, creating new workout");

          const newWorkoutDoc = await addDoc(collection(db, "workouts"), {
            owner: user.uid,
            finished: false,
          });

          setWorkout(newWorkoutDoc.id);
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
      }
    };

    fetchWorkout();
  }, [user, loading]);

  // Get exercises for active workout
  useEffect(() => {
    if (!workout) return;

    console.log("Setting up exercises listener for workout:", workout);

    const unsubscribe = onSnapshot(
      collection(db, "workouts", workout, "exercises"),
      (snapshot) => {
        const exercisesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Received updated exercises:", exercisesData.length);
        setExercises(exercisesData);
      }
    );
    return () => unsubscribe();
  }, [workout]); // Only re-run when workout changes

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <div className="ml-2 mt-2">
            <SidebarTrigger />
          </div>
          <div className="grid grid-flow-row justify-center gap-y-5 mt-10 w-full">
            <p className="flex justify-center w-full text-xl font-bold">
              Skapa ett träningspass:
            </p>
            {!workout && <Spinner className="flex justify-center w-full" />}
            {workout && <AddExercise workout={workout} />}
            <div>
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  id={exercise.id}
                  name={exercise.name}
                  sets={exercise.sets}
                  set={exercise.set}
                  leftright={exercise.leftright}
                  level={exercise.level}
                  sameSet={exercise.sameSet}
                  workout={workout}
                  active={true}
                />
              ))}
            </div>
            <SaveWorkout workout={workout} />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
