import { Button } from "@radix-ui/themes";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

type Props = {};

export default function Exercises({}: Props) {
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
            <Button size="4">Mina träningspass</Button>
            <Button size="4">Mina övningar</Button>
            <Button size="4">Skapa träningspass</Button>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
