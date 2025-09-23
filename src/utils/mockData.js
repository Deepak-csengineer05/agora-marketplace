export function seedCustomerData(customerEmail) {
  
  const orders = [
    {
      id: "ord1",
      customer: customerEmail,
      item: "Handmade Clay Pot",
      status: "Delivered",
    },
    {
      id: "ord2",
      customer: customerEmail,
      item: "Home-cooked Biryani",
      status: "Out for Delivery",
    },
  ];

  const cart = [
    { id: "c1", customer: customerEmail, name: "Organic Soap", qty: 2 },
    { id: "c2", customer: customerEmail, name: "Pickles Jar", qty: 1 },
  ];

  localStorage.setItem("agora_orders", JSON.stringify(orders));
  localStorage.setItem("agora_cart", JSON.stringify(cart));
}
