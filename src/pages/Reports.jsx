import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { FaFileAlt, FaDownload, FaPrint } from 'react-icons/fa'

const Reports = () => {
  const { clients, bookings, payments } = useAppContext()
  const [selectedClient, setSelectedClient] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  
  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange({
      ...dateRange,
      [name]: value
    })
  }
  
  // Filter payments based on selected client and date range
  const filteredPayments = payments.filter(payment => {
    const matchesClient = selectedClient === '' || payment.clientId === parseInt(selectedClient)
    
    let matchesDateRange = true
    if (dateRange.startDate && dateRange.endDate) {
      const paymentDate = new Date(payment.createdAt)
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      endDate.setHours(23, 59, 59) // Set to end of day
      
      matchesDateRange = paymentDate >= startDate && paymentDate <= endDate
    }
    
    return matchesClient && matchesDateRange
  })
  
  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const paidAmount = filteredPayments
    .filter(payment => payment.status === 'Paid')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const unpaidAmount = filteredPayments
    .filter(payment => payment.status === 'Unpaid')
    .reduce((sum, payment) => sum + payment.amount, 0)
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Handle print report
  const handlePrint = () => {
    window.print()
  }
  
  // Handle download report
  const handleDownload = () => {
    // In a real application, this would generate a PDF or CSV file
    alert('This would download the report as a PDF or CSV file in a real application.')
  }
  
  return (
    <div className="reports-page">
      <div className="card-header">
        <h1>Reports</h1>
      </div>
      
      {/* Report Filters */}
      <div className="card mb-4">
        <h2>Billing Statement Report</h2>
        <div className="report-filters">
          <div className="form-group">
            <label htmlFor="selectedClient" className="form-label">Client</label>
            <select
              id="selectedClient"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="form-input"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="form-input"
            />
          </div>
        </div>
        
        <div className="report-actions">
          <button className="btn btn-secondary" onClick={handlePrint}>
            <FaPrint /> Print Report
          </button>
          <button className="btn btn-secondary" onClick={handleDownload}>
            <FaDownload /> Download Report
          </button>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="card report-content">
        <div className="report-header">
          <div className="report-title">
            <FaFileAlt className="report-icon" />
            <h2>Billing Statement Report</h2>
          </div>
          <div className="report-meta">
            <p><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</p>
            <p>
              <strong>Client:</strong> {
                selectedClient 
                  ? clients.find(c => c.id === parseInt(selectedClient))?.name 
                  : 'All Clients'
              }
            </p>
            {dateRange.startDate && dateRange.endDate && (
              <p>
                <strong>Period:</strong> {dateRange.startDate} to {dateRange.endDate}
              </p>
            )}
          </div>
        </div>
        
        <div className="report-summary">
          <div className="summary-card">
            <h3>Total Invoices</h3>
            <p className="summary-value">{filteredPayments.length}</p>
          </div>
          <div className="summary-card">
            <h3>Total Amount</h3>
            <p className="summary-value">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Paid Amount</h3>
            <p className="summary-value">${paidAmount.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Unpaid Amount</h3>
            <p className="summary-value">${unpaidAmount.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Services</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => {
                  const client = clients.find(c => c.id === payment.clientId)
                  const booking = bookings.find(b => b.id === payment.bookingId)
                  
                  return (
                    <tr key={payment.id}>
                      <td>INV-{payment.id}</td>
                      <td>{client ? client.name : 'Unknown Client'}</td>
                      <td>{formatDate(payment.createdAt)}</td>
                      <td>{booking ? booking.services.length : 0} services</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${payment.status.toLowerCase()}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No invoices found for the selected criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports

/* Reports Page Styles */
const styles = document.createElement('style')
styles.textContent = `
  .reports-page h1 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
  
  .report-filters {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .report-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .report-content {
    padding: 30px;
  }
  
  .report-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .report-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .report-icon {
    font-size: 2rem;
    color: #3b82f6;
  }
  
  .report-title h2 {
    font-size: 1.5rem;
    color: #1f2937;
  }
  
  .report-meta p {
    margin: 5px 0;
    text-align: right;
  }
  
  .report-summary {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .summary-card {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    text-align: center;
  }
  
  .summary-card h3 {
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
  }
  
  .summary-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  /* Print styles */
  @media print {
    body * {
      visibility: hidden;
    }
    
    .report-content, .report-content * {
      visibility: visible;
    }
    
    .report-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    
    .report-actions {
      display: none;
    }
  }
`
document.head.appendChild(styles) 