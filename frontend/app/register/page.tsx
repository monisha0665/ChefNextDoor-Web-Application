"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/api";

type Role = "customer" | "chef" | "admin";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerUser({
        role,
        email,
        password,
        name,
        phone,
        deliveryAddress: role === "customer" ? deliveryAddress : undefined,
        specialty: role === "chef" ? specialty : undefined,
        bio: role === "chef" ? bio : undefined,
      });
      await loginUser(email, password);
      router.push(role === "chef" ? "/chef/dashboard" : role === "admin" ? "/admin/dashboard" : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-[calc(100vh-80px)] w-full bg-cover bg-center flex items-center justify-center relative bg-no-repeat overflow-hidden py-8"
      style={{ backgroundImage: "url('/register-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>
      <div className="relative z-10 w-full max-w-[380px] bg-[#FDFBF7] rounded-[2rem] shadow-2xl mx-4 flex flex-col border border-white/30">
        <div className="px-6 py-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          {/* Logo placed at the top */}
          <div className="flex justify-center items-center mb-2">
            <img src="/logo.png" alt="Chef Next Door Logo" className="w-40 h-auto rounded-full object-cover drop-shadow-md" />
          </div>

          <h2 className="text-[#6D4C41] text-[28px] font-serif italic text-center mb-4">Register</h2>

          <div className="text-center mb-6 text-sm text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="font-bold text-[#DE6C53] hover:underline">Log in</Link>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex-1 py-2 rounded-full text-[11px] font-bold transition-all border ${role === "customer"
                ? "bg-[#DE6C53] text-white border-[#DE6C53] shadow-md shadow-[#DE6C53]/30"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("chef")}
              className={`flex-1 py-2 rounded-full text-[11px] font-bold transition-all border ${role === "chef"
                ? "bg-[#DE6C53] text-white border-[#DE6C53] shadow-md shadow-[#DE6C53]/30"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              Chef
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 rounded-full text-[11px] font-bold transition-all border ${role === "admin"
                ? "bg-[#DE6C53] text-white border-[#DE6C53] shadow-md shadow-[#DE6C53]/30"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl text-sm bg-red-50 text-red-600 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 ml-3">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-5 py-2.5 bg-white border border-gray-200 rounded-full outline-none focus:border-[#DE6C53] focus:ring-1 focus:ring-[#DE6C53]/20 transition-all text-[13px] text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 ml-3">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-5 py-2.5 bg-[#E8F0FE] border border-gray-200 rounded-full outline-none focus:border-[#DE6C53] focus:ring-1 focus:ring-[#DE6C53]/20 transition-all text-[13px] text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 ml-3">Phone</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-5 py-2.5 bg-white border border-gray-200 rounded-full outline-none focus:border-[#DE6C53] focus:ring-1 focus:ring-[#DE6C53]/20 transition-all text-[13px] text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {role === "customer" ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-800 ml-3">Delivery Address</label>
                <input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Your full address"
                  className="w-full px-5 py-2.5 bg-white border border-gray-200 rounded-full outline-none focus:border-[#DE6C53] focus:ring-1 focus:ring-[#DE6C53]/20 transition-all text-[13px] text-gray-800 placeholder:text-gray-400"
                />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-800 ml-3">Specialty</label>
                  <input
                    required
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Bengali Cuisine"
                    className="w-full px-5 py-2.5 bg-white border border-gray-200 rounded-full outline-none focus:border-[#DE6C53] focus:ring-1 focus:ring-[#DE6C53]/20 transition-all text-[13px] text-gray-800 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-800 ml-3">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    placeholder="Short bio"
                    className="w-full px-5 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#DE6C53] focus:ring-1 focus:ring-[#DE6C53]/20 transition-all text-[13px] text-gray-800 placeholder:text-gray-400 resize-none"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-800 ml-3">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="........"
                className="w-full px-5 py-2.5 bg-[#E8F0FE] border border-gray-200 rounded-full outline-none focus:border-[#DE6C53] focus:ring-1 focus:ring-[#DE6C53]/20 transition-all text-[16px] tracking-[0.2em] text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-[2rem] font-bold text-sm text-white bg-gradient-to-r from-[#D65F43] to-[#E37E64] hover:from-[#C55034] hover:to-[#D46B54] transition-all disabled:opacity-50 shadow-lg shadow-[#DE6C53]/40 tracking-wider uppercase"
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
