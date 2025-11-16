// src/pages/Shop.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { Search, Star, Heart } from "lucide-react";
import { productService } from "../services/productService";
import { vendorService } from "../services/vendorService";
import { serviceService } from "../services/serviceService";

export default function Shop() {
  const [activeTab, setActiveTab] = useState("food"); // "food" | "services"
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Rating");
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Categories for chips
  const foodCategories = ["All", "Main Course", "Starter", "Beverage", "Dessert", "Snacks", "Bakery"];
  const serviceCategories = ["All", "Plumbing", "Electrical", "Cleaning", "Tutoring", "Repair", "Beauty"];

  // Load data from backend with strong error handling
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "food") {
        const productsResponse = await productService.getProducts();
        setProducts(productsResponse.success ? productsResponse.data : []);
        if (!productsResponse.success) {
          setError(productsResponse.message || "Failed to load products");
        }

        try {
          const vendorsResponse = await vendorService.getVendors({ type: "product" });
          setVendors(vendorsResponse.success ? vendorsResponse.data : []);
        } catch (vendorError) {
          console.warn("Vendor data not available:", vendorError);
          setVendors([]);
        }
      } else {
        const servicesResponse = await serviceService.getServices();
        setServices(servicesResponse.success ? servicesResponse.data : []);
        if (!servicesResponse.success) {
          setError(servicesResponse.message || "Failed to load services");
        }

        try {
          const vendorsResponse = await vendorService.getVendors({ type: "service" });
          setVendors(vendorsResponse.success ? vendorsResponse.data : []);
        } catch (vendorError) {
          console.warn("Service vendor data not available:", vendorError);
          setVendors([]);
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setError(error.message || "Connection error. Please check if backend is running.");
      setProducts([]);
      setServices([]);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Transform backend products to frontend format (robust)
  const transformProducts = (products) => {
    if (!products || !Array.isArray(products)) return [];
    return products.map((product) => ({
      id: product._id || product.id,
      name: product.name || "Unnamed Product",
      cuisine: product.category || "General",
      rating: product.averageRating || product.rating || 4.5,
      time: `${product.preparationTime || 30} mins`,
      category: product.category || "General",
      badge: product.ordersCount > 10 ? "🔥 Popular" : "⭐ New",
      img: product.images?.[0]?.url || product.image || `https://source.unsplash.com/400x300/?${product.category || "food"}`,
      price: product.price || 0,
      vendor: product.vendorName || product.vendor?.storeName || "Local Vendor",
      vendorId: product.vendor?._id || product.vendor || product.vendorId,
    }));
  };

  // Transform backend services to frontend format (robust)
  const transformServices = (services) => {
    if (!services || !Array.isArray(services)) return [];
    return services.map((service) => ({
      id: service._id || service.id,
      name: service.vendorName || service.vendor?.storeName || service.vendor?.name || "Service Provider",
      service: service.name || "Unnamed Service",
      rate: service.rate || service.price || 0,
      rating: service.averageRating || service.rating || 4.5,
      category: service.category || "General",
      badge: service.bookingsCount > 5 ? "🔥 Popular" : "⭐ New",
      img: service.images?.[0]?.url || service.image || `https://source.unsplash.com/400x300/?${service.category || "service"}`,
      description: service.description || "Professional service",
      experience: service.experience || "1+ years",
    }));
  };

  // Filter + Search + Sort
  const filteredProducts = transformProducts(products)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || p.category === category)
    )
    .sort((a, b) => {
      if (sortBy === "Rating") return b.rating - a.rating;
      if (sortBy === "Fastest") return a.time.localeCompare(b.time);
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      return 0;
    });

  const filteredServices = transformServices(services)
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
    navigate("/checkout", { state: { service, mode } });
  }

  // Top Picks
  const topProducts = transformProducts(products).sort((a, b) => b.rating - a.rating).slice(0, 2);
  const topServices = transformServices(services).sort((a, b) => b.rating - a.rating).slice(0, 2);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agoraTeal"></div>
        </div>
      </main>
    );
  }

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
                ? "Search foods (biryani, pizza...)"
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
        <Button
          onClick={() => {
            setActiveTab("food");
            setCategory("All");
          }}
          variant={activeTab === "food" ? "primary" : "ghost"}
          size="md"
        >
          🍴 Order Food
        </Button>
        <Button
          onClick={() => {
            setActiveTab("services");
            setCategory("All");
          }}
          variant={activeTab === "services" ? "accent" : "ghost"}
          size="md"
        >
          🛠️ Book Services
        </Button>
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
          className="px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <option value="Rating">Sort by Rating</option>
          <option value="Fastest">Sort by Fastest</option>
          <option value="Name">Sort by Name A–Z</option>
        </select>
      </div>

      {/* Top Picks */}
      {(topProducts.length > 0 || topServices.length > 0) && (
        <>
          <h2 className="text-xl font-bold mb-4">⭐ Top Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {(activeTab === "food" ? topProducts : topServices).map((item) => (
              <Card key={item.id} className="relative overflow-hidden hover:scale-105 transition">
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
                  {activeTab === "food" && (
                    <p className="text-agoraTeal font-bold mt-1">₹{item.price}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Main Section */}
      {activeTab === "food" ? (
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/kitchen/${product.vendorId}`}>
                <Card className="relative overflow-hidden hover:scale-105 transition p-0">
                  <img
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id, "food");
                    }}
                    className="absolute top-3 right-3"
                  >
                    <Heart
                      className={`${
                        wishlist.includes(`food-${product.id}`)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <div className="p-4">
                    <span className="text-xs font-medium text-agoraPink">{product.badge}</span>
                    <h2 className="font-semibold text-lg">{product.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.cuisine}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-gray-400 text-sm">• {product.time}</span>
                      </div>
                      <span className="text-agoraTeal font-bold">₹{product.price}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            No food items found. Try different search terms or categories.
          </p>
        )
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="relative overflow-hidden hover:scale-105 transition">
              <img
                src={service.img}
                alt={service.service}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleWishlist(service.id, "service")}
                className="absolute top-3 right-3"
              >
                <Heart
                  className={`${
                    wishlist.includes(`service-${service.id}`)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <div className="p-4">
                <span className="text-xs font-medium text-agoraPink">{service.badge}</span>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-agoraPink font-bold">{service.service}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">₹{service.rate} / hour</p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                  <Star size={14} /> {service.rating}
                </div>
                {service.experience && (
                  <p className="text-xs text-gray-500 mt-1">{service.experience} years experience</p>
                )}
                <div className="flex gap-2 mt-4 flex-col sm:flex-row">
                  <Button
                    onClick={() => handleServiceAction(service, "service")}
                    variant="primary"
                    className="flex-1"
                  >
                    Book Now
                  </Button>
                  <Button
                    onClick={() => handleServiceAction(service, "quote")}
                    variant="accent"
                    className="flex-1"
                  >
                    Request Quote
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No services found. Try different search terms or categories.
        </p>
      )}
    </main>
  );
}
