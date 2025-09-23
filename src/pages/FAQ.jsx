import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is Agora?",
        a: "Agora is a hyperlocal marketplace connecting customers, vendors, and delivery partners in one seamless platform."
      },
      {
        q: "Where is Agora available?",
        a: "We are currently expanding across multiple cities, starting with India. Our goal is to reach every community worldwide."
      }
    ]
  },
  {
    category: "Vendors",
    items: [
      {
        q: "How do I become a vendor?",
        a: "Simply register with a vendor account and start listing your products. Admin approval may be required for verification."
      },
      {
        q: "What fees does Agora charge?",
        a: "Unlike traditional platforms, Agora keeps fees minimal so vendors can maximize earnings. Fees may vary depending on services."
      }
    ]
  },
  {
    category: "Delivery",
    items: [
      {
        q: "How do delivery partners earn?",
        a: "Delivery partners earn per completed task. Earnings can be tracked in the Delivery Dashboard."
      },
      {
        q: "Do I need a vehicle to deliver?",
        a: "Not necessarily! Depending on your city, deliveries can be done on foot, bicycle, or motorbike."
      }
    ]
  },
  {
    category: "Security",
    items: [
      {
        q: "Is my data secure?",
        a: "Yes. We use secure authentication methods and follow best practices to ensure your data remains private."
      },
      {
        q: "Are payments safe?",
        a: "Absolutely. We partner with trusted payment gateways to ensure every transaction is encrypted and protected."
      }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  // Filtered FAQs based on search term
  const filteredFaqs = faqs.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((section) => section.items.length > 0);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-brand-gradient bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Got questions? We’ve compiled answers to the most common queries from
          customers, vendors, and delivery partners. Can’t find what you’re
          looking for? Reach out to us directly.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-agoraTeal outline-none text-sm sm:text-base"
          />
        </div>
      </section>

      {/* FAQ Sections */}
      {filteredFaqs.length > 0 ? (
        filteredFaqs.map((section, sectionIdx) => (
          <section key={sectionIdx} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              {section.category}
            </h2>
            {section.items.map((item, i) => {
              const idx = `${sectionIdx}-${i}`;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 font-medium text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm sm:text-base"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    {item.q}
                    {openIndex === idx ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                  {openIndex === idx && (
                    <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base animate-slideDown">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No questions found. Try a different search.
        </p>
      )}

      {/* CTA */}
      <section className="text-center py-12">
        <HelpCircle className="mx-auto text-agoraTeal mb-4" size={40} />
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Didn’t find your answer?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
          Our support team is always happy to help. Get in touch with us for
          personalized assistance.
        </p>
        <a
          href="/contact"
          className="px-6 py-3 rounded-full bg-agoraPink text-black font-semibold shadow hover:scale-105 transition"
        >
          Contact Support
        </a>
      </section>
    </main>
  );
}
