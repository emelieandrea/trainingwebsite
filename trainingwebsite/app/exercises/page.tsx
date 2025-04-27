"use client";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";
import { use, useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

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

  useEffect(() => {
    if (!user || loading) return;

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
          <div className="grid grid-flow-row justify-center gap-y-5 mt-10 w-full">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                  <Image
                    alt="heroui logo"
                    height={40}
                    radius="sm"
                    src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-md">{exercise.name}</p>
                    <p className="text-small text-default-500">
                      {exercise.type}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>{exercise.description}</p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <p className="text-small text-default-500">
                    Senast du gjorde denna övningar var....
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
