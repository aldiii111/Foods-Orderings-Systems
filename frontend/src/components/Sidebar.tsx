import { useState } from "react";
import { 
  LayoutDashboard, 
  Boxes, 
  FileText, 
  Receipt, 
  Users, 
  Layers, 
  UserCog, 
  ChevronDown, 
  Moon 
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  icon: React.ComponentType<React.ComponentProps<typeof Boxes>>;
  subItems?: string[];
}

export function Sidebars() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Inventory: true,
    Quotations: true,
    "Invoices & Sales": true,
    Admin: true,
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const menuItems: MenuItem[] = [
    { title: "Inventory", icon: Boxes, subItems: ["All Products", "Add Product", "Stock Movements"] },
    { title: "Quotations", icon: FileText, subItems: ["All Quotations", "Create Quotation"] },
    { title: "Invoices & Sales", icon: Receipt, subItems: ["All Invoices", "Create Invoice", "Sales Reports"] },
    { title: "Customers", icon: Users },
    { title: "Integrations", icon: Layers },
    { title: "Admin", icon: UserCog, subItems: ["Settings", "Users"] },
  ];

  return (
    <Sidebar className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Food<span className="text-primary">Order</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <button className="flex active:bg-primary w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/10 transition-all hover:bg-accent/50">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </button>

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
                    "group flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground/70",
                    isOpen && hasSub && "text-foreground/70"
                  )}
                >
                  <div className="flex items-center gap-3 ">
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground/70" />
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
                    {item.subItems?.map((sub) => (
                      <button
                        key={sub}
                        className="flex w-full rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground/70 text-left"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </Sidebar>
  );
}