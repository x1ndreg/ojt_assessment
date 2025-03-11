import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Bookings = () => {
  const {
    clients,
    services,
    bookings,
    addBooking,
    updateBooking,
    deleteBooking
  } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    clientId: "",
    date: new Date(),
    services: [{ serviceId: "", hours: 1 }],
    notes: ""
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setBookingDate(date);
    setFormData({
      ...formData,
      date
    });

    // Clear error message when date changes
    setErrorMessage("");
  };

  // Handle service selection
  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...formData.services];

    if (name === "hours") {
      updatedServices[index] = {
        ...updatedServices[index],
        hours: parseFloat(value) || 1
      };
    } else {
      updatedServices[index] = {
        ...updatedServices[index],
        [name]: value
      };
    }

    setFormData({
      ...formData,
      services: updatedServices
    });
  };

  // Add service row
  const addServiceRow = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { serviceId: "", hours: 1 }]
    });
  };

  // Remove service row
  const removeServiceRow = (index) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);

    setFormData({
      ...formData,
      services: updatedServices.length
        ? updatedServices
        : [{ serviceId: "", hours: 1 }]
    });
  };

  // Calculate total amount
  const calculateTotal = () => {
    let total = 0;

    formData.services.forEach((service) => {
      if (service.serviceId && service.hours) {
        const serviceData = services.find(
          (s) => s.id === parseInt(service.serviceId)
        );
        if (serviceData) {
          total += serviceData.hourlyRate * service.hours;
        }
      }
    });

    return total;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate services
    const validServices = formData.services.filter(
      (service) => service.serviceId && service.hours > 0
    );
    if (validServices.length === 0) {
      setErrorMessage("Please add at least one service");
      return;
    }

    try {
      if (editingBooking) {
        // Update existing booking
        updateBooking({
          ...editingBooking,
          clientId: parseInt(formData.clientId),
          date: formData.date.toISOString().split("T")[0],
          services: validServices.map((service) => ({
            serviceId: parseInt(service.serviceId),
            hours: parseFloat(service.hours)
          })),
          notes: formData.notes
        });
      } else {
        // Add new booking
        addBooking({
          clientId: parseInt(formData.clientId),
          date: formData.date.toISOString().split("T")[0],
          services: validServices.map((service) => ({
            serviceId: parseInt(service.serviceId),
            hours: parseFloat(service.hours)
          })),
          notes: formData.notes
        });
      }

      // Reset form
      setFormData({
        clientId: "",
        date: new Date(),
        services: [{ serviceId: "", hours: 1 }],
        notes: ""
      });
      setBookingDate(new Date());
      setShowForm(false);
      setEditingBooking(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle edit booking
  const handleEdit = (booking) => {
    const bookingDate = new Date(booking.date);
    setEditingBooking(booking);
    setBookingDate(bookingDate);

    setFormData({
      clientId: booking.clientId.toString(),
      date: bookingDate,
      services: booking.services.map((service) => ({
        serviceId: service.serviceId.toString(),
        hours: service.hours
      })),
      notes: booking.notes || ""
    });

    setShowForm(true);
    setErrorMessage("");
  };

  // Handle delete booking
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      deleteBooking(id);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Add click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".services-dropdown");
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target)) {
          dropdown.classList.remove("active");
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Add this to handle escape key to close dropdowns
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        const dropdowns = document.querySelectorAll(".services-dropdown");
        dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Add this to position the dropdown correctly
  useEffect(() => {
    const positionDropdowns = () => {
      const dropdowns = document.querySelectorAll(".services-dropdown");
      dropdowns.forEach((dropdown) => {
        if (dropdown.classList.contains("active")) {
          const button = dropdown.querySelector(".services-toggle");
          const wrapper = dropdown.querySelector(".services-details-wrapper");
          const details = dropdown.querySelector(".services-details");

          if (button && wrapper && details) {
            const rect = button.getBoundingClientRect();
            wrapper.style.top = `${rect.bottom + window.scrollY + 4}px`;
            wrapper.style.left = `${rect.left + window.scrollX}px`;

            // Adjust position if too close to right edge
            const rightEdge = rect.left + details.offsetWidth;
            if (rightEdge > window.innerWidth) {
              wrapper.style.left = `${
                rect.right - details.offsetWidth + window.scrollX
              }px`;
            }
          }
        }
      });
    };

    // Position dropdowns when they're opened
    document.querySelectorAll(".services-toggle").forEach((button) => {
      button.addEventListener("click", () => setTimeout(positionDropdowns, 0));
    });

    // Reposition on scroll or resize
    window.addEventListener("scroll", positionDropdowns);
    window.addEventListener("resize", positionDropdowns);

    return () => {
      window.removeEventListener("scroll", positionDropdowns);
      window.removeEventListener("resize", positionDropdowns);
    };
  }, []);

  return (
    <div className="bookings-page">
      <div className="card-header">
        <h1>Bookings</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingBooking(null);
            setFormData({
              clientId: "",
              date: new Date(),
              services: [{ serviceId: "", hours: 1 }],
              notes: ""
            });
            setBookingDate(new Date());
            setShowForm(!showForm);
            setErrorMessage("");
          }}
        >
          <FaPlus /> New Booking
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="card mb-4">
          <h2>{editingBooking ? "Edit Booking" : "New Booking"}</h2>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label htmlFor="clientId" className="form-label">
                  Client
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <div className="date-picker-container">
                  <DatePicker
                    selected={bookingDate}
                    onChange={handleDateChange}
                    className="form-input"
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                    required
                  />
                  <FaCalendarAlt className="date-picker-icon" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Services</label>
              <div className="services-container">
                {formData.services.map((service, index) => (
                  <div key={index} className="service-row">
                    <div className="service-select">
                      <select
                        name="serviceId"
                        value={service.serviceId}
                        onChange={(e) => handleServiceChange(index, e)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} (${s.hourlyRate}/hr)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="service-hours">
                      <input
                        type="number"
                        name="hours"
                        value={service.hours}
                        onChange={(e) => handleServiceChange(index, e)}
                        className="form-input"
                        min="0.5"
                        step="0.5"
                        required
                      />
                      <span className="hours-label">hours</span>
                    </div>

                    <div className="service-actions">
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          className="btn-icon delete"
                          onClick={() => removeServiceRow(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary add-service-btn"
                  onClick={addServiceRow}
                >
                  <FaPlus /> Add Service
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                rows="3"
              ></textarea>
            </div>

            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-details">
                {formData.services.map((service, index) => {
                  const serviceDetails = services.find(
                    (s) => s.id === parseInt(service.serviceId)
                  );
                  if (serviceDetails && service.hours) {
                    return (
                      <div key={index} className="summary-row">
                        <span>{serviceDetails.name}</span>
                        <span>
                          {service.hours} hrs × ${serviceDetails.hourlyRate}/hr
                          = $
                          {(serviceDetails.hourlyRate * service.hours).toFixed(
                            2
                          )}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingBooking ? "Update Booking" : "Create Booking"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setErrorMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings List */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Services</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const client = clients.find((c) => c.id === booking.clientId);
                  return (
                    <tr key={booking.id}>
                      <td>{formatDate(booking.date)}</td>
                      <td>{client ? client.name : "Unknown Client"}</td>
                      <td>
                        <div className="services-dropdown">
                          <button
                            className="services-toggle"
                            onClick={(e) => {
                              e.preventDefault();
                              const dropdown = e.currentTarget.parentElement;
                              dropdown.classList.toggle("active");
                            }}
                          >
                            <span className="service-count">
                              {booking.services.length}{" "}
                              {booking.services.length === 1
                                ? "service"
                                : "services"}{" "}
                              ▼
                            </span>
                          </button>
                          <div className="services-details-wrapper">
                            <div className="services-details">
                              {booking.services.map((service, index) => {
                                const serviceDetails = services.find(
                                  (s) => s.id === service.serviceId
                                );
                                return (
                                  <div key={index} className="service-item">
                                    <div className="service-main">
                                      <span className="service-name">
                                        {serviceDetails?.name}
                                      </span>
                                      <span className="service-rate">
                                        ${serviceDetails?.hourlyRate}/hr
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                              <div className="service-total">
                                <span>Total:</span>
                                <span>${booking.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>${booking.totalAmount.toFixed(2)}</td>
                      <td>{booking.status}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon edit"
                            onClick={() => handleEdit(booking)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDelete(booking.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
/* Bookings Page Styles */
const styles = document.createElement("style");
styles.textContent = `
  .bookings-page h1 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
  
  .date-picker-container {
    position: relative;
  }
  
  .date-picker-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    pointer-events: none;
  }
  
  .services-container {
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .service-row {
    display: grid;
    grid-template-columns: 1fr 150px 40px;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
  }
  
  .service-hours {
    position: relative;
  }
  
  .hours-label {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  .add-service-btn {
    margin-top: 10px;
  }
  
  .booking-summary {
    background-color: #f9fafb;
    border-radius: 4px;
    padding: 15px;
    margin: 20px 0;
  }
  
  .booking-summary h3 {
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .summary-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    color: #4b5563;
  }
  
  .summary-row.total {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 2px solid #e5e7eb;
    font-weight: 600;
    color: #1f2937;
  }
  
  .summary-row span:last-child {
    font-family: monospace;
  }
  
  .error-message {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  .services-dropdown {
    position: relative;
    display: inline-block;
  }

  .services-toggle {
    background: none;
    border: none;
    color: #3b82f6;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .services-toggle:hover {
    background: #f3f4f6;
  }

  .service-count {
    font-weight: 500;
  }

  .services-details-wrapper {
    position: fixed;
    z-index: 1000;
    display: none;
  }

  .services-dropdown.active .services-details-wrapper {
    display: block;
  }

  .services-details {
    position: absolute;
    top: 0;
    left: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    min-width: 250px;
    padding: 8px;
  }

  .service-item {
    padding: 8px;
    border-bottom: 1px solid #f3f4f6;
  }

  .service-item:last-of-type {
    border-bottom: none;
  }

  .service-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .service-name {
    color: #1f2937;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .service-rate {
    color: #6b7280;
    font-size: 0.85rem;
    font-family: monospace;
    white-space: nowrap;
  }

  .service-total {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 2px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: #1f2937;
  }

  /* Ensure dropdown appears above other elements */
  td {
    position: relative;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .services-details {
      right: 0;
      left: auto;
    }
  }
`;
document.head.appendChild(styles);
