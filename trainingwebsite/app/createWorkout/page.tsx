"use client";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import AddExercise from "../../components/addExercise";
import { AppSidebar } from "../../components/app-sidebar";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import ExerciseCard from "../../components/exerciseCard";
import { useAuth } from "../../Context/AuthContext";
import SaveWorkout from "../../components/saveWorkout";
import { Spinner } from "@heroui/react";
import { useIsMobile } from "../../hooks/use-mobile";

export default function CreateWorkout() {
  const isMobile = useIsMobile();
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
          <div>
            {isMobile ? (
              <div>
                <div className="grid grid-flow-row justify-center gap-y-6 mt-6 w-full px-0 max-w-none">
                  <h1 className="flex justify-center w-full text-xl md:text-2xl font-bold">
                    Skapa ett träningspass
                  </h1>
                  {!workout && (
                    <Spinner className="flex justify-center w-full" />
                  )}
                  {workout && <AddExercise workout={workout} />}

                  {exercises.length > 0 && (
                    <div className="mt-3 mb-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Tillagda övningar
                      </h2>
                      <div className="space-y-4">
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
                    </div>
                  )}

                  <div className="mb-20">
                    <SaveWorkout workout={workout} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-flow-row justify-center gap-y-6 mt-6 w-full px-4 md:px-0 max-w-screen-xl mx-auto">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h1 className="flex justify-center w-full text-xl md:text-2xl font-bold mb-3">
                      Skapa ett träningspass
                    </h1>
                    {!workout && (
                      <Spinner className="flex justify-center w-full" />
                    )}
                    {workout && <AddExercise workout={workout} />}
                  </div>
                  <div>
                    {exercises.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">
                          Tillagda övningar
                        </h2>
                        <div className="space-y-2">
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
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-20">
                  <SaveWorkout workout={workout} />
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
