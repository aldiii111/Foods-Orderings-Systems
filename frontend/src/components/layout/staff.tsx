import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { Sidebars } from "@/components/Sidebar";
import Dashboard from "@/page/staff/dashboard";

export const Staff: React.FC = () => {
    return (
        <SidebarProvider>
            <Sidebars />
            <SidebarInset>
                <Dashboard />
            </SidebarInset>
        </SidebarProvider>
    );
}