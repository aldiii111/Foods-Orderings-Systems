import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import {
    LayoutDashboard,
    Boxes,
    ChevronDown,
    UtensilsCrossed,
    LogOut
} from "lucide-react";
import {
    Sidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";

interface MenuItem {
    title: string;
    icon: React.ComponentType<React.ComponentProps<typeof Boxes>>;
    subItems?: { name: string; path: string }[];
}

export function Sidebars() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Inventory: true,
    });

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems: MenuItem[] = [
        { 
            title: "Inventory", 
            icon: Boxes, 
            subItems: [
                { name: "Semua Produk", path: "/staff/products" },
            ] 
        },
    ];

    const isDashboardActive = location.pathname === "/staff/dashboard" || location.pathname === "/staff";

    return (
        <Sidebar className="flex h-screen w-64 flex-col border-r border-border bg-card">
            {/* Header */}
            <div className="flex h-22 items-center justify-between border-b border-border px-4.5">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary shadow-lg shadow-primary/25">
                    <UtensilsCrossed className="size-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Food<span className="text-primary">Order</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                <Link to="/staff/dashboard">
                    <button 
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-pointer",
                            isDashboardActive 
                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10" 
                                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                        )}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </button>
                </Link>

                <div className="space-y-1 pt-4">
                    {menuItems.map((item) => {
                        const hasSub = !!item.subItems;
                        const isOpen = openMenus[item.title];
                        const Icon = item.icon;

                        return (
                            <div key={item.title} className="space-y-1">
                                <button
                                    onClick={() => hasSub && toggleMenu(item.title)}
                                    className={cn(
                                        "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground cursor-pointer",
                                        isOpen && hasSub && "text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                                        <span className="text-md">{item.title}</span>
                                    </div>
                                    {hasSub && (
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
                                                isOpen && "rotate-180 text-foreground"
                                            )}
                                        />
                                    )}
                                </button>

                                {hasSub && isOpen && (
                                    <div className="space-y-1 pl-11 pr-2">
                                        {item.subItems?.map((sub) => {
                                            const isSubActive = location.pathname === sub.path;
                                            return (
                                                <Link key={sub.name} to={sub.path}>
                                                    <button
                                                        className={cn(
                                                            "flex w-full rounded-md px-3 py-2 text-sm font-medium transition-colors text-left cursor-pointer",
                                                            isSubActive 
                                                                ? "bg-primary/10 text-primary" 
                                                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                                        )}
                                                    >
                                                        {sub.name}
                                                    </button>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Logout at bottom */}
            <div className="border-t border-border p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                    <LogOut className="h-5 w-5" />
                    Keluar (Logout)
                </button>
            </div>
        </Sidebar>
    );
}