"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { updateProfile, updateCustomerAddress, changePassword, updateChefBio } from "@/lib/api";

type Tab = "profile" | "security" | "notifications" | "danger";

export default function ProfileSettingsPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");

  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyPromo, setNotifyPromo] = useState(true);

  if (loading) {
    return <main className="max-w-4xl mx-auto px-5 py-16 text-center text-sage-700">Loading your account…</main>;
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-5 py-20 text-center">
        <p className="text-sage-700 mb-4">You need to be logged in to view profile settings.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-sage-900"
        >
          Go to login
        </button>
      </main>
    );
  }

  async function handleSaveProfile() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await updateProfile(user!.id, { name, phone });
      if (profile?.role === "customer" && address) {
        await updateCustomerAddress(user!.id, address);
      }
      if (profile?.role === "chef") {
        await updateChefBio(user!.id, { specialty, bio });
      }
      await refreshProfile();
      setSavedMsg("Saved!");
    } catch (err) {
      setSavedMsg(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(null), 3000);
    }
  }

  async function handleChangePassword() {
    if (newPassword.length < 8) {
      setSavedMsg("Password must be at least 8 characters.");
      return;
    }
    setChangingPw(true);
    try {
      await changePassword(newPassword);
      setNewPassword("");
      setSavedMsg("Password updated!");
    } catch (err) {
      setSavedMsg(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setChangingPw(false);
      setTimeout(() => setSavedMsg(null), 3000);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "👤 Profile" },
    { id: "security", label: "🔒 Security" },
    { id: "notifications", label: "🔔 Notifications" },
    { id: "danger", label: "⚠️ Danger zone" },
  ];

  return (
    <main className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl font-semibold mb-1">Account settings</h1>
      <p className="text-sm text-sage-700 mb-8">Manage your profile, security, and preferences.</p>

      <div className="grid md:grid-cols-4 gap-8">
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${tab === t.id ? "bg-sage-900 text-white" : "hover:bg-sage-100 text-sage-900"
                }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-3">
          {savedMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-sage-100 text-sage-900 border border-sage-200">
              {savedMsg}
            </div>
          )}

          {tab === "profile" && (
            <div className="rounded-2xl p-6 bg-white border border-sage-200 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold text-white bg-sage-700">
                  {(name || user.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{profile?.role === "chef" ? "Chef account" : "Customer account"}</p>
                  <p className="text-xs text-sage-700">{user.email}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-1.5 block">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 outline-none focus:border-sage-400 text-sm bg-cream"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-1.5 block">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 outline-none focus:border-sage-400 text-sm bg-cream"
                />
              </div>

              {profile?.role === "customer" && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-1.5 block">
                    Delivery address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Sobhanighat Road, Sylhet"
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 outline-none focus:border-sage-400 text-sm bg-cream"
                  />
                </div>
              )}

              {profile?.role === "chef" && (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-1.5 block">
                      Specialty
                    </label>
                    <input
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Bengali, Bakery"
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 outline-none focus:border-sage-400 text-sm bg-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-1.5 block">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Short bio (what makes your kitchen special)"
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 outline-none focus:border-sage-400 text-sm bg-cream resize-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-1.5 block">
                  Email
                </label>
                <input
                  disabled
                  value={user.email}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm bg-sage-100 text-sage-700"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-apricot disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}

          {tab === "security" && (
            <div className="rounded-2xl p-6 bg-white border border-sage-200 space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-1.5 block">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 outline-none focus:border-sage-400 text-sm bg-cream"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={changingPw}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-sage-900 disabled:opacity-50"
              >
                {changingPw ? "Updating…" : "Update password"}
              </button>
            </div>
          )}

          {tab === "notifications" && (
            <div className="rounded-2xl p-6 bg-white border border-sage-200 space-y-4">
              {[
                { label: "Order status emails", desc: "Get notified when your order is accepted, preparing, or delivered.", val: notifyEmail, set: setNotifyEmail },
                { label: "SMS delivery alerts", desc: "A text when your delivery partner is on the way.", val: notifySms, set: setNotifySms },
                { label: "Promotions & weekly menu drops", desc: "New chefs, seasonal dishes, subscriber-only discounts.", val: notifyPromo, set: setNotifyPromo },
              ].map((item) => (
                <label key={item.label} className="flex items-start justify-between gap-4 py-2">
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-sage-700">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.set(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-sage-300 flex-shrink-0"
                  />
                </label>
              ))}
            </div>
          )}

          {tab === "danger" && (
            <div className="rounded-2xl p-6 bg-white border border-berry/30 space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1">Delete your account</p>
                <p className="text-xs text-sage-700 mb-3">
                  This permanently removes your profile, order history, and saved details. This cannot be undone.
                </p>
                <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-berry">
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
