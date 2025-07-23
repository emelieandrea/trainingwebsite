"use client";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import DeleteExercise from "../../components/deleteExercise";
import EditExercise from "../../components/editExercise";

type Exercises = {
  id: string;
  name: string;
  type: string;
  description: string;
};

type Props = {};

export default function Exercises({}: Props) {
  const { user, loading } = useAuth();
  const [exercises, setExercises] = useState<Exercises[]>([]);

  const fetchWorkout = async () => {
    try {
      const exerciseQuery = query(collection(db, "exerciseBank"));

      const allExercises: Exercises[] = [];
      const exercises = await getDocs(exerciseQuery);

      exercises.forEach((doc) => {
        allExercises.push({ id: doc.id, ...doc.data() } as Exercises);
      });

      setExercises(allExercises);
      console.log("Fetched workouts:", allExercises);
    } catch (error) {
      console.error("Error fetching workout:", error);
    }
  };

  useEffect(() => {
    if (!user || loading) return;
    fetchWorkout();
  }, [user, loading]);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <div className="ml-2 mt-2">
            <SidebarTrigger />
          </div>
          <div className="grid grid-flow-row justify-center gap-y-5 mt-10 w-full mb-10">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="w-7/8 border rounded-md flex justify-between items-center p-3 mx-8"
              >
                <div className="grid grid-row w-1/2">
                  <p className="text-l font-bold text-left">{exercise.name}</p>
                  <p className="text-sm text-left text-gray-400">
                    {exercise.type}
                  </p>
                  <p className="text-sm text-left">{exercise.description}</p>
                </div>
                <div className="grid grid-column w-3/7 justify-end gap-2">
                  <DeleteExercise
                    exerciseId={exercise.id}
                    onDelete={fetchWorkout}
                  />
                  <EditExercise
                    exerciseId={exercise.id}
                    name={exercise.name}
                    type={exercise.type}
                    description={exercise.description}
                    onEdit={fetchWorkout}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
