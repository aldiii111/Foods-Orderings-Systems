import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarInput,
    SidebarMenuButton,
} from "@/components/ui/sidebar"


import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Search, House, ChefHat, Heart, Settings, EggFried, Fish, Beef, Dessert, Vegan } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface sideCompProps {
    className?: string
    SearchHandler: (e: React.FormEvent) => void
    userInput: string
    changeInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SidebarComp({ className, SearchHandler, userInput, changeInput }: sideCompProps) {
    const location = useLocation();

    const menuItems = [
        { name: "Home", to: "/", icon: <House /> },
        { name: "Favorites", to: "/favorites", icon: <Heart /> },
        { name: "Settings", to: "/settings", icon: <Settings /> },
    ];

    const categories = [
        { name: "Breakfast", to: "/categories/breakfast", icon: <EggFried /> },
        { name: "Seafood", to: "/categories/seafood", icon: <Fish /> },
        { name: "Meat", to: "/categories/meat", icon: <Beef /> },
        { name: "Dessert", to: "/categories/dessert", icon: <Dessert /> },
        { name: "Vegan", to: "/categories/vegan", icon: <Vegan /> }
    ]

    return (
        <Sidebar className={className}>
            <SidebarHeader className="gap-1 flex flex-col">
                <div className="flex flex-row gap-0.5"><ChefHat className="w-8 h-8 text-primary mt-1" /><h2 className="text-2xl mt-1 font-bold text-foreground">MyRecipe</h2></div>
                <SidebarGroupLabel className="px-0 text-md text-muted-foreground">Find Inspiring Recipes</SidebarGroupLabel>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="mt-3">
                    <form className="relative group" onSubmit={SearchHandler}>
                        <SidebarInput id="search" className="h-11 pl-10 bg-background text-foreground border-border" value={userInput} placeholder="  Search recipes (e.g., Chicken)..." onChange={changeInput} />
                        <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent border-none" type="submit">
                            <Search className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </form>

                    <div className="mt-9 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.to;
                            return (
                                <Link to={item.to} key={item.name}>
                                    <SidebarMenuButton
                                        className={`relative pl-4 gap-4 flex transition-all group ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground '}`}
                                        size="lg" duration-200
                                        variant="outline2"
                                    >
                                        {isActive && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                                        <div className={`${isActive ? 'text-primary active:text-primary' : 'text-muted-foreground hover:text-primary '}`}>
                                            {item.icon}
                                        </div>
                                        <p className="text-muted-foreground font-bold text-md">{item.name}</p>
                                    </SidebarMenuButton>
                                </Link>
                            )
                        })}
                    </div>

                    <Separator className="my-9" />
                    <h1 className="text-primary text-base font-bold tracking-wider uppercase">Popular Categories</h1>
                </SidebarGroup>
                <SidebarGroup className="space-y-1">
                    {categories.map((cat) => {
                        const isActive = location.pathname === cat.to;
                        return (
                            <Link to={cat.to} key={cat.name}>
                                <SidebarMenuButton
                                    className={`relative pl-4 gap-4 flex transition-all group ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground '}`}
                                    size="lg"
                                    variant="outline2"
                                >
                                    {isActive && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                                    <div className={`${isActive ? 'text-primary active:text-primary' : 'text-muted-foreground hover:text-primary '}`}>
                                        {cat.icon}
                                    </div>
                                    <p className="text-muted-foreground font-bold text-md">{cat.name}</p>
                                </SidebarMenuButton>
                            </Link>
                        )
                    })}
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}