export default function PromoBanner() {
  return (
    <div className="flex items-center justify-between gap-5 rounded-3xl p-8 mb-16 bg-sage-200">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">
          Get weekly menu drops in your inbox
        </h3>
        <p className="text-sm text-sage-700">
          New chefs, seasonal dishes, and subscriber-only discounts.
        </p>
      </div>
      <form className="flex gap-2 w-full md:w-auto">
        <input
          type="email"
          required
          placeholder="you@email.com"
          className="px-4 py-2 rounded-full text-sm outline-none flex-1 md:w-64 bg-white"
        />
        <button className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-apricot whitespace-nowrap">
          Subscribe
        </button>
      </form>
    </div>
  );
}
