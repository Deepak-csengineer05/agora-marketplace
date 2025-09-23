// src/pages/Shop.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, Heart } from "lucide-react";

// Mock Kitchens (Food vendors like Swiggy)
const kitchens = [
  {
    id: 1,
    name: "Priya’s Kitchen",
    cuisine: "Indian, Biryani",
    rating: 4.8,
    time: "30-40 mins",
    category: "North Indian",
    badge: "💎 Top Rated",
    img: "https://source.unsplash.com/400x300/?biryani",
  },
  {
    id: 2,
    name: "Ravi’s Homemade Meals",
    cuisine: "South Indian, Veg Meals",
    rating: 4.6,
    time: "20-30 mins",
    category: "South Indian",
    badge: "🔥 Trending",
    img: "https://source.unsplash.com/400x300/?idli",
  },
  {
    id: 3,
    name: "Amit’s Tandoor",
    cuisine: "North Indian, Tandoori",
    rating: 4.7,
    time: "25-35 mins",
    category: "North Indian",
    badge: "⏱️ Fast Delivery",
    img: "https://source.unsplash.com/400x300/?tandoori",
  },
];

// Mock Services (like UrbanClap)
const services = [
  {
    id: 1,
    name: "Rajesh Kumar",
    service: "Plumber",
    rate: 300,
    rating: 4.6,
    category: "Plumbers",
    badge: "🔥 Trending",
    img: "https://source.unsplash.com/400x300/?plumber",
  },
  {
    id: 2,
    name: "Sunita Sharma",
    service: "Math Tutor",
    rate: 500,
    rating: 4.9,
    category: "Tutors",
    badge: "💎 Top Rated",
    img: "https://source.unsplash.com/400x300/?teacher",
  },
  {
    id: 3,
    name: "Vikram Singh",
    service: "Electrician",
    rate: 350,
    rating: 4.4,
    category: "Electricians",
    badge: "⏱️ Fast Response",
    img: "https://source.unsplash.com/400x300/?electrician",
  },
];

export default function Shop() {
  const [activeTab, setActiveTab] = useState("food"); // "food" | "services"
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Rating");
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Categories for chips
  const foodCategories = ["All", "South Indian", "North Indian", "Snacks"];
  const serviceCategories = ["All", "Plumbers", "Tutors", "Electricians"];

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle wishlist
  const toggleWishlist = (id, mode) => {
    const key = `${mode}-${id}`;
    if (wishlist.includes(key)) {
      setWishlist(wishlist.filter((w) => w !== key));
    } else {
      setWishlist([...wishlist, key]);
    }
  };

  // Filter + Search + Sort
  const filteredKitchens = kitchens
    .filter(
      (k) =>
        k.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || k.category === category)
    )
    .sort((a, b) => {
      if (sortBy === "Rating") return b.rating - a.rating;
      if (sortBy === "Fastest") return a.time.localeCompare(b.time);
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      return 0;
    });

  const filteredServices = services
    .filter(
      (s) =>
        s.service.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || s.category === category)
    )
    .sort((a, b) => {
      if (sortBy === "Rating") return b.rating - a.rating;
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      return 0;
    });

  function handleServiceAction(service, mode) {
    navigate("/checkout", {
      state: { service, mode }, // "service" or "quote"
    });
  }

  // Top Picks (first 2 highest rated)
  const topKitchens = kitchens.sort((a, b) => b.rating - a.rating).slice(0, 2);
  const topServices = services.sort((a, b) => b.rating - a.rating).slice(0, 2);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero / Search */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 bg-brand-gradient bg-clip-text text-transparent">
          Explore Local Foods & Services
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Order authentic home-cooked meals 🍲 or book trusted local services 🛠️ — all in one place.
        </p>
        <div className="max-w-2xl mx-auto flex items-center bg-gray-100 dark:bg-gray-800 rounded-full shadow px-4">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder={
              activeTab === "food"
                ? "Search kitchens (biryani, meals...)"
                : "Search services (plumber, tutor...)"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 mb-6">
        <button
          onClick={() => {
            setActiveTab("food");
            setCategory("All");
          }}
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === "food"
              ? "bg-agoraTeal text-black"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          🍴 Order Food
        </button>
        <button
          onClick={() => {
            setActiveTab("services");
            setCategory("All");
          }}
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === "services"
              ? "bg-agoraPink text-black"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          🛠️ Book Services
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {(activeTab === "food" ? foodCategories : serviceCategories).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              category === cat
                ? "bg-agoraTeal text-black"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-end mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 "
        >
          <option value="Rating">Sort by Rating</option>
          <option value="Fastest">Sort by Fastest</option>
          <option value="Name">Sort by Name A–Z</option>
        </select>
      </div>

      {/* Top Picks */}
      <h2 className="text-xl font-bold mb-4">⭐ Top Picks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ">
        {(activeTab === "food" ? topKitchens : topServices).map((item) => (
          <div
            key={item.id}
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:scale-105 transition"
          >
            <img
              src={item.img}
              alt={item.name}
              loading="lazy"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="text-xs font-medium text-agoraPink">{item.badge}</span>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeTab === "food" ? item.cuisine : item.service}
              </p>
              <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                <Star size={14} /> {item.rating}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      {activeTab === "food" ? (
        filteredKitchens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKitchens.map((k) => (
              <Link
                key={k.id}
                to={`/kitchen/${k.id}`}
                className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={k.img}
                  alt={k.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(k.id, "food");
                  }}
                  className="absolute top-3 right-3"
                >
                  <Heart
                    className={`${
                      wishlist.includes(`food-${k.id}`)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
                <div className="p-4">
                  <span className="text-xs font-medium text-agoraPink">{k.badge}</span>
                  <h2 className="font-semibold text-lg">{k.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{k.cuisine}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="text-yellow-500" size={16} />
                    <span className="text-sm">{k.rating}</span>
                    <span className="text-gray-400 text-sm">• {k.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            No results found. Try “Biryani”, “Snacks”, or “South Indian”.
          </p>
        )
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:scale-105 transition"
            >
              <img
                src={s.img}
                alt={s.service}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleWishlist(s.id, "service")}
                className="absolute top-3 right-3"
              >
                <Heart
                  className={`${
                    wishlist.includes(`service-${s.id}`)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <div className="p-4">
                <span className="text-xs font-medium text-agoraPink">{s.badge}</span>
                <h3 className="font-semibold text-lg">{s.name}</h3>
                <p className="text-sm text-agoraPink font-bold">{s.service}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">₹{s.rate} / hour</p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                  <Star size={14} /> {s.rating}
                </div>
                <div className="flex gap-2 mt-4 flex-col sm:flex-row">
                  <button
                    onClick={() => handleServiceAction(s, "service")}
                    className="flex-1 px-4 py-2 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => handleServiceAction(s, "quote")}
                    className="flex-1 px-4 py-2 bg-agoraPink text-black font-semibold rounded-full hover:scale-105 transition"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No results found. Try “Plumber”, “Tutor”, or “Electrician”.
        </p>
      )}
    </main>
  );
}
