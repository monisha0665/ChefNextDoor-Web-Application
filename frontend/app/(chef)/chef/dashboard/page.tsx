"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  Wallet,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Star,
  Utensils,
  BarChart2,
  X,
  Trash2,
  Plus
} from "lucide-react";

// Mock Data
const STATS = [
  { label: "Total Orders", value: "18", trend: "up", percent: "20%", icon: ShoppingBag, color: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-100" },
  { label: "Pending Orders", value: "12", trend: "up", percent: "33%", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-100" },
  { label: "Preparing", value: "5", trend: "down", percent: "10%", icon: ChefHat, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-100" },
  { label: "Completed", value: "23", trend: "up", percent: "15%", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-100" },
  { label: "Today's Earnings", value: "৳ 8,750", trend: "up", percent: "18%", icon: Wallet, color: "text-amber-500", bgColor: "bg-amber-50", borderColor: "border-amber-100" },
];

const INITIAL_ORDERS = [
  { id: "CN1234", customer: "Nusrat Jahan", itemsCount: 2, total: 560, time: "23 mins ago", distance: "2.3 km away", status: "Pending", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=100&h=100&fit=crop&q=80" },
  { id: "CN1233", customer: "Ahmed Rahman", itemsCount: 3, total: 850, time: "35 mins ago", distance: "1.8 km away", status: "Pending", image: "https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=100&h=100&fit=crop&q=80" },
  { id: "CN1232", customer: "Sadia Akter", itemsCount: 1, total: 320, time: "1 hour ago", distance: "3.1 km away", status: "Preparing", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzmERDk-fOtuMhk8QFb4dLVbwzAffwwebuKgadXQlODg&s=10" },
  { id: "CN1231", customer: "Rafiq Hasan", itemsCount: 4, total: 1250, time: "1 hour ago", distance: "2.6 km away", status: "Preparing", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=100&h=100&fit=crop&q=80" },
  { id: "CN1230", customer: "Mithila Rahman", itemsCount: 2, total: 620, time: "2 hours ago", distance: "1.5 km away", status: "Completed", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=100&h=100&fit=crop&q=80" },
];

const INITIAL_MENU = [
  { id: 1, name: "Bhuna Khichuri", price: 320, orders: 12, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=100&h=100&fit=crop&q=80" },
  { id: 2, name: "Chicken Rezala", price: 450, orders: 8, image: "https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=100&h=100&fit=crop&q=80" },
  { id: 3, name: "Beef Tehari", price: 380, orders: 6, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=100&h=100&fit=crop&q=80" },
];

export default function ChefDashboardPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isOnline, setIsOnline] = useState(true);

  // Menu Management State
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleAction = (id: string, currentStatus: string) => {
    if (currentStatus === "Pending") {
      setOrders(orders.map(o => o.id === id ? { ...o, status: "Preparing" } : o));
    } else if (currentStatus === "Preparing") {
      setOrders(orders.map(o => o.id === id ? { ...o, status: "Completed" } : o));
    }
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const newItem = {
      id: Date.now(),
      name: newItemName,
      price: Number(newItemPrice),
      orders: 0,
      image: "https://images.unsplash.com/photo-1544025162-831e6798e29a?w=100&h=100&fit=crop&q=80" // Default placeholder
    };

    setMenuItems([...menuItems, newItem]);
    setNewItemName("");
    setNewItemPrice("");
  };

  const handleDeleteMenu = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const dateString = `Today, ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="relative">

      {/* Sub-header bar for Date and Status */}
      <div className="bg-white border-b border-gray-100 px-8 py-3 flex justify-end items-center gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
          <Clock size={16} className="text-gray-400" />
          {dateString}
          <ArrowRight size={14} className="text-gray-400 ml-1 rotate-90" />
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`} />
          {isOnline ? "Online" : "Offline"}
          <ArrowRight size={14} className="text-gray-400 ml-1 rotate-90" />
        </button>
      </div>

      <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-2.5 rounded-2xl ${stat.bgColor} ${stat.borderColor} border`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-auto">
                {stat.trend === 'up' ? (
                  <TrendingUp size={14} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={14} className="text-blue-500" />
                )}
                <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {stat.trend === 'up' ? '↑' : '↓'} {stat.percent}
                </span>
                <span className="text-xs text-gray-400 ml-1">from yesterday</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Left Column - Recent Orders & Charts */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            <div className="bg-white rounded-3xl border border-black-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                <button className="text-sage-700 text-sm font-semibold hover:text-sage-800 flex items-center gap-1">
                  View all orders <ArrowRight size={16} />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={order.image} alt="Food" className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">Order #{order.id}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.itemsCount} items • ৳{order.total}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 flex-1">
                      <div className="text-right w-24">
                        <p className="text-xs font-medium text-gray-500">{order.time}</p>
                        <p className="text-xs text-gray-400">{order.distance}</p>
                      </div>

                      <div className="w-24 flex justify-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'Preparing' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500' :
                            order.status === 'Preparing' ? 'bg-blue-500' :
                              'bg-amber-500'
                            }`} />
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-40 justify-end">
                        <button
                          onClick={() => handleAction(order.id, order.status)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full text-center ${order.status === 'Pending'
                            ? 'bg-sage-700 text-white hover:bg-sage-800 shadow-sm'
                            : order.status === 'Preparing'
                              ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm' // View Details
                            }`}
                        >
                          {order.status === 'Pending' ? 'Accept Order' :
                            order.status === 'Preparing' ? 'Update Status' : 'View Details'}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Charts Section inside left column */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

              {/* Earnings Overview */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Earnings Overview</h3>
                  <select className="text-sm border border-gray-200 bg-white rounded-lg px-3 py-1.5 outline-none text-gray-600 font-medium cursor-pointer hover:bg-gray-50">
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mt-2">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Earnings</p>
                    <h4 className="text-3xl font-display font-bold text-gray-900 mb-2">৳ 8,750</h4>
                    <div className="flex items-center gap-1.5 mb-6">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600">18%</span>
                      <span className="text-xs text-gray-400">from last week (৳ 7,415)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-auto">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Food Sales</p>
                        <p className="text-sm font-bold text-gray-900">৳ 7,250</p>
                        <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">82.9%</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Delivery</p>
                        <p className="text-sm font-bold text-gray-900">৳ 950</p>
                        <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">10.9%</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Tips</p>
                        <p className="text-sm font-bold text-gray-900">৳ 400</p>
                        <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">4.6%</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Discounts</p>
                        <p className="text-sm font-bold text-gray-900">-৳ 150</p>
                        <p className="text-[10px] text-red-500 font-semibold mt-0.5">-1.7%</p>
                      </div>
                    </div>
                  </div>

                  {/* Simple SVG Line Chart Mockup */}
                  <div className="w-full md:w-56 h-40 flex flex-col justify-end relative mt-4 md:mt-0">
                    <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-400 pb-5">
                      <div className="border-b border-gray-100 flex items-center"><span className="-ml-6 w-5 text-right">10k</span></div>
                      <div className="border-b border-gray-100 flex items-center"><span className="-ml-6 w-5 text-right">8k</span></div>
                      <div className="border-b border-gray-100 flex items-center"><span className="-ml-6 w-5 text-right">6k</span></div>
                      <div className="border-b border-gray-100 flex items-center"><span className="-ml-6 w-5 text-right">4k</span></div>
                      <div className="border-b border-gray-100 flex items-center"><span className="-ml-6 w-5 text-right">2k</span></div>
                      <div className="border-b border-gray-100 flex items-center"><span className="-ml-6 w-5 text-right">0</span></div>
                    </div>

                    <svg className="w-full h-[120px] relative z-10 overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
                      {/* Gradient Fill */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,80 L30,50 L60,65 L90,40 L120,45 L160,20 L200,10 L200,100 L0,100 Z"
                        fill="url(#chartGradient)"
                      />
                      <polyline
                        points="0,80 30,50 60,65 90,40 120,45 160,20 200,10"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Data Points */}
                      <circle cx="30" cy="50" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                      <circle cx="60" cy="65" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                      <circle cx="90" cy="40" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                      <circle cx="120" cy="45" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                      <circle cx="160" cy="20" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                      <circle cx="200" cy="10" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                    </svg>

                    <div className="flex justify-between text-[8px] text-gray-400 mt-2 font-medium uppercase px-1">
                      <span>17 Aug</span>
                      <span>18 Aug</span>
                      <span>19 Aug</span>
                      <span>20 Aug</span>
                      <span>21 Aug</span>
                      <span>22 Aug</span>
                      <span>23 Aug</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Order Statistics</h3>
                  <select className="text-sm border border-gray-200 bg-white rounded-lg px-3 py-1.5 outline-none text-gray-600 font-medium cursor-pointer hover:bg-gray-50">
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-6 flex-1">
                  {/* SVG Donut Chart */}
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                      {/* Completed (41.4%) - emerald-500 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="104 251.2" strokeDashoffset="0" />
                      {/* Preparing (25.9%) - blue-500 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="65 251.2" strokeDashoffset="-104" />
                      {/* Pending (17.2%) - amber-500 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray="43 251.2" strokeDashoffset="-169" />
                      {/* Cancelled (15.5%) - purple-500 */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="16" strokeDasharray="39 251.2" strokeDashoffset="-212" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                      <span className="text-2xl font-bold text-gray-900 leading-none">58</span>
                      <span className="text-[9px] text-gray-500 font-semibold uppercase text-center mt-1 leading-tight">Total<br />Orders</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span className="font-semibold text-gray-700">Completed</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">24</span>
                        <span className="text-xs text-gray-400 ml-2">(41.4%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                        <span className="font-semibold text-gray-700">Preparing</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">15</span>
                        <span className="text-xs text-gray-400 ml-2">(25.9%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <span className="font-semibold text-gray-700">Pending</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">10</span>
                        <span className="text-xs text-gray-400 ml-2">(17.2%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                        <span className="font-semibold text-gray-700">Cancelled</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">9</span>
                        <span className="text-xs text-gray-400 ml-2">(15.5%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Average Order Value</p>
                    <p className="text-lg font-bold text-gray-900">৳ 452</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Orders per Day (avg)</p>
                    <p className="text-lg font-bold text-gray-900">8.3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Menu Overview */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Menu Overview</h2>
              <p className="text-sm text-gray-500 mb-6">Manage your menu items</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-bold text-gray-900">{menuItems.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Active Items</span>
                  <span className="font-bold text-gray-900">{menuItems.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Inactive Items</span>
                  <span className="font-bold text-gray-900">0</span>
                </div>
              </div>

              <button
                onClick={() => setIsManageMenuOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-sage-200 text-sage-700 font-semibold text-sm hover:bg-sage-50 transition-colors"
              >
                <Utensils size={16} />
                Manage Menu
              </button>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Top Selling Items</h2>
              <p className="text-sm text-gray-500 mb-6">Today&apos;s best performers</p>

              <div className="space-y-4 mb-6">
                {menuItems.slice(0, 3).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-400 w-3">{index + 1}</span>
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">৳{item.price}</p>
                      <p className="text-[11px] text-gray-500">{item.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-sage-200 text-sage-700 font-semibold text-sm hover:bg-sage-50 transition-colors">
                <BarChart2 size={16} />
                View All Items
              </button>
            </div>

            {/* Customer Reviews Preview */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Customer Reviews</h2>
              <p className="text-sm text-gray-500 mb-6">Latest feedback from customers</p>

              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-gray-900">Nusrat Jahan</h4>
                    <span className="text-[11px] text-gray-400">23 May 2026</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 italic leading-snug">&quot;Amazing food! Full of authentic flavors. Will order again.&quot;</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MANAGE MENU MODAL */}
      {isManageMenuOpen && (
        <div className="fixed inset-0 bg-sage-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-display font-bold text-sage-900 flex items-center gap-2">
                <Utensils size={20} className="text-sage-500" />
                Manage Menu
              </h2>
              <button
                onClick={() => setIsManageMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 custom-scrollbar">
              <div className="space-y-3">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm font-semibold text-sage-600">৳{item.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMenu(item.id)}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                      title="Delete Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {menuItems.length === 0 && (
                  <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                    No items in the menu. Add one below!
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Add New Item</h3>
              <form onSubmit={handleAddMenu} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Item Name (e.g., Kacchi Biryani)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 transition-all bg-gray-50"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (৳)"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 transition-all bg-gray-50"
                  required
                  min="0"
                />
                <button
                  type="submit"
                  className="bg-sage-700 hover:bg-sage-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={18} />
                  Add
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
