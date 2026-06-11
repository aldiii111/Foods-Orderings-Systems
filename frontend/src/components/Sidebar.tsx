import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import {
    LayoutDashboard,
    Boxes,
    FileText,
    Receipt,
    Users,
    UserCog,
    ChevronDown,
    UtensilsCrossed,
    LogOut,
    History,
    BarChart3,
    Settings,
    ShieldAlert
} from "lucide-react";
import {
    Sidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";

interface MenuItem {
    title: string;
    icon: React.ComponentType<React.ComponentProps<typeof Boxes>>;
    subItems?: { name: string; path: string; icon?: React.ComponentType<any> }[];
    path?: string;
}

export function Sidebars() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    // Manage dropdown state
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Inventory: true,
        Quotations: false,
        "Invoices & Sales": false,
        Admin: false,
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
                { name: "Semua Produk", path: "/staff/products", icon: Boxes },
                { name: "Riwayat Stok", path: "/staff/stock-movements", icon: History },
            ] 
        },
        {
            title: "Quotations",
            icon: FileText,
            subItems: [
                { name: "Semua Penawaran", path: "/staff/quotations", icon: FileText },
                { name: "Buat Penawaran", path: "/staff/quotations/create", icon: FileText },
            ]
        },
        {
            title: "Invoices & Sales",
            icon: Receipt,
            subItems: [
                { name: "Semua Invoice", path: "/staff/invoices", icon: Receipt },
                { name: "Buat Invoice", path: "/staff/invoices/create", icon: Receipt },
                { name: "Laporan Penjualan", path: "/staff/sales-reports", icon: BarChart3 },
            ]
        },
        {
            title: "Customers",
            icon: Users,
            path: "/staff/customers"
        },
        {
            title: "Admin",
            icon: UserCog,
            subItems: [
                { name: "Pengaturan", path: "/staff/settings", icon: Settings },
                { name: "Kelola Staf", path: "/staff/users", icon: ShieldAlert },
            ]
        }
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
            <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
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
                        
                        // Check if active
                        const isMainActive = item.path ? location.pathname === item.path : false;
                        const isAnySubActive = hasSub && item.subItems?.some(sub => location.pathname === sub.path);

                        return (
                            <div key={item.title} className="space-y-1">
                                {hasSub ? (
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={cn(
                                            "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground cursor-pointer",
                                            (isOpen || isAnySubActive) && "text-foreground font-semibold"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={cn("h-5 w-5 text-muted-foreground group-hover:text-foreground", isAnySubActive && "text-primary")} />
                                            <span className="text-sm">{item.title}</span>
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
                                                isOpen && "rotate-180 text-foreground"
                                            )}
                                        />
                                    </button>
                                ) : (
                                    <Link to={item.path || "#"}>
                                        <button
                                            className={cn(
                                                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors hover:bg-primary/10 hover:text-foreground cursor-pointer text-left",
                                                isMainActive 
                                                    ? "bg-primary/15 text-primary font-bold" 
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            <Icon className={cn("h-5 w-5 text-muted-foreground group-hover:text-foreground", isMainActive && "text-primary")} />
                                            <span className="text-sm">{item.title}</span>
                                        </button>
                                    </Link>
                                )}

                                {hasSub && isOpen && (
                                    <div className="space-y-1 pl-6 pr-2 transition-all">
                                        {item.subItems?.map((sub) => {
                                            const isSubActive = location.pathname === sub.path;
                                            const SubIcon = sub.icon || Boxes;
                                            return (
                                                <Link key={sub.name} to={sub.path}>
                                                    <button
                                                        className={cn(
                                                            "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer",
                                                            isSubActive 
                                                                ? "bg-primary/10 text-primary font-semibold" 
                                                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                                        )}
                                                    >
                                                        <SubIcon className="h-3.5 w-3.5" />
                                                        <span>{sub.name}</span>
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