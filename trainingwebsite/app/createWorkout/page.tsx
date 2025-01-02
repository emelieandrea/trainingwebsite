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
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { DocumentReference, DocumentData } from "firebase/firestore";
import ExerciseCard from "../../components/exerciseCard";

export default function CreateWorkout() {
  const [workout, setWorkout] = useState("");
  const [userRef, setUserRef] =
    useState<DocumentReference<DocumentData> | null>(null);
  const [userReady, setUserReady] = useState(false);
  const auth = getAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<
    { id: string; [key: string]: any }[]
  >([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userQuery = query(
          collection(db, "users"),
          where("id", "==", user.uid)
        );
        const queryUserSnapshot = await getDocs(userQuery);

        if (!queryUserSnapshot.empty) {
          const userDoc = queryUserSnapshot.docs[0];
          setUserRef(userDoc.ref);
          setUserReady(true);
        } else {
          router.push("/");
        }
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (userRef) {
        const workoutsQuery = query(
          collection(db, "workouts"),
          where("owner", "==", userRef),
          where("finished", "==", false)
        );

        const querySnapshot = await getDocs(workoutsQuery);

        if (!querySnapshot.empty) {
          const workoutDoc = querySnapshot.docs[0];
          const workoutId = workoutDoc.id;
          setWorkout(workoutId);
          console.log("fetching exercises");
          console.log("workout: ", workoutId);
          await fetchExercises(workoutId);
        } else {
          console.log("No active workout found, creating new workout");
          const newWorkoutDoc = await addDoc(collection(db, "workouts"), {
            owner: userRef,
            finished: false,
          });
          setWorkout(newWorkoutDoc.id);
        }
      }
    };

    if (userReady) {
      fetchWorkouts();
    }
  }, [userRef, userReady]);

  const fetchExercises = async (workoutId: string) => {
    const exercisesQuery = query(
      collection(doc(db, "workouts", workoutId), "exercises")
    );

    const querySnapshot = await getDocs(exercisesQuery);
    const exercisesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setExercises(exercisesData);
  };

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
            <Button onClick={saveWorkout} size="4">
              Spara träningspass
            </Button>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
