import { 
  Package, 
  FileCheck, 
  DollarSign, 
  Users2, 
  ArrowUpRight, 
  ArrowDownRight, 
  View 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const activities = [
    { id: "Invoice INV-1234", target: "Acme Corp", amount: "$2,340", status: "Paid", time: "2 hours ago" },
    { id: "Quotation QUO-5678", target: "Tech Solutions", amount: "$4,580", status: "Pending", time: "5 hours ago" },
    { id: "Stock Product #234", target: "Warehouse A", amount: "50 units", status: "Added", time: "1 day ago" },
    { id: "Invoice INV-1235", target: "Global Inc", amount: "$1,200", status: "Paid", time: "1 day ago" },
  ];

  const stockItems = [
    { name: "Laptop Stand Pro", sku: "LSP-001", stock: 5, reorder: 20 },
    { name: "Wireless Mouse X", sku: "WMX-045", stock: 8, reorder: 25 },
    { name: "USB-C Cable 2m", sku: "USC-200", stock: 12, reorder: 50 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h2>
            <p className="text-xs text-muted-foreground font-medium">Welcome back! Here's what's happening today.</p>
          </div>
        </header>
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Total Products", val: "1,248", icon: Package, bg: "bg-purple-50", text: "text-primary", trend: "+12%", pos: true },
              { title: "Active Quotations", val: "43", icon: FileCheck, bg: "bg-blue-50", text: "text-blue-600", trend: "+8%", pos: true },
              { title: "Monthly Revenue", val: "$45,231", icon: DollarSign, bg: "bg-emerald-50", text: "text-emerald-600", trend: "+23%", pos: true },
              { title: "Total Customers", val: "892", icon: Users2, bg: "bg-rose-50", text: "text-rose-600", trend: "-3%", pos: false },
            ].map((m, i) => (
              <Card key={i} className="border-border/40 shadow-sm rounded-2xl">
                <CardContent className="p-6 flex justify-between">
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{m.title}</p>
                    <h3 className="text-2xl font-bold text-foreground">{m.val}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`size-10 flex items-center justify-center rounded-xl ${m.bg} ${m.text} dark:bg-opacity-10`}>
                      <m.icon className="size-5" />
                    </div>
                    <div className={`flex items-center text-xs font-bold ${m.pos ? "text-emerald-600" : "text-rose-600"}`}>
                      {m.pos ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {m.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-border/40 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border/40 -mt-2">
                  {activities.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-foreground">{item.id}</h4>
                        <p className="text-xs text-muted-foreground">{item.target}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-foreground">{item.amount}</span>
                        <div className="flex flex-col items-end gap-1 w-20">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border 
                            ${item.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                              'bg-blue-50 text-blue-700 border-blue-100'}`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-bold">Low Stock Alert</CardTitle>
                <button className="text-[11px] font-bold text-primary hover:underline">View All</button>
              </CardHeader>
              <CardContent className="space-y-4">
                {stockItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 border border-border/50 rounded-xl bg-white/50 space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-600">Stock: {item.stock}</span>
                        <p className="text-[10px] text-muted-foreground">Limit: {item.reorder}</p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full" 
                        style={{ width: `${(item.stock / item.reorder) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}