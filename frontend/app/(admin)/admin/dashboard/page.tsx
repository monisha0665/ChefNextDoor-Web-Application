"use client";
import React, { useState, useEffect } from "react";
import { DISH_IMAGES, CHEF_IMAGES } from "@/lib/images";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

const TRENDING_ITEMS = [
  { id: 1, name: "Biryanis Pulav", price: 12.00, category: "Main Course", sales: 158, perc: 20, img: DISH_IMAGES["101"] },
  { id: 2, name: "Burgers", price: 42.00, category: "Snacks", sales: 18, perc: -0.5, img: DISH_IMAGES["103"] },
  { id: 3, name: "Dal Palak Recipe", price: 60.00, category: "Main Course", sales: 258, perc: 15, img: DISH_IMAGES["402"] },
  { id: 4, name: "Pan Noodles", price: 112.00, category: "Starters", sales: 58, perc: -10, img: DISH_IMAGES["201"] },
  { id: 5, name: "Vegetable Jalfrezi", price: 120.00, category: "Main Course", sales: 215, perc: 21, img: DISH_IMAGES["401"] },
];

const REVIEWS = [
  { id: 1, name: "Jannat", time: "1 day ago", text: "The food tasted homemade, fresh, and absolutely delicious. I’ll definitely order again!.", rating: 4.5, img: DISH_IMAGES["401"] },
  { id: 2, name: "Nafisa", time: "2 day ago", text: "I loved every bite! Great portion, wonderful taste, and such a warm homemade feeling.", rating: 4.0, img: DISH_IMAGES["502"] },
  { id: 3, name: "Tasnia", time: "3 day ago", text: "Amazing experience! The chef was friendly, and the meal felt just like something made at home.”.", rating: 4.5, img: DISH_IMAGES["602"] },
];

import { useChefContext } from "@/lib/chefContext";

const ADMIN_ORDERS = [
  { id: "ORD-9201", customer: "John Doe", chef: "Chef Amina", total: 45.00, status: "Delivered", date: "Today" },
  { id: "ORD-9202", customer: "Alice Smith", chef: "Chef Hassan", total: 32.50, status: "Preparing", date: "Today" },
  { id: "ORD-9203", customer: "Bob Johnson", chef: "Chef Amina", total: 18.00, status: "Pending", date: "Today" },
  { id: "ORD-9199", customer: "Rima Chowdhury", chef: "Chef Hassan", total: 120.00, status: "Cancelled", date: "Yesterday" },
];

export default function AdminDashboardPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const { chefs, addChef, deleteChef } = useChefContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newChefName, setNewChefName] = useState("");
  const [newChefSpecialty, setNewChefSpecialty] = useState("");
  const [orders, setOrders] = useState(ADMIN_ORDERS);

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.push("/");
    }
  }, [loading, profile, router]);

  const handleDeleteChef = (id: number) => {
    deleteChef(id);
  };

  const handleAddChef = () => {
    if (!newChefName.trim()) return;

    addChef({
      name: newChefName,
      specialty: newChefSpecialty || "General",
      status: "Active",
      img: CHEF_IMAGES["default"] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop"
    });

    setNewChefName("");
    setNewChefSpecialty("");
    setIsAdding(false);
  };

  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  if (loading || profile?.role !== "admin") {
    return <main className="bg-[#f8f9fa] min-h-screen flex items-center justify-center text-slate-800">Loading...</main>;
  }

  return (
    <main className="bg-[#f8f9fa] min-h-screen text-slate-800 font-sans">

      {/* Centered Main Layout Container */}
      <div className="p-8 max-w-7xl mx-auto w-full">

        <div className="space-y-8">
          {/* Top 5 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Menu", val: "325", color: "text-orange-500", stroke: "#f97316", progress: 60 },
              { label: "Total Revenue", val: "$425k", color: "text-orange-500", stroke: "#f97316", progress: 80 },
              { label: "Total Orders", val: "415", color: "text-orange-500", stroke: "#f97316", progress: 70 },
              { label: "Total Customers", val: "985", color: "text-orange-500", stroke: "#f97316", progress: 40 },
              { label: "Total Chefs", val: chefs.length.toString(), color: "text-blue-500", stroke: "#3b82f6", progress: 90 },
            ].map((stat, i) => (
              <div key={i} className="bg-green-50 p-5 rounded-2xl shadow-sm border border-green-500 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.val}</p>
                </div>
                {/* Circular Progress SVG */}
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="none" />
                    <circle cx="24" cy="24" r="20" stroke={stat.stroke} strokeWidth="4" fill="none" strokeDasharray="125" strokeDashoffset={125 - (125 * stat.progress) / 100} strokeLinecap="round" />
                  </svg>
                  <div className={`absolute inset-0 flex items-center justify-center text-xs ${stat.color}`}>
                    {stat.progress > 50 ? '▲' : '▼'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Trending Items */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-6">Trending Items</h3>
              <div className="space-y-5">
                {TRENDING_ITEMS.map((item, i) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 font-medium text-sm w-4">#{i + 1}</span>
                      <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">${item.price.toFixed(2)} <span className="text-emerald-500 font-medium">{item.category}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-50">
                        <polyline points="0,15 10,10 20,18 30,5 40,12" fill="none" stroke={item.perc > 0 ? "#10b981" : "#3b82f6"} strokeWidth="2" />
                      </svg>
                      <div className="text-right min-w-[70px]">
                        <p className="text-sm font-bold text-gray-800">{item.sales}</p>
                        <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Sales ({item.perc > 0 ? '+' : ''}{item.perc}%)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Overview Step Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800">Revenue Overview</h3>
                <button className="text-black-400">≡</button>
              </div>
              <div className="flex-1 relative mt-4">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] font-bold text-black-400">
                  <span>180</span><span>160</span><span>140</span><span>120</span><span>100</span><span>80</span>
                </div>
                {/* Chart Area */}
                <div className="absolute left-8 right-0 top-2 bottom-8 border-l border-b border-black-200">
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100].map(p => (
                    <div key={p} className="absolute w-full border-t border-black-200" style={{ top: `${p}%` }} />
                  ))}
                  {/* Step Graph SVG */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon points="0,100 0,80 15,80 15,70 30,70 30,85 45,85 45,60 60,60 60,40 75,40 75,60 90,60 90,20 100,20 100,100" fill="#e0f2fe" opacity="0.6" />
                    <polyline points="0,80 15,80 15,70 30,70 30,85 45,85 45,60 60,60 60,40 75,40 75,60 90,60 90,20 100,20" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  </svg>
                </div>
                {/* X-Axis Labels */}
                <div className="absolute left-8 right-0 bottom-0 h-6 flex justify-between items-end text-[10px] font-bold text-black-400 px-2">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>July</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Orders Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-black-800">Manage Orders (View & Monitor Status)</h3>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black-100 text-xs text-black-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-4">Order ID</th>
                    <th className="pb-3 px-4">Customer</th>
                    <th className="pb-3 px-4">Chef</th>
                    <th className="pb-3 px-4">Total</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-black-50 hover:bg-black-50 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-800">{order.id}</td>
                      <td className="py-4 px-4 text-gray-600">{order.customer}</td>
                      <td className="py-4 px-4 text-gray-600">{order.chef}</td>
                      <td className="py-4 px-4 font-semibold text-gray-800">${order.total.toFixed(2)}</td>
                      <td className="py-4 px-4 text-gray-500 text-xs">{order.date}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border whitespace-nowrap ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                          order.status === 'Preparing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                              'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <select
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 bg-white"
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Chef List */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800">Chef Roster ({chefs.length})</h3>
              <button onClick={() => setIsAdding(!isAdding)} className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm">
                {isAdding ? "Cancel" : "+ Add Chef"}
              </button>
            </div>

            {/* Add Chef Form */}
            {isAdding && (
              <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-inner">
                <input
                  type="text"
                  placeholder="Chef Name (e.g. Chef Hassan)"
                  value={newChefName}
                  onChange={e => setNewChefName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 w-full text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Specialty (e.g. Italian)"
                  value={newChefSpecialty}
                  onChange={e => setNewChefSpecialty(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 w-full text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddChef}
                  disabled={!newChefName.trim()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold w-full md:w-auto hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors shadow-sm"
                >
                  Save Chef
                </button>
              </div>
            )}

            {/* Chefs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chefs.map((chef) => (
                <div key={chef.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-colors group">
                  <div className="flex items-center gap-3">
                    <img src={chef.img} className="w-12 h-12 rounded-full object-cover shadow-sm" alt={chef.name} />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{chef.name}</p>
                      <p className="text-xs text-gray-500">{chef.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 whitespace-nowrap">
                      {chef.status}
                    </span>
                    <button
                      onClick={() => handleDeleteChef(chef.id)}
                      className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete Chef"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {chefs.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-500 text-sm">
                  No chefs found. Add a new chef above!
                </div>
              )}
            </div>
          </div>

          {/* Customer Review Carousel */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Customer Review</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-white shadow-sm border flex items-center justify-center font-bold text-gray-600">{'<'}</button>
                <button className="w-8 h-8 rounded-lg bg-white shadow-sm border flex items-center justify-center font-bold text-gray-600">{'>'}</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((rev) => (
                <div key={rev.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg">👤</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{rev.name}</p>
                      <p className="text-[10px] font-semibold text-gray-400">{rev.time}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pr-12">{rev.text}</p>
                  <div className="mt-4 flex text-orange-400 text-xs">
                    ★★★★<span className="text-gray-300">★</span> <span className="text-gray-600 ml-2 font-bold">{rev.rating}</span>
                  </div>

                  {/* Floating plate image mimicking the screenshot */}
                  <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-28 h-28 bg-white rounded-full p-1 shadow-lg group-hover:scale-105 transition-transform">
                    <img src={rev.img} alt="Dish" className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
