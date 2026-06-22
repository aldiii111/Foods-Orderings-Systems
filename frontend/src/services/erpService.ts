import api from "@/lib/api";

export const erpService = {
  // Dashboard
  async getDashboard() {
    const response = await api.get("/dashboard");
    return response.data;
  },

  // Categories
  async getCategories() {
    const response = await api.get("/categories");
    return response.data;
  },
  async createCategory(data: any) {
    const response = await api.post("/categories", data);
    return response.data;
  },
  async updateCategory(id: number, data: any) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },
  async deleteCategory(id: number) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
  async reorderCategories(ids: number[]) {
    const response = await api.post("/categories/reorder", { ids });
    return response.data;
  },

  // Units
  async getUnits() {
    const response = await api.get("/units");
    return response.data;
  },
  async createUnit(data: any) {
    const response = await api.post("/units", data);
    return response.data;
  },
  async updateUnit(id: number, data: any) {
    const response = await api.put(`/units/${id}`, data);
    return response.data;
  },
  async deleteUnit(id: number) {
    const response = await api.delete(`/units/${id}`);
    return response.data;
  },

  // Stock
  async getStockMovements() {
    const response = await api.get("/stock");
    return response.data;
  },
  async adjustStock(data: { productId: number; type: "IN" | "OUT" | "ADJUSTMENT"; quantity: number; notes?: string }) {
    const response = await api.post("/stock/adjust", data);
    return response.data;
  },

  // Products extended
  async deleteProduct(id: number) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  async bulkDeleteProducts(ids: number[]) {
    const response = await api.post("/products/bulk-delete", { ids });
    return response.data;
  },
  async bulkUpdateProductStatus(ids: number[], status: string) {
    const response = await api.post("/products/bulk-status", { ids, status });
    return response.data;
  },
  async importProducts(products: any[]) {
    const response = await api.post("/products/import", { products });
    return response.data;
  },

  // Quotations
  async getQuotations(search?: string, status?: string) {
    const params = { search, status };
    const response = await api.get("/quotations", { params });
    return response.data;
  },
  async getQuotationById(id: number) {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  },
  async createQuotation(data: any) {
    const response = await api.post("/quotations", data);
    return response.data;
  },
  async updateQuotation(id: number, data: any) {
    const response = await api.put(`/quotations/${id}`, data);
    return response.data;
  },
  async deleteQuotation(id: number) {
    const response = await api.delete(`/quotations/${id}`);
    return response.data;
  },
  async convertQuotationToInvoice(id: number) {
    const response = await api.post(`/quotations/${id}/convert-invoice`);
    return response.data;
  },

  // Invoices
  async getInvoices(search?: string, paymentStatus?: string) {
    const params = { search, paymentStatus };
    const response = await api.get("/invoices", { params });
    return response.data;
  },
  async getInvoiceById(id: number) {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },
  async createInvoice(data: any) {
    const response = await api.post("/invoices", data);
    return response.data;
  },
  async updateInvoicePayment(id: number, data: { paymentStatus: string; payments: any[] }) {
    const response = await api.put(`/invoices/${id}/payment`, data);
    return response.data;
  },
  async deleteInvoice(id: number) {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  // Customers
  async getCustomers(search?: string) {
    const params = { search };
    const response = await api.get("/customers", { params });
    return response.data;
  },
  async getCustomerById(id: number) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  async createCustomer(data: any) {
    const response = await api.post("/customers", data);
    return response.data;
  },
  async updateCustomer(id: number, data: any) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
  async deleteCustomer(id: number) {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
  async importCustomers(customers: any[]) {
    const response = await api.post("/customers/import", { customers });
    return response.data;
  },

  // Admin Panel
  async getUsers() {
    const response = await api.get("/admin/users");
    return response.data;
  },
  async createUser(data: any) {
    const response = await api.post("/admin/users", data);
    return response.data;
  },
  async updateUser(id: number, data: any) {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },
  async resetUserPassword(id: number, data: any) {
    const response = await api.put(`/admin/users/${id}/reset-password`, data);
    return response.data;
  },
  async getAuditLogs() {
    const response = await api.get("/admin/audit-logs");
    return response.data;
  },

  // Settings
  async getSettings() {
    const response = await api.get("/settings");
    return response.data;
  },
  async saveSettings(data: any) {
    const response = await api.post("/settings", data);
    return response.data;
  },

  // Notifications
  async getNotifications() {
    const response = await api.get("/notifications");
    return response.data;
  },
  async markNotificationRead(id: number) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  async markAllNotificationsRead() {
    const response = await api.put("/notifications/mark-all-read");
    return response.data;
  }
};
