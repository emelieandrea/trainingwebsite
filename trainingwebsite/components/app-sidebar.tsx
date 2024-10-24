"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import app from "../firebase";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../components/ui/sidebar";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Hem",
    url: "/home",
    icon: Home,
  },
  {
    title: "Mina träningspass",
    url: "/workouts",
    icon: Inbox,
  },
  {
    title: "Mina övningar",
    url: "/exercises",
    icon: Calendar,
  },
  {
    title: "Skapa träningspass",
    url: "/createWorkout",
    icon: Search,
  },
  {
    title: "Min profil",
    url: "/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const handleSignOut = async (event: React.FormEvent) => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
      });
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div
          className="flex items-center mb-2 hover:cursor-pointer"
          onClick={handleSignOut}
        >
          <Settings />
          <span className="ml-2">Logga ut</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
