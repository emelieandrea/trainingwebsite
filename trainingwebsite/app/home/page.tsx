import { Button } from "@radix-ui/themes";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

type Props = {};

export default function Home({}: Props) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <div>
            <SidebarTrigger />
          </div>
          <div className="grid grid-flow-row justify-center gap-y-5 w-full">
            <Button size="4">Mina träningspass</Button>
            <Button size="4">Mina övningar</Button>
            <Button size="4">Skapa träningspass</Button>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
