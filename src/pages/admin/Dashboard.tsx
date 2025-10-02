import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiBox,
  FiUsers,
  FiShoppingCart,
  FiMail,
  FiDollarSign,
} from "react-icons/fi";

const monthlySales = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 600 },
  { name: "Apr", sales: 500 },
  { name: "May", sales: 700 },
];

function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard Overview</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="border border-blue-400 text-blue-400 rounded-lg p-4 flex flex-col items-center transform transition duration-300 hover:scale-105">
          <FiBox className="text-3xl mb-2" />
          <p className="text-lg font-semibold">Products</p>
          <p className="text-2xl font-bold">16</p>
        </div>
        <div className="border border-red-400 text-red-400 rounded-lg p-4 flex flex-col items-center transform transition duration-300 hover:scale-105">
          <FiUsers className="text-3xl mb-2" />
          <p className="text-lg font-semibold">Users</p>
          <p className="text-2xl font-bold">10</p>
        </div>
        <div className="border border-green-400 text-green-400 rounded-lg p-4 flex flex-col items-center transform transition duration-300 hover:scale-105">
          <FiShoppingCart className="text-3xl mb-2" />
          <p className="text-lg font-semibold">Orders</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="border border-yellow-400 text-yellow-400 rounded-lg p-4 flex flex-col items-center transform transition duration-300 hover:scale-105">
          <FiMail className="text-3xl mb-2" />
          <p className="text-lg font-semibold">Messages</p>
          <p className="text-2xl font-bold">75</p>
        </div>
        <div className="border border-purple-400 text-purple-400 rounded-lg p-4 flex flex-col items-center transform transition duration-300 hover:scale-105">
          <FiDollarSign className="text-3xl mb-2" />
          <p className="text-lg font-semibold">Revenue</p>
          <p className="text-2xl font-bold">$0</p>
        </div>
      </div>

      {/* Line Chart taking full width */}
      <div className="border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📈 Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlySales}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              fill="#fbbf24" // optional: makes area under line slightly filled
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
