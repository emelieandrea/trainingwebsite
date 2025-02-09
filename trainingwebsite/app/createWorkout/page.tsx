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
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import ExerciseCard from "../../components/exerciseCard";
import { useAuth } from "../../Context/AuthContext";

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

    const workoutsQuery = query(
      collection(db, "workouts"),
      where("owner", "==", user.uid),
      where("finished", "==", false)
    );

    const unsubscribe = onSnapshot(workoutsQuery, (snapshot) => {
      if (!snapshot.empty) {
        setWorkout(snapshot.docs[0].id);
      } else {
        console.log("No active workout found, creating new workout");
        addDoc(collection(db, "workouts"), {
          owner: user.uid,
          finished: false,
        }).then((newWorkoutDoc) => setWorkout(newWorkoutDoc.id));
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Get exercises for active workout
  useEffect(() => {
    if (!workout) return;

    const unsubscribe = onSnapshot(
      collection(db, "workouts", workout, "exercises"),
      (snapshot) => {
        const exercisesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExercises(exercisesData);
        console.log("Exercises updated:", exercisesData);
      }
    );
    return () => unsubscribe();
  }, [workout]);

  // Save workout
  const saveWorkout = async () => {
    if (workout) {
      const workoutDocRef = doc(db, "workouts", workout);
      await updateDoc(workoutDocRef, { finished: true });
      console.log("Workout updated successfully!");
      setWorkout("");
      router.push("/workouts");
    } else {
      console.error("Error updating workout:");
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
          <div className="grid grid-flow-row justify-center gap-y-5 mt-10 w-full">
            <p className="flex justify-center w-full text-xl font-bold">
              Skapa ett träningspass:
            </p>
            {workout && <AddExercise workout={workout} />}
            <div>
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  name={exercise.name}
                  sets={exercise.sets}
                  set={exercise.set}
                  leftright={exercise.leftright}
                  level={exercise.level}
                  sameSet={exercise.sameSet}
                />
              ))}
            </div>
            <Button
              onClick={saveWorkout}
              size="4"
              style={{ marginBottom: "70px" }}
            >
              Spara träningspass
            </Button>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
