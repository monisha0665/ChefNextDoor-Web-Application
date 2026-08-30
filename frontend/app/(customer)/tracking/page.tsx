"use client";

import { useAuth } from "@/lib/authContext";

const steps = ["Accepted", "Preparing", "On the Way", "Delivered"];

export default function TrackingPage() {
  const currentStep = 2; // In production: derive from GET /api/orders/:id status
  const { profile } = useAuth();

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl font-semibold mb-1">Order #CN-10482</h1>
      <p className="text-sm mb-8 text-sage-700">
        From Chef Amina&apos;s Kitchen • Estimated arrival 12:47 PM
      </p>

      <div className="flex items-center mb-10">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${i < currentStep ? "bg-sage-700" : i === currentStep ? "bg-apricot animate-pulse" : "bg-sage-200 text-sage-700"
                  }`}
              >
                {i < currentStep ? "✓" : i === currentStep ? "🚴" : i + 1}
              </div>
              <p className="text-xs mt-2 font-semibold">{label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-1 ${i < currentStep ? "bg-sage-700" : "bg-sage-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden border border-sage-200 h-56 relative bg-sage-100">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src="https://www.openstreetmap.org/export/embed.html?bbox=91.8600,24.8900,91.8800,24.9000&layer=mapnik&marker=24.8950,91.8700" 
            style={{ border: 0 }}
            title="Live Delivery Map"
            className="pointer-events-none opacity-90 saturate-150"
          ></iframe>
        </div>
        <div className="rounded-2xl p-5 bg-white border border-sage-200">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-sage-700">
            Delivery partner
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-sage-200">🚴</div>
            <div>
              <p className="font-semibold text-sm">Rakib Hasan</p>
              <p className="text-xs text-sage-700">⭐ 4.9 • Honda CB Shine</p>
            </div>
          </div>
          <p className="text-sm mb-1">
            <b>{profile?.name || "Customer"}&apos;s Location</b>, Sobhanighat Road
          </p>
          <p className="text-xs text-sage-700">2 items • ৳600 • bKash</p>
        </div>
      </div>
    </main>
  );
}
