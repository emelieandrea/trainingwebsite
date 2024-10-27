import { Button, Link } from "@radix-ui/themes";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

type Props = {};

export default function Home({}: Props) {
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
              Kul med träning!
            </p>
            <Link href={"/workouts"}>
              <Button size="4" style={{ minWidth: "250px" }}>
                Mina träningspass
              </Button>
            </Link>
            <Link href={"/exercises"}>
              <Button size="4" style={{ minWidth: "250px" }}>
                Mina övningar
              </Button>
            </Link>
            <Link href={"/createWorkout"}>
              <Button size="4" style={{ minWidth: "250px" }}>
                Skapa träningspass
              </Button>
            </Link>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
