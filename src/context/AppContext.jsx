import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AppContext = createContext();

// Sample initial data
const initialClients = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "098-765-4321",
    address: "456 Oak Ave"
  }
];

const initialServices = [
  { id: 1, name: "Plumbing", hourlyRate: 75 },
  { id: 2, name: "Electrical", hourlyRate: 85 },
  { id: 3, name: "Masonry", hourlyRate: 90 },
  { id: 4, name: "Carpentry Works", hourlyRate: 80 },
  { id: 5, name: "Others", hourlyRate: 70 }
];

const initialInventory = [
  {
    id: 1,
    name: "Pipe Wrench",
    category: "Plumbing",
    quantity: 5,
    status: "Available"
  },
  {
    id: 2,
    name: "Voltage Tester",
    category: "Electrical",
    quantity: 3,
    status: "Available"
  },
  {
    id: 3,
    name: "Trowel",
    category: "Masonry",
    quantity: 8,
    status: "Available"
  },
  {
    id: 4,
    name: "Circular Saw",
    category: "Carpentry",
    quantity: 2,
    status: "Available"
  },
  {
    id: 5,
    name: "Hammer",
    category: "General",
    quantity: 10,
    status: "Available"
  }
];

// Provider component
export const AppProvider = ({ children }) => {
  // Load data from localStorage or use initial data
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem("clients");
    return savedClients ? JSON.parse(savedClients) : initialClients;
  });

  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem("services");
    return savedServices ? JSON.parse(savedServices) : initialServices;
  });

  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookings");
    return savedBookings ? JSON.parse(savedBookings) : [];
  });

  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem("inventory");
    return savedInventory ? JSON.parse(savedInventory) : initialInventory;
  });

  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem("payments");
    return savedPayments ? JSON.parse(savedPayments) : [];
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  // Client functions
  const addClient = (client) => {
    const newClient = {
      ...client,
      id: Date.now()
    };
    setClients([...clients, newClient]);
    return newClient;
  };

  const updateClient = (updatedClient) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const deleteClient = (id) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  // Service functions
  const addService = (service) => {
    const newService = {
      ...service,
      id: Date.now()
    };
    setServices([...services, newService]);
    return newService;
  };

  const updateService = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  const deleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  // Booking functions
  const addBooking = (booking) => {
    // Check if date is already booked
    const isDateBooked = bookings.some(
      (existingBooking) => existingBooking.date === booking.date
    );

    if (isDateBooked) {
      throw new Error("This date is already booked");
    }

    const newBooking = {
      ...booking,
      id: Date.now(),
      status: "Scheduled",
      createdAt: new Date().toISOString()
    };

    // Calculate total amount
    let totalAmount = 0;
    booking.services.forEach((service) => {
      const serviceData = services.find((s) => s.id === service.serviceId);
      if (serviceData) {
        totalAmount += serviceData.hourlyRate * service.hours;
      }
    });

    newBooking.totalAmount = totalAmount;

    // Generate billing
    const billing = {
      id: Date.now() + 1,
      bookingId: newBooking.id,
      clientId: booking.clientId,
      amount: totalAmount,
      status: "Unpaid",
      createdAt: new Date().toISOString()
    };

    setBookings([...bookings, newBooking]);
    setPayments([...payments, billing]);

    return { booking: newBooking, billing };
  };

  const updateBooking = (updatedBooking) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );

    // Update related billing if exists
    const relatedBilling = payments.find(
      (payment) => payment.bookingId === updatedBooking.id
    );

    if (relatedBilling) {
      // Recalculate total amount
      let totalAmount = 0;
      updatedBooking.services.forEach((service) => {
        const serviceData = services.find((s) => s.id === service.serviceId);
        if (serviceData) {
          totalAmount += serviceData.hourlyRate * service.hours;
        }
      });

      const updatedBilling = {
        ...relatedBilling,
        amount: totalAmount
      };

      setPayments(
        payments.map((payment) =>
          payment.id === updatedBilling.id ? updatedBilling : payment
        )
      );
    }
  };

  const deleteBooking = (id) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
    // Also delete related billing
    setPayments(payments.filter((payment) => payment.bookingId !== id));
  };

  // Inventory functions
  const addInventoryItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now()
    };
    setInventory([...inventory, newItem]);
    return newItem;
  };

  const updateInventoryItem = (updatedItem) => {
    setInventory(
      inventory.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  // Payment functions
  const processPayment = (paymentId) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId
          ? { ...payment, status: "Paid", paidAt: new Date().toISOString() }
          : payment
      )
    );
  };

  // Value object to be provided to consumers
  const value = {
    clients,
    services,
    bookings,
    inventory,
    payments,
    addClient,
    updateClient,
    deleteClient,
    addService,
    updateService,
    deleteService,
    addBooking,
    updateBooking,
    deleteBooking,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    processPayment
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
