"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
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
import { app } from "../firebase";

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
    title: "Alla övningar",
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
  const handleSignOut = async () => {
    const auth = getAuth(app);

    try {
      // Sign out the user from Firebase
      await signOut(auth);
      console.log("Successfully signed out");

      // Redirect to the home page (or login page)
      router.push("/");
    } catch (error) {
      // Handle error during sign-out
      console.error("Error during sign out:", error);
      alert("An error occurred while signing out. Please try again.");
    }
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Saving my workouts</SidebarGroupLabel>
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
