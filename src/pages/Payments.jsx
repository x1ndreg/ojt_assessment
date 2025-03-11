import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import {
  FaSearch,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaPrint
} from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";

const Payments = () => {
  const { clients, bookings, payments, processPayment } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInvoiceData = async () => {
      setIsLoading(true);
      if (id) {
        const payment = payments.find((p) => p.id.toString() === id);
        if (payment) {
          const client = clients.find((c) => c.id === payment.clientId);
          const booking = bookings.find((b) => b.id === payment.bookingId);
          if (client && booking) {
            setSelectedPayment({
              ...payment,
              client,
              booking: {
                ...booking,
                services: booking.services.map((service) => ({
                  name: service.name,
                  hours: service.hours || 1,
                  rate: service.rate || 75,
                  amount: service.rate
                    ? service.rate * service.hours
                    : service.amount
                }))
              }
            });
          } else {
            navigate("/payments");
          }
        } else {
          navigate("/payments");
        }
      }
      setIsLoading(false);
    };

    loadInvoiceData();
  }, [id, payments, clients, bookings, navigate]);

  // Handle process payment
  const handleProcessPayment = (paymentId) => {
    if (window.confirm("Are you sure you want to mark this invoice as paid?")) {
      processPayment(paymentId);
      setSelectedPayment(null);
      navigate("/payments");
    }
  };

  // Filter payments based on search term and status
  const filteredPayments = payments.filter((payment) => {
    const client = clients.find((c) => c.id === payment.clientId);
    const clientName = client ? client.name.toLowerCase() : "";

    const matchesSearch =
      clientName.includes(searchTerm.toLowerCase()) ||
      payment.id.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update the handleViewInvoice function
  const handleViewInvoice = async (payment) => {
    const client = clients.find((c) => c.id === payment.clientId);
    const booking = bookings.find((b) => b.id === payment.bookingId);

    // Set the selected payment before navigation
    setSelectedPayment({
      ...payment,
      client,
      booking: {
        ...booking,
        services: booking.services.map((service) => ({
          name: service.name,
          hours: service.hours || 1,
          rate: service.rate || 75,
          amount: service.rate ? service.rate * service.hours : service.amount
        }))
      }
    });

    // Use replace instead of push to avoid navigation issues
    navigate(`/payments/${payment.id}`, { replace: true });
  };

  return (
    <div className="payments-page">
      {id ? (
        <div className="payment-details">
          <div className="card-header">
            <div className="header-content">
              <h1>Invoice Details</h1>
            </div>
            <div className="header-actions">
              <Link to="/payments" className="action-btn back-btn">
                Back to Invoices
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                Loading invoice...
              </div>
            </div>
          ) : selectedPayment ? (
            <div className="card invoice-card">
              <div className="invoice-header">
                <div className="invoice-company">
                  <h2>Alexis Construction Services</h2>
                  <p>123 Construction Ave</p>
                  <p>Building City, BC 12345</p>
                  <p>Phone: (123) 456-7890</p>
                  <p>Email: alexis@construction.com</p>
                </div>
                <div className="invoice-info">
                  <h2 className="invoice-title">INVOICE</h2>
                  <div className="invoice-number">
                    <p>
                      <strong>Invoice #:</strong> INV-{selectedPayment.id}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedPayment.createdAt)}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`status-badge ${selectedPayment.status.toLowerCase()}`}
                      >
                        {selectedPayment.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="invoice-client">
                <h3>Bill To:</h3>
                {selectedPayment.client && (
                  <div className="client-details">
                    <p className="client-name">{selectedPayment.client.name}</p>
                    <p>{selectedPayment.client.address}</p>
                    <p>Phone: {selectedPayment.client.phone}</p>
                    <p>Email: {selectedPayment.client.email}</p>
                  </div>
                )}
              </div>

              <div className="invoice-services">
                <h3>Services Rendered:</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Hours</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPayment?.booking?.services?.map(
                        (service, index) => (
                          <tr key={index}>
                            <td>{service.name || "Service"}</td>
                            <td className="text-center">{service.hours}</td>
                            <td className="text-center">
                              ${service.rate.toFixed(2)}/hr
                            </td>
                            <td className="text-right">
                              ${(service.hours * service.rate).toFixed(2)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td colSpan="3" className="text-right">
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-right">
                          $
                          {selectedPayment?.booking?.services
                            ?.reduce(
                              (sum, service) =>
                                sum + service.hours * service.rate,
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                      <tr className="total-row">
                        <td colSpan="3" className="text-right">
                          <strong>Tax (5%):</strong>
                        </td>
                        <td className="text-right">
                          $
                          {(
                            selectedPayment?.booking?.services?.reduce(
                              (sum, service) =>
                                sum + service.hours * service.rate,
                              0
                            ) * 0.05
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="total-row">
                        <td colSpan="3" className="text-right">
                          <strong>Total:</strong>
                        </td>
                        <td className="text-right total-amount">
                          $
                          {(
                            selectedPayment?.booking?.services?.reduce(
                              (sum, service) =>
                                sum + service.hours * service.rate,
                              0
                            ) * 1.05
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="invoice-notes">
                <h3>Payment Terms & Notes:</h3>
                <div className="terms-list">
                  <p>1. Payment is due within 30 days of invoice date</p>
                  <p>2. Please include invoice number with your payment</p>
                  <p>3. Make checks payable to Alexis Construction Services</p>
                </div>
                <div className="thank-you-note">
                  <p>Thank you for your business!</p>
                </div>
              </div>

              {selectedPayment.status === "Unpaid" && (
                <div className="invoice-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleProcessPayment(selectedPayment.id)}
                  >
                    <FaCheckCircle /> Mark as Paid
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="error-message">Invoice not found</div>
          )}
        </div>
      ) : (
        // Payments List View
        <>
          <div className="card-header">
            <h1>Invoices</h1>
          </div>

          {/* Search and Filter */}
          <div className="search-filter-container">
            <div className="search-bar">
              <div className="search-input-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filter-container">
              <label htmlFor="statusFilter" className="filter-label">
                Filter by Status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Payments List */}
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => {
                      const client = clients.find(
                        (c) => c.id === payment.clientId
                      );
                      return (
                        <tr key={payment.id}>
                          <td>INV-{payment.id}</td>
                          <td>{client ? client.name : "Unknown Client"}</td>
                          <td>${payment.amount.toFixed(2)}</td>
                          <td>{formatDate(payment.createdAt)}</td>
                          <td>
                            <span
                              className={`status-badge ${payment.status.toLowerCase()}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view-btn"
                                onClick={() => handleViewInvoice(payment)}
                                title="View Invoice"
                              >
                                <FaFileInvoiceDollar />
                                <span>View</span>
                              </button>
                              {payment.status === "Unpaid" && (
                                <button
                                  className="action-btn process-btn"
                                  onClick={() =>
                                    handleProcessPayment(payment.id)
                                  }
                                  title="Process Payment"
                                >
                                  <FaCheckCircle />
                                  <span>Process</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="card mt-4">
            <div className="card-header">
              <h2 className="card-title">Payment Summary</h2>
            </div>
            <div className="payment-summary">
              <div className="summary-cards">
                <div className="summary-card">
                  <h3>Total Invoices</h3>
                  <p className="summary-value">{payments.length}</p>
                </div>
                <div className="summary-card">
                  <h3>Unpaid Invoices</h3>
                  <p className="summary-value">
                    {payments.filter((p) => p.status === "Unpaid").length}
                  </p>
                </div>
                <div className="summary-card">
                  <h3>Paid Invoices</h3>
                  <p className="summary-value">
                    {payments.filter((p) => p.status === "Paid").length}
                  </p>
                </div>
                <div className="summary-card">
                  <h3>Total Revenue</h3>
                  <p className="summary-value">
                    $
                    {payments
                      .filter((p) => p.status === "Paid")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Payments;

/* Updated Payments Page Styles */
const styles = document.createElement("style");
styles.textContent = `
  .payments-page {
    padding: 20px;
    padding-bottom: 40px; /* Add bottom padding to the page */
    height: 100%;
    overflow-y: auto;
  }

  .payments-page h1 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }

  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px; /* Add margin between cards */
    padding: 20px;
  }

  .table-container {
    overflow-x: auto;
    padding-bottom: 16px; /* Add padding at the bottom of tables */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px; /* Add margin at the bottom of tables */
  }

  tbody tr:last-child td {
    border-bottom: none; /* Remove border from last row */
    padding-bottom: 20px; /* Add padding to last row */
  }

  .payment-summary {
    padding: 15px 0 24px; /* Add padding to bottom of summary section */
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 16px; /* Add margin to summary cards */
  }

  /* Invoice Details specific spacing */
  .payment-details .card {
    padding: 30px;
    margin-bottom: 40px;
  }

  .invoice-header {
    margin-bottom: 30px;
    padding-bottom: 20px;
  }

  .invoice-client {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
  }

  .invoice-services {
    margin-bottom: 30px;
    padding-bottom: 20px;
  }

  .invoice-notes {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
  }

  .invoice-actions {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }

  /* Search and filter spacing */
  .search-filter-container {
    margin-bottom: 24px;
    gap: 20px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .payments-page {
      padding-bottom: 60px; /* Increase bottom padding on mobile */
    }

    .card {
      margin-bottom: 30px; /* Increase card margin on mobile */
    }

    .payment-summary {
      padding-bottom: 32px; /* Increase summary padding on mobile */
    }

    .payment-details .card {
      padding: 20px;
      margin-bottom: 50px;
    }
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .status-badge.paid {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #34d399;
  }
  
  .status-badge.unpaid {
    background-color: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fca5a5;
  }
  
  .btn-icon.view {
    color: #6366f1;
  }
  
  .btn-icon.process {
    color: #10b981;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn svg {
    font-size: 1rem;
  }

  .action-btn span {
    display: inline-block;
  }

  .action-btn.view-btn {
    background-color: #eef2ff;
    color: #4f46e5;
  }

  .action-btn.view-btn:hover {
    background-color: #e0e7ff;
  }

  .action-btn.process-btn {
    background-color: #ecfdf5;
    color: #059669;
  }

  .action-btn.process-btn:hover {
    background-color: #d1fae5;
  }

  /* Table enhancements */
  .table-container {
    border-radius: 8px;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  th {
    background-color: #f8fafc;
    padding: 12px 16px;
    font-weight: 600;
    color: #475569;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    color: #1e293b;
  }

  tr:last-child td {
    border-bottom: none;
  }

  /* Amount column styling */
  td:nth-child(3) {
    font-weight: 600;
    color: #0f172a;
  }

  /* Invoice number styling */
  td:first-child {
    font-family: monospace;
    color: #6366f1;
    font-weight: 500;
  }

  /* Hover effect on rows */
  tbody tr {
    transition: background-color 0.2s ease;
  }

  tbody tr:hover {
    background-color: #f8fafc;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .action-btn span {
      display: none;
    }

    .action-btn {
      padding: 8px;
    }

    td {
      padding: 12px;
    }
  }

  @media (max-width: 640px) {
    .status-badge {
      padding: 4px 8px;
    }
  }
  
  /* Invoice Details Styles */
  .payment-details {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .invoice-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .invoice-company {
    color: #1f2937;
  }

  .invoice-company h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .invoice-company p {
    margin: 4px 0;
    color: #4b5563;
    font-size: 0.95rem;
  }
  
  .invoice-info {
    text-align: right;
  }
  
  .invoice-title {
    font-size: 2rem;
    color: #3b82f6;
    font-weight: 700;
    margin-bottom: 20px;
    letter-spacing: 0.05em;
  }

  .invoice-number {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .invoice-number p {
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #4b5563;
  }

  .invoice-number strong {
    color: #1f2937;
  }
  
  .invoice-client {
    background: #f8fafc;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 32px;
    border: 1px solid #e5e7eb;
  }
  
  .invoice-client h3 {
    color: #1f2937;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .invoice-client p {
    margin: 6px 0;
    color: #4b5563;
  }

  .invoice-client strong {
    color: #1f2937;
  }
  
  .invoice-services {
    margin-bottom: 32px;
  }
  
  .invoice-services h3 {
    color: #1f2937;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .invoice-services table {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .invoice-services th {
    background: #f8fafc;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
  }

  .invoice-services td {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .invoice-services tr:last-child td {
    border-bottom: none;
  }

  .invoice-services tfoot {
    background: #f8fafc;
    border-top: 2px solid #e5e7eb;
  }

  .invoice-services tfoot td {
    padding: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .text-right {
    text-align: right;
  }
  
  .invoice-notes {
    background: #fffbeb;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #fcd34d;
    margin-bottom: 32px;
  }
  
  .invoice-notes h3 {
    color: #92400e;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .invoice-notes p {
    color: #92400e;
    margin: 0;
    font-size: 0.95rem;
  }
  
  .invoice-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
  }

  .invoice-actions .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  .invoice-actions .btn-primary {
    background: #3b82f6;
    color: white;
    border: none;
  }

  .invoice-actions .btn-primary:hover {
    background: #2563eb;
  }

  .invoice-actions .btn svg {
    font-size: 1.1rem;
  }

  /* Status badge in invoice */
  .invoice-number .status-badge {
    margin-left: 8px;
  }

  /* Print styles for invoice */
  @media print {
    .payment-details {
      padding: 0;
    }

    .card-header,
    .invoice-actions {
      display: none;
    }

    .card {
      box-shadow: none;
      border: none;
    }

    .invoice-notes {
      break-inside: avoid;
    }
  }

  /* Responsive styles for invoice */
  @media (max-width: 768px) {
    .invoice-header {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .invoice-info {
      text-align: left;
    }

    .invoice-number p {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .invoice-services {
      overflow-x: auto;
    }

    .invoice-services table {
      min-width: 600px;
    }

    .invoice-actions {
      flex-direction: column;
    }

    .invoice-actions .btn {
      width: 100%;
      justify-content: center;
    }
  }

  /* Enhanced table styles for services */
  .invoice-services th:last-child,
  .invoice-services td:last-child {
    text-align: right;
  }

  .invoice-services td:nth-child(2),
  .invoice-services td:nth-child(3) {
    text-align: center;
  }

  .invoice-services tfoot td:last-child {
    font-size: 1.1rem;
    color: #3b82f6;
  }

  .invoice-card {
    padding: 40px;
    background: white;
    border: 1px solid #e5e7eb;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .invoice-payment-details {
    background: #f8fafc;
    padding: 24px;
    border-radius: 8px;
    margin: 32px 0;
    border: 1px solid #e5e7eb;
  }

  .bank-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .bank-details p {
    margin: 0;
    color: #4b5563;
  }

  .terms-list {
    margin: 16px 0;
  }

  .terms-list p {
    margin: 8px 0;
    color: #92400e;
  }

  .thank-you-note {
    margin-top: 16px;
    font-style: italic;
  }

  .total-row {
    background: #f8fafc;
    font-size: 1.1rem;
  }

  .total-amount {
    color: #3b82f6;
    font-weight: 700;
  }
  
  .client-details {
    display: grid;
    gap: 8px;
  }

  .client-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
  }

  @media print {
    .invoice-card {
      border: none;
      padding: 0;
    }

    .header-content,
    .invoice-actions {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .invoice-card {
      padding: 20px;
    }

    .bank-details {
      grid-template-columns: 1fr;
    }
  }

  .invoice-services table th,
  .invoice-services table td {
    padding: 16px;
    text-align: left;
  }

  .invoice-services table th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
  }

  .text-center {
    text-align: center !important;
  }

  .text-right {
    text-align: right !important;
  }

  .total-row {
    background: #f8fafc;
  }

  .total-row td {
    padding: 12px 16px;
  }

  .total-row:last-child td {
    font-weight: 700;
    color: #1f2937;
  }

  .total-row:last-child td.total-amount {
    color: #3b82f6;
    font-size: 1.1rem;
  }

  .invoice-services table td {
    color: #1f2937;
  }

  .invoice-services table tr:hover {
    background-color: #f8fafc;
  }

  @media print {
    .invoice-services table th {
      background-color: #f8fafc !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .total-row {
      background-color: #f8fafc !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: #6b7280;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 8px;
    color: #ef4444;
    font-size: 1.1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(styles);
