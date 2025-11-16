import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { useAuth } from "../utils/auth";
import { productService } from "../services/productService";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

export default function Kitchen() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load vendor products from backend
  useEffect(() => {
    loadVendorProducts();
  }, [id]);

  const loadVendorProducts = async () => {
    try {
      setLoading(true);
      // Get products by vendor ID
      const response = await productService.getProducts({ vendor: id });
      if (response.success) {
        setMenu(response.data || []);
        
        // Get vendor info from the first product
        if (response.data.length > 0) {
          setVendor({
            name: response.data[0].vendorName,
            id: response.data[0].vendor
          });
        }
      }
    } catch (error) {
      console.error('Failed to load vendor products:', error);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  function handleAdd(item) {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", `/kitchen/${id}`);
      navigate("/auth/login");
      return;
    }

    // Transform backend product to cart item format
    const cartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      qty: 1,
      vendor: item.vendorName,
      vendorId: item.vendor
    };

    addToCart(cartItem);

    // Save vendor → kitchen mapping
    const vendorKitchenMap = JSON.parse(localStorage.getItem("vendorKitchenMap") || "{}");
    vendorKitchenMap[item.vendorName] = id;
    localStorage.setItem("vendorKitchenMap", JSON.stringify(vendorKitchenMap));

    alert(`${item.name} added to your cart ✅`);
  }

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agoraTeal"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent">
          {vendor?.name || "Vendor"} Menu
        </h1>
        {vendor && (
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Explore all delicious offerings from {vendor.name}
          </p>
        )}
      </div>

      {menu.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">No menu available for this kitchen.</p>
          <Link to="/shop" className="mt-4 inline-block">
            <Button variant="primary" size="md">
              No menu available check other kitchens
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {menu.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition">
              {item.images?.[0]?.url && (
                <img
                  src={item.images[0].url}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.description}
              </p>
              {item.ingredients && (
                <p className="text-xs text-gray-500 mt-2">
                  Ingredients: {item.ingredients.join(', ')}
                </p>
              )}
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold text-agoraTeal">₹{item.price}</p>
                <Button
                  onClick={() => handleAdd(item)}
                  variant="primary"
                  size="md"
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Continue Shopping button */}
      <div className="mt-8 text-center">
        <Link to="/shop" className="inline-block">
          <Button variant="accent" size="md">
            ← Continue ordering
          </Button>
        </Link>
      </div>
    </main>
  );
}