"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#1976D2" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z" />
    <path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-4.078,2.298-6.09,6.505-6.09c1.644,0,3.003,0.117,3.403,0.17v3.743c-0.413-0.05-1.748-0.08-2.91-0.08c-2.228,0-2.998,1.15-2.998,2.946V21h6L34.368,25z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 w-full max-w-[380px] bg-[#f8f9fa] bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/50 overflow-hidden">
        {/* The blurred gradient effect on the right side as seen in the image */}
        <div className="absolute -top-10 -right-10 w-48 h-[120%] bg-gradient-to-l from-orange-900/40 via-orange-800/20 to-transparent blur-[30px] z-0 pointer-events-none rounded-full transform -rotate-12"></div>

        <div className="relative z-10">
          <h2 className="text-[32px] font-medium text-center mb-8 text-black font-sans">Login</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded text-sm bg-red-100 text-red-700 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2.5 bg-transparent border border-gray-300 rounded outline-none focus:border-gray-500 transition-colors text-[15px] pr-10 text-black placeholder:text-gray-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <UserIcon />
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2.5 bg-transparent border border-gray-300 rounded outline-none focus:border-gray-500 transition-colors text-[15px] pr-10 text-black placeholder:text-gray-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <LockIcon />
              </div>
            </div>

            <div className="flex items-center justify-between mt-1 pt-2">
              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded-sm border-gray-400 w-3 h-3 accent-black"
                />
                Remember me
              </label>
              <Link href="/login" className="text-xs text-gray-700 hover:text-black transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-6 rounded-[20px] font-medium text-sm text-white bg-orange-600 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-5 text-xs text-gray-600">
            Don't have an account? <Link href="/register" className="font-bold text-gray-800 hover:underline">Register</Link>
          </div>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-5">
              <div className="absolute w-full border-t border-gray-300"></div>
              <span className="bg-[#f8f9fa] px-2 text-xs text-gray-500 relative z-10">Or continue with</span>
            </div>

            <div className="flex gap-3 justify-center">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 shadow-sm">
                <FacebookIcon />
                Facebook
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 shadow-sm">
                <GoogleIcon />
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
