import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { Sidebars } from "@/components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/page/staff/dashboard";
import { ProductsManage } from "@/page/staff/productsManage";

export const Staff: React.FC = () => {
    return (
        <SidebarProvider>
            <Sidebars />
            <SidebarInset>
                <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductsManage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
            </SidebarInset>
        </SidebarProvider>
    );
}