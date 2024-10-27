import { Button } from "@radix-ui/themes";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import AddExercise from "../../components/addExercise";
import { AppSidebar } from "../../components/app-sidebar";

type Props = {};

export default function CreateWorkout({}: Props) {
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
            <AddExercise />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
