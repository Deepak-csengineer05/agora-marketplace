    // src/utils/DeliveryContext.jsx
    import React, { createContext, useContext, useState, useEffect } from "react";

    const DeliveryContext = createContext();

    export function DeliveryProvider({ children }) {
      const [online, setOnline] = useState(
        localStorage.getItem("agora_status") === "on"
      );

      const [availableTasks, setAvailableTasks] = useState([]);
      const [ongoing, setOngoing] = useState([]);
      const [completed, setCompleted] = useState([]);
      const [earnings, setEarnings] = useState({ today: 0, total: 0 });

      // 🔹 Load initial data from localStorage
      useEffect(() => {
        setAvailableTasks(
          JSON.parse(localStorage.getItem("availableTasks") || "[]")
        );
        setOngoing(JSON.parse(localStorage.getItem("ongoingDeliveries") || "[]"));
        setCompleted(
          JSON.parse(localStorage.getItem("agora_completed_tasks") || "[]")
        );
      }, []);

      // 🔹 Persist changes
      useEffect(() => {
        localStorage.setItem("agora_status", online ? "on" : "off");
      }, [online]);

      useEffect(() => {
        localStorage.setItem("availableTasks", JSON.stringify(availableTasks));
      }, [availableTasks]);

      useEffect(() => {
        localStorage.setItem("ongoingDeliveries", JSON.stringify(ongoing));
      }, [ongoing]);

      useEffect(() => {
        localStorage.setItem("agora_completed_tasks", JSON.stringify(completed));
        calculateEarnings(completed);
      }, [completed]);

      // 🔹 Earnings calculation
      function calculateEarnings(tasks) {
        const today = new Date().toISOString().split("T")[0];
        let todayEarnings = 0;
        let total = 0;

        tasks.forEach((t) => {
          total += t.deliveryFee || 0;
          if (t.completedAt?.startsWith(today)) {
            todayEarnings += t.deliveryFee || 0;
          }
        });

        setEarnings({ today: todayEarnings, total });
        localStorage.setItem("agora_earnings", total);
      }

      function acceptTask(task) {
        const accepted = { 
          ...task, 
          status: "Accepted", 
          acceptedAt: new Date().toISOString(),
          otp: generateOtp() 
        };
        
        setOngoing((prev) => {
          const updated = [...prev, accepted];
          localStorage.setItem("ongoingDeliveries", JSON.stringify(updated));

          // 🔥 Fire a custom event so OngoingDeliveries can react instantly
          window.dispatchEvent(new Event("ongoingUpdated"));

          return updated;
        });

        setAvailableTasks((prev) => prev.filter((t) => t.id !== task.id));
      }


      function updateOngoingStatus(orderId, newStatus) {
        setOngoing((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
      // 🔹 Generate a random 4-digit OTP
      function generateOtp() {
        return Math.floor(1000 + Math.random() * 9000).toString(); // 1000–9999
      }
      function completeTask(orderId, otpInput) {
        const order = ongoing.find((o) => o.id === orderId);
        if (!order) return { success: false, msg: "Order not found" };

        if (otpInput !== (order.otp || "1234")) {
          return { success: false, msg: "❌ Incorrect OTP" };
        }

        const updatedOngoing = ongoing.filter((o) => o.id !== orderId);
        setOngoing(updatedOngoing);
        localStorage.setItem("ongoingDeliveries", JSON.stringify(updatedOngoing));

        const completedOrder = {
          ...order,
          completedAt: new Date().toISOString(),
          status: "Delivered",
        };

        setCompleted((prev) => {
          const updated = [...prev, completedOrder];
          localStorage.setItem("agora_completed_tasks", JSON.stringify(updated));

          // 🔥 Fire update event so CompletedDeliveries.jsx refreshes instantly
          window.dispatchEvent(new Event("completedUpdated"));

          return updated;
        });

        return { success: true, msg: `✅ Order ${orderId} delivered!` };
      }


      return (
        <DeliveryContext.Provider
          value={{
            online,
            setOnline,
            availableTasks,
            setAvailableTasks,
            ongoing,
            setOngoing,
            completed,
            earnings,
            acceptTask,
            updateOngoingStatus,
            completeTask,
          }}
        >
          {children}
        </DeliveryContext.Provider>
      );
    }

    export const useDelivery = () => useContext(DeliveryContext);
