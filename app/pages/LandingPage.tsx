"use client";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  UserCircle,
  PlusCircle,
  ShoppingBag,
} from "lucide-react";

const investmentData = [
  { month: "Jan", value: 4300 },
  { month: "Feb", value: 5200 },
  { month: "Mar", value: 4800 },
  { month: "Apr", value: 6100 },
  { month: "May", value: 5900 },
  { month: "Jun", value: 7200 },
];

const tokenBalances = [
  { name: "ETH", value: 6800, growth: 12.5, color: "#6366F1" },
  { name: "BTC", value: 4200, growth: -3.2, color: "#F59E0B" },
  { name: "USDC", value: 3100, growth: 0.1, color: "#10B981" },
];

const pieData = tokenBalances.map((token) => ({
  name: token.name,
  value: token.value,
}));

const COLORS = ["#6366F1", "#F59E0B", "#10B981"];

const Dashboard = ({ userType }: { userType: "investor" | "user" | null }) => {
  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-600 rounded-full"></div>
                </div>
                <div className="mx-4 font-semibold text-xl">TradeXchange</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userType === "investor" ? (
              <Link
                href="/invest"
                className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Create New Investment
                    </h3>
                    <p className="text-blue-100">
                      Share your portfolio strategy
                    </p>
                  </div>
                  <PlusCircle className="h-6 w-6 hover:scale-110 transition-transform" />
                </div>
              </Link>
            ) : (
              <Link
                href="/investments"
                className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Browse Investments
                    </h3>
                    <p className="text-blue-100">Discover winning portfolios</p>
                  </div>
                  <ShoppingBag className="h-6 w-6 hover:scale-110 transition-transform" />
                </div>
              </Link>
            )}

            <Link
              href="/profile"
              className="p-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">View Profile</h3>
                  <p className="text-gray-300">
                    Manage your account and investments
                  </p>
                </div>
                <UserCircle className="h-6 w-6 hover:scale-110 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Portfolio Value</h2>
                <div className="text-3xl font-bold text-blue-600">
                  $16,073.49
                </div>
                <div className="text-sm text-green-500 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +9.3% from last month
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={investmentData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366F1"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Asset Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Token List */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activities</h2>
            <div className="flex items-center space-x-2">
              <ArrowDownRight className="h-5 w-5 text-red-500" />
              <span>Latest transactions</span>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tokenBalances.map((token, index) => (
                  <tr key={index}>
                    <td className="py-3">Investment in {token.name}</td>
                    <td className="py-3 font-semibold">
                      ${token.value.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded ${
                          token.growth >= 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {token.growth >= 0 ? "Profit" : "Loss"}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">Today</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
