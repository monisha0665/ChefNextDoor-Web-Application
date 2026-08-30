"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ChefCard from "@/components/ChefCard";
import type { Chef } from "@/lib/types";
import { CHEF_IMAGES } from "@/lib/images";
import { listChefs } from "@/lib/api";

import { useChefContext } from "@/lib/chefContext";

let globalChefsCache: Chef[] | null = null;

function BrowseChefsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCuisine, setSelectedCuisine] = useState("All cuisines");
  const [minRating, setMinRating] = useState("Any rating");
  const { chefs: globalChefs } = useChefContext();
  
  // Initialize with cache if available to avoid flicker
  const [chefs, setChefs] = useState<Chef[]>(globalChefsCache || []);
  const [loading, setLoading] = useState(globalChefsCache === null);

  // Sync search input if URL changes
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  // Load global chefs into the page
  useEffect(() => {
    const mappedChefs: Chef[] = globalChefs.map(c => ({
      chef_id: c.id.toString(),
      name: c.name,
      specialty: c.specialty,
      bio: c.bio || "A great home chef on ChefNextDoor.",
      status: c.status,
      rating_avg: c.rating_avg || 4.5,
      image_url: c.img || CHEF_IMAGES["default"],
    }));

    // If cache is empty, we set it synchronously to mappedChefs so we don't flash "No chefs found"
    if (!globalChefsCache) {
      setChefs(mappedChefs);
    }

    // We still attempt API load to merge if real backend is active
    async function load() {
      try {
        if (!globalChefsCache) {
          setLoading(true);
        }
        const apiChefs = await listChefs();
        let finalChefs = mappedChefs;
        if (apiChefs && apiChefs.length > 0) {
          const combinedMap = new Map<string, Chef>();
          mappedChefs.forEach(c => combinedMap.set(c.chef_id, c));
          apiChefs.forEach(c => combinedMap.set(c.chef_id, c));
          finalChefs = Array.from(combinedMap.values());
        }
        globalChefsCache = finalChefs;
        setChefs(finalChefs);
      } catch (err) {
        console.warn("Could not fetch chefs from API, fallback to context list:", err);
        globalChefsCache = mappedChefs;
        setChefs(mappedChefs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [globalChefs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedCuisine("All cuisines");
    setMinRating("Any rating");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(pathname);
  };

  const filteredChefs = useMemo(() => {
    const activeQuery = (searchTerm || urlSearch).toLowerCase().trim();
    return chefs.filter((chef) => {
      // Search term matching name, specialty, bio
      if (activeQuery) {
        const matchName = chef.name.toLowerCase().includes(activeQuery);
        const matchSpecialty = chef.specialty.toLowerCase().includes(activeQuery);
        const matchBio = chef.bio ? chef.bio.toLowerCase().includes(activeQuery) : false;
        if (!matchName && !matchSpecialty && !matchBio) {
          return false;
        }
      }

      // Cuisine filter matching
      if (selectedCuisine !== "All cuisines") {
        if (chef.specialty.toLowerCase() !== selectedCuisine.toLowerCase()) {
          return false;
        }
      }

      // Rating filter matching
      if (minRating === "4.5+") {
        if (chef.rating_avg < 4.5) return false;
      } else if (minRating === "4.8+") {
        if (chef.rating_avg < 4.8) return false;
      }

      return true;
    });
  }, [chefs, searchTerm, urlSearch, selectedCuisine, minRating]);

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">Chefs near you</h1>
          <p className="text-sm text-sage-700">
            {urlSearch ? (
              <span>
                Found <b>{filteredChefs.length}</b> chef{filteredChefs.length === 1 ? "" : "s"} matching &quot;<span className="font-medium text-sage-900">{urlSearch}</span>&quot;
              </span>
            ) : (
              <span>{chefs.length} home chefs within 5km of Zindabazar, Sylhet</span>
            )}
          </p>
        </div>

        {/* Search bar input directly on page */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chefs by name, cuisine, dish..."
              className="w-full pl-9 pr-8 py-2.5 rounded-full border border-sage-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-sage-400 text-sm">🔍</span>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-2.5 text-xs text-sage-400 hover:text-sage-700 font-bold"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-sage-800 hover:bg-sage-900 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-7 pb-4 border-b border-sage-200">
        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="text-sm px-3.5 py-2 rounded-full border border-sage-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          <option>All cuisines</option>
          <option>Bengali</option>
          <option>Chinese</option>
          <option>Bakery</option>
          <option>Vegan</option>
          <option>BBQ</option>
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="text-sm px-3.5 py-2 rounded-full border border-sage-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          <option>Any rating</option>
          <option>4.5+</option>
          <option>4.8+</option>
        </select>

        {(urlSearch || selectedCuisine !== "All cuisines" || minRating !== "Any rating") && (
          <button
            onClick={handleClearSearch}
            className="text-xs font-semibold px-3 py-2 rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors"
          >
            Reset filters ✕
          </button>
        )}

        <span className="text-xs font-bold uppercase tracking-wide px-3.5 py-2 rounded-full ml-auto text-white bg-apricot shadow-sm">
          🔥 4 chefs offering 15% off today
        </span>
      </div>

      {/* Chefs grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-pulse flex flex-col items-center">
            <div className="text-5xl mb-3">👨‍🍳</div>
            <h3 className="font-display text-xl font-semibold mb-2 text-sage-900">Finding chefs nearby...</h3>
          </div>
        </div>
      ) : filteredChefs.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredChefs.map((c) => (
            <ChefCard key={c.chef_id} chef={c} badge={Number(c.chef_id) % 2 === 1 ? "15% off today" : undefined} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-sage-300 p-8">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="font-display text-xl font-semibold mb-2 text-sage-900">No chefs found</h3>
          <p className="text-sage-600 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any home chefs matching &quot;<span className="font-semibold">{urlSearch || searchTerm}</span>&quot;. Try checking for spelling errors or clear your search filters.
          </p>
          <button
            onClick={handleClearSearch}
            className="px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-sage-800 hover:bg-sage-900 transition-colors"
          >
            View all chefs
          </button>
        </div>
      )}
    </main>
  );
}

export default function BrowseChefsPage() {
  return (
    <Suspense fallback={
      <main className="max-w-6xl mx-auto px-5 py-10 text-center">
        <p className="text-sage-600 animate-pulse">Loading chefs...</p>
      </main>
    }>
      <BrowseChefsContent />
    </Suspense>
  );
}

