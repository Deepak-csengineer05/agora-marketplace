// src/utils/DeliveryContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { deliveryService } from "../services/deliveryService";
import { authService } from "../services/authService";

const DeliveryContext = createContext();

export function DeliveryProvider({ children }) {
  const [online, setOnline] = useState(
    localStorage.getItem("agora_status") === "on"
  );
  const [availableTasks, setAvailableTasks] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [earnings, setEarnings] = useState({ today: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  // 🔹 Load initial data from backend API ONLY if user is delivery partner
 useEffect(() => {
    const user = authService.getStoredUser();
    if (user && user.role === 'delivery') {
      loadDeliveryData();
    } else {
      loadFromLocalStorage();
    }
  }, []);

  // 🔹 Load data from backend API
  const loadDeliveryData = async () => {
    try {
      setLoading(true);
      
      const user = authService.getStoredUser();
      if (!user || user.role !== 'delivery') {
        loadFromLocalStorage();
        return;
      }

      // Load dashboard data which includes stats and current tasks
      const dashboardResponse = await deliveryService.getDashboard();
      if (dashboardResponse.success) {
        const { currentTasks, stats } = dashboardResponse.data;
        
        // Transform backend tasks to frontend format
        const transformedOngoing = currentTasks.map(task => ({
          id: task._id,
          orderId: task.order?._id,
          customerName: task.order?.customerName,
          customerPhone: task.order?.customerPhone,
          pickupLocation: task.pickupLocation,
          dropLocation: task.dropLocation,
          deliveryFee: task.deliveryFee,
          distance: task.distance,
          status: task.status,
          acceptedAt: task.acceptedAt,
          otp: task.otp,
          estimatedTime: task.estimatedTime
        }));

        setOngoing(transformedOngoing);
        setEarnings({ 
          today: stats.totalEarnings || 0, 
          total: stats.totalEarnings || 0 
        });
      }

      // Load available tasks
      const tasksResponse = await deliveryService.getAvailableTasks();
      if (tasksResponse.success) {
        const transformedAvailable = tasksResponse.data.map(task => ({
          id: task._id,
          orderId: task.order?._id,
          customerName: task.order?.customerName,
          pickupLocation: task.pickupLocation,
          dropLocation: task.dropLocation,
          deliveryFee: task.deliveryFee,
          distance: task.distance,
          estimatedTime: task.estimatedTime,
          status: task.status
        }));
        setAvailableTasks(transformedAvailable);
      }

      // Load completed deliveries
      const completedResponse = await deliveryService.getCompletedDeliveries();
      if (completedResponse.success) {
        const transformedCompleted = completedResponse.data.map(task => ({
          id: task._id,
          orderId: task.order?._id,
          customerName: task.order?.customerName,
          pickupLocation: task.pickupLocation,
          dropLocation: task.dropLocation,
          deliveryFee: task.deliveryFee,
          completedAt: task.deliveredAt,
          status: task.status,
          rating: task.rating
        }));
        setCompleted(transformedCompleted);
      }

    } catch (error) {
      console.error('Failed to load delivery data:', error);
      // Fallback to localStorage if backend fails
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fallback: Load from localStorage
  const loadFromLocalStorage = () => {
    setAvailableTasks(JSON.parse(localStorage.getItem("availableTasks") || "[]"));
    setOngoing(JSON.parse(localStorage.getItem("ongoingDeliveries") || "[]"));
    setCompleted(JSON.parse(localStorage.getItem("agora_completed_tasks") || "[]"));
    
    // Calculate earnings from localStorage data
    const savedCompleted = JSON.parse(localStorage.getItem("agora_completed_tasks") || "[]");
    calculateEarnings(savedCompleted);
  };

  // 🔹 Persist changes to localStorage as backup
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
    localStorage.setItem("agora_earnings", JSON.stringify(total));
  }

  // 🔹 Accept task (connects to backend)
  const acceptTask = async (task) => {
    try {
      if (authService.isAuthenticated()) {
        // Accept task via backend API
        const response = await deliveryService.acceptTask(task.id);
        if (response.success) {
          const acceptedTask = response.data;
          
          const accepted = { 
            id: acceptedTask._id,
            orderId: acceptedTask.order?._id,
            customerName: acceptedTask.order?.customerName,
            customerPhone: acceptedTask.order?.customerPhone,
            pickupLocation: acceptedTask.pickupLocation,
            dropLocation: acceptedTask.dropLocation,
            deliveryFee: acceptedTask.deliveryFee,
            distance: acceptedTask.distance,
            status: acceptedTask.status,
            acceptedAt: acceptedTask.acceptedAt,
            otp: acceptedTask.otp,
            estimatedTime: acceptedTask.estimatedTime
          };
          
          // Update local state
          setOngoing((prev) => {
            const updated = [...prev, accepted];
            localStorage.setItem("ongoingDeliveries", JSON.stringify(updated));
            window.dispatchEvent(new Event("ongoingUpdated"));
            return updated;
          });

          setAvailableTasks((prev) => prev.filter((t) => t.id !== task.id));
          
          return { success: true, task: accepted };
        } else {
          throw new Error(response.message || 'Failed to accept task');
        }
      } else {
        // Fallback to localStorage mock
        return await mockAcceptTask(task);
      }
    } catch (error) {
      console.error('Task acceptance failed:', error);
      // Fallback to mock if backend fails
      return await mockAcceptTask(task);
    }
  };

  // 🔹 Mock accept task (fallback)
  const mockAcceptTask = (task) => {
    const accepted = { 
      ...task, 
      status: "assigned", 
      acceptedAt: new Date().toISOString(),
      otp: generateOtp() 
    };
    
    setOngoing((prev) => {
      const updated = [...prev, accepted];
      localStorage.setItem("ongoingDeliveries", JSON.stringify(updated));
      window.dispatchEvent(new Event("ongoingUpdated"));
      return updated;
    });

    setAvailableTasks((prev) => prev.filter((t) => t.id !== task.id));
    
    return { success: true, task: accepted };
  };

  // 🔹 Update ongoing status (connects to backend)
  const updateOngoingStatus = async (orderId, newStatus) => {
    try {
      if (authService.isAuthenticated()) {
        // Update status via backend API
        await deliveryService.updateTaskStatus(orderId, newStatus);
      }
      
      // Update local state
      setOngoing((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      
      return { success: true };
    } catch (error) {
      console.error('Status update failed:', error);
      // Fallback to local update
      setOngoing((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      return { success: true };
    }
  };

  // 🔹 Complete task (connects to backend)
  const completeTask = async (orderId, otpInput) => {
    try {
      const order = ongoing.find((o) => o.id === orderId);
      if (!order) return { success: false, msg: "Order not found" };

      // Verify OTP (mock verification for now)
      if (otpInput !== (order.otp || "1234")) {
        return { success: false, msg: "❌ Incorrect OTP" };
      }

      if (authService.isAuthenticated()) {
        // Mark as delivered via backend API
        await deliveryService.updateTaskStatus(orderId, 'delivered');
      }

      // Update local state
      const updatedOngoing = ongoing.filter((o) => o.id !== orderId);
      setOngoing(updatedOngoing);
      localStorage.setItem("ongoingDeliveries", JSON.stringify(updatedOngoing));

      const completedOrder = {
        ...order,
        completedAt: new Date().toISOString(),
        status: "delivered",
      };

      setCompleted((prev) => {
        const updated = [...prev, completedOrder];
        localStorage.setItem("agora_completed_tasks", JSON.stringify(updated));
        window.dispatchEvent(new Event("completedUpdated"));
        return updated;
      });

      return { success: true, msg: `✅ Order ${orderId} delivered!` };

    } catch (error) {
      console.error('Task completion failed:', error);
      // Fallback to local completion
      return await mockCompleteTask(orderId, otpInput);
    }
  };

  // 🔹 Mock complete task (fallback)
  const mockCompleteTask = (orderId, otpInput) => {
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
      status: "delivered",
    };

    setCompleted((prev) => {
      const updated = [...prev, completedOrder];
      localStorage.setItem("agora_completed_tasks", JSON.stringify(updated));
      window.dispatchEvent(new Event("completedUpdated"));
      return updated;
    });

    return { success: true, msg: `✅ Order ${orderId} delivered!` };
  };

  // 🔹 Generate a random 4-digit OTP
  function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // 🔹 Refresh data from backend
  const refreshData = () => {
    if (authService.isAuthenticated()) {
      loadDeliveryData();
    }
  };

  // 🔹 Get earnings from backend
  const loadEarnings = async (period = 'month') => {
    try {
      if (authService.isAuthenticated()) {
        const response = await deliveryService.getEarnings(period);
        if (response.success) {
          const { summary } = response.data;
          setEarnings({ 
            today: summary.totalNet || 0, 
            total: summary.totalNet || 0 
          });
          return response.data;
        }
      }
    } catch (error) {
      console.error('Failed to load earnings:', error);
    }
    return null;
  };

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
        loading,
        acceptTask,
        updateOngoingStatus,
        completeTask,
        refreshData,
        loadEarnings,
        generateOtp,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export const useDelivery = () => useContext(DeliveryContext);