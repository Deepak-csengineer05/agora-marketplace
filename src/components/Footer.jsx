// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react"; // lightweight icon

export default function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="bg-gradient-to-r from-agoraTeal to-agoraPink text-white pt-6 pb-4 mt-6">
      <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-extrabold mb-3">AGORA</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            Hyperlocal marketplace bridging customers, vendors, and delivery
            partners — making commerce faster, fairer, and more human.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        {/* Users */}
        <div>
          <h4 className="font-semibold mb-3">For Users</h4>
          <ul className="space-y-2">
            <li><Link to="/shop" className="hover:underline">Shop</Link></li>
            <li><Link to="/auth/register" className="hover:underline">Login/SignUp</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className=" flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-4">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} Agora — Built with ❤️
        </p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition"
        >
          <ArrowUp size={16} />
          Back to top
        </button>
      </div>
    </footer>
  );
}
