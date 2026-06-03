import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { Sidebars } from "@/components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/page/staff/dashboard";
import { ProductsManage } from "@/page/staff/productsManage";
import { StockMovements } from "@/page/staff/stockMovements";
import { Quotations } from "@/page/staff/quotations";
import { CreateQuotation } from "@/page/staff/createQuotation";
import { Invoices } from "@/page/staff/invoices";
import { CreateInvoice } from "@/page/staff/createInvoice";
import { SalesReports } from "@/page/staff/salesReports";
import { CustomersManage } from "@/page/staff/customers";
import { UsersManage } from "@/page/staff/users";
import { Settings } from "@/page/staff/settings";

export const Staff: React.FC = () => {
    return (
        <SidebarProvider>
            <Sidebars />
            <SidebarInset>
                <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductsManage />} />
                    <Route path="stock-movements" element={<StockMovements />} />
                    <Route path="quotations" element={<Quotations />} />
                    <Route path="quotations/create" element={<CreateQuotation />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="invoices/create" element={<CreateInvoice />} />
                    <Route path="sales-reports" element={<SalesReports />} />
                    <Route path="customers" element={<CustomersManage />} />
                    <Route path="users" element={<UsersManage />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
            </SidebarInset>
        </SidebarProvider>
    );
}