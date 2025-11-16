import React, { useState, useMemo } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Search, 
  MessageCircle,
  Users,
  Truck,
  Shield,
  Star,
  Clock,
  Mail
} from "lucide-react";

const faqs = [
  {
    category: "General",
    icon: <HelpCircle className="w-5 h-5" />,
    items: [
      {
        q: "What is Agora and how does it work?",
        a: "Agora is a hyperlocal marketplace that connects customers with local vendors and delivery partners. Customers can browse authentic homemade food and handmade products, place orders, and get them delivered quickly from their neighborhood."
      },
      {
        q: "Where is Agora currently available?",
        a: "We're currently expanding across major Indian cities including Delhi, Mumbai, Bangalore, and Chennai. New locations are added weekly - check our app for the latest availability in your area."
      },
      {
        q: "Is there a mobile app available?",
        a: "Yes! Agora is available on both iOS and Android platforms. Download from the App Store or Google Play Store for the best experience."
      }
    ]
  },
  {
    category: "For Customers",
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        q: "How do I place my first order?",
        a: "Simply create an account, verify your location, browse vendors near you, add items to cart, and checkout. Your first order might even qualify for a welcome discount!"
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit/debit cards, net banking, and digital wallets. Cash on delivery is also available in select areas."
      },
      {
        q: "How can I track my order?",
        a: "Real-time tracking is available in your orders section. You'll see when your order is accepted, prepared, picked up, and out for delivery."
      },
      {
        q: "What if I have issues with my order?",
        a: "Contact our 24/7 support through the app or website. We have a 2-hour resolution policy for most order-related concerns."
      }
    ]
  },
  {
    category: "For Vendors",
    icon: <Star className="w-5 h-5" />,
    items: [
      {
        q: "How do I become an Agora vendor?",
        a: "Register as a vendor, complete our verification process, set up your virtual store, and start listing products. Most vendors get approved within 24-48 hours."
      },
      {
        q: "What are the commission fees?",
        a: "We believe in fair pricing. Our commission starts at just 8% - significantly lower than traditional platforms. Volume discounts available for high-performing vendors."
      },
      {
        q: "How and when do I get paid?",
        a: "Payments are processed weekly every Monday. Funds are transferred directly to your registered bank account with detailed breakdowns."
      },
      {
        q: "What support do you provide to vendors?",
        a: "We offer marketing support, business analytics, customer insights, and dedicated account managers to help you grow your business."
      }
    ]
  },
  {
    category: "For Delivery Partners",
    icon: <Truck className="w-5 h-5" />,
    items: [
      {
        q: "How can I become a delivery partner?",
        a: "Apply through our website, complete the verification process, attend orientation, and start accepting delivery tasks in your preferred areas."
      },
      {
        q: "What are the earning opportunities?",
        a: "Earn per delivery with surge pricing during peak hours. Top partners can earn ₹25,000-₹40,000 monthly with flexible working hours."
      },
      {
        q: "Do I need any specific vehicle?",
        a: "Bicycle, scooter, bike, or car - all are welcome! We recommend vehicles based on your location and delivery volume."
      },
      {
        q: "How flexible is the working schedule?",
        a: "Complete flexibility! Choose your working hours and days. Work full-time or part-time based on your availability."
      }
    ]
  },
  {
    category: "Safety & Security",
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        q: "How do you ensure food safety?",
        a: "All vendors undergo hygiene certifications and regular kitchen audits. We maintain strict quality standards and temperature-controlled deliveries."
      },
      {
        q: "Is my personal data secure?",
        a: "We use bank-level encryption and comply with data protection regulations. Your data is never shared with third parties without consent."
      },
      {
        q: "What safety measures are in place for deliveries?",
        a: "Contactless delivery options, real-time tracking, SOS features, and verified delivery partners with background checks."
      }
    ]
  }
];

const stats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "5K+", label: "Verified Vendors" },
  { number: "2K+", label: "Delivery Partners" },
  { number: "15+", label: "Cities Served" }
];

const FAQItem = ({ item, isOpen, onToggle, index }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-agoraTeal/30">
    <button
      className="w-full flex justify-between items-start px-6 py-4 font-semibold text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-base sm:text-lg group"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${index}`}
    >
      <span className="text-left pr-6 text-gray-800 dark:text-gray-200 group-hover:text-agoraTeal transition-colors">
        {item.q}
      </span>
      <div className={`flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180 text-agoraTeal' : 'text-gray-400'}`}>
        <ChevronDown size={20} />
      </div>
    </button>
    {isOpen && (
      <div 
        id={`faq-answer-${index}`}
        className="px-6 pb-6 text-gray-600 dark:text-gray-300 text-base leading-relaxed animate-fadeIn border-t border-gray-100 dark:border-gray-800 pt-4"
      >
        {item.a}
      </div>
    )}
  </div>
);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState("0-0"); // Open first question by default
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = useMemo(() => {
    if (activeCategory === "All") {
      return faqs.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(section => section.items.length > 0);
    }
    
    return faqs
      .filter(section => section.category === activeCategory)
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
        )
      }))
      .filter(section => section.items.length > 0);
  }, [search, activeCategory]);

  const categories = ["All", ...faqs.map(section => section.category)];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-50 dark:from-black dark:to-black">
      {/* Hero Section */}
      <section className="bg-white dark:bg-black py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-agoraTeal/10 text-agoraTeal px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle size={16} />
            We're here to help
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 bg-brand-gradient bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Find quick answers to common questions about Agora. Can't find what you're looking for? 
            Our support team is just a message away.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions... (e.g., 'payment', 'delivery', 'vendor')"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-agoraTeal focus:border-transparent outline-none text-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white dark:bg-black ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-agoraTeal text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-white dark:bg-black sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-6">
              {filteredFaqs.map((section, sectionIdx) => (
                <section key={section.category} className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-agoraTeal/10 rounded-lg text-agoraTeal">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {section.category}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {section.items.map((item, itemIdx) => {
                      const index = `${sectionIdx}-${itemIdx}`;
                      return (
                        <FAQItem
                          key={index}
                          item={item}
                          isOpen={openIndex === index}
                          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                          index={index}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No questions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't find any questions matching "{search}" in {activeCategory}.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="px-6 py-3 rounded-full bg-agoraTeal text-white font-semibold hover:bg-agoraPink transition-colors"
              >
                View all questions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-r from-agoraTeal to-agoraPink p-1 rounded-3xl inline-block mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl px-8 py-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-agoraTeal to-agoraPink font-bold text-sm">
                NEED MORE HELP?
              </span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Our dedicated support team is available 24/7 to help you with any questions or concerns.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-black rounded-xl">
              <Clock className="w-8 h-8 text-agoraTeal mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Quick Response</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Typically within 30 minutes</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-black rounded-xl">
              <MessageCircle className="w-8 h-8 text-agoraTeal mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Multiple Channels</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chat, email, or phone</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-black rounded-xl">
              <Users className="w-8 h-8 text-agoraTeal mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Expert Team</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trained professionals</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-agoraTeal text-white font-semibold shadow-lg hover:scale-105 transition hover:bg-agoraPink group"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support Team
            </a>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-agoraTeal text-agoraTeal font-semibold hover:bg-agoraTeal hover:text-white transition-colors"
            >
              Call +91 98765 43210
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}