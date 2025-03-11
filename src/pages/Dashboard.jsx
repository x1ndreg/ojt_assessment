import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { FaUsers, FaCalendarAlt, FaTools, FaMoneyBillWave } from 'react-icons/fa'

const Dashboard = () => {
  const { clients, bookings, inventory, payments } = useAppContext()

  // Format date consistently across the application
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculate statistics
  const totalClients = clients.length
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.date) >= new Date() && booking.status === 'Scheduled'
  ).length
  const totalInventoryItems = inventory.reduce((acc, item) => acc + item.quantity, 0)
  const unpaidInvoices = payments.filter(payment => payment.status === 'Unpaid').length
  
  // Calculate revenue
  const totalRevenue = payments
    .filter(payment => payment.status === 'Paid')
    .reduce((acc, payment) => acc + payment.amount, 0)

  // Get upcoming bookings for the next 7 days
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  
  const thisWeekBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date)
    return bookingDate >= today && bookingDate <= nextWeek
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="date-display">Today: {formatDate(new Date())}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Total Clients Card */}
        <div className="stats-card">
          <div className="stats-content">
            <div className="stats-icon-wrapper clients">
              <FaUsers className="stats-icon" />
            </div>
            <div className="stats-details">
              <span className="stats-label">Total Clients</span>
              <h3 className="stats-number">{totalClients}</h3>
              <span className="stats-trend positive">+{clients.filter(c => {
                const createdDate = new Date(c.createdAt);
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                return createdDate > lastMonth;
              }).length} this month</span>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings Card */}
        <div className="stats-card">
          <div className="stats-content">
            <div className="stats-icon-wrapper bookings">
              <FaCalendarAlt className="stats-icon" />
            </div>
            <div className="stats-details">
              <span className="stats-label">Upcoming Bookings</span>
              <h3 className="stats-number">{upcomingBookings}</h3>
              <span className="stats-trend">Next 7 days</span>
            </div>
          </div>
        </div>

        {/* Inventory Items Card */}
        <div className="stats-card">
          <div className="stats-content">
            <div className="stats-icon-wrapper inventory">
              <FaTools className="stats-icon" />
            </div>
            <div className="stats-details">
              <span className="stats-label">Inventory Items</span>
              <h3 className="stats-number">{totalInventoryItems}</h3>
              <span className="stats-trend">Total quantity</span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="stats-card revenue">
          <div className="stats-content">
            <div className="stats-icon-wrapper revenue">
              <FaMoneyBillWave className="stats-icon" />
            </div>
            <div className="stats-details">
              <span className="stats-label">Total Revenue</span>
              <h3 className="stats-number">${totalRevenue.toFixed(2)}</h3>
              <div className="revenue-details">
                <div className="revenue-item">
                  <span className="revenue-dot paid"></span>
                  <span className="revenue-text">
                    ${payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0).toFixed(2)} paid
                  </span>
                </div>
                <div className="revenue-item">
                  <span className="revenue-dot unpaid"></span>
                  <span className="revenue-text">
                    ${payments.filter(p => p.status === 'Unpaid').reduce((acc, p) => acc + p.amount, 0).toFixed(2)} pending
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="stats-footer">
            <div className="unpaid-indicator">
              <span className="indicator-label">{unpaidInvoices} unpaid invoices</span>
              <Link to="/payments" className="indicator-link">View all →</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Bookings */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Bookings</h2>
            <Link to="/bookings" className="btn btn-primary">View All</Link>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Services</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {thisWeekBookings.length > 0 ? (
                  thisWeekBookings.map(booking => {
                    const client = clients.find(c => c.id === booking.clientId)
                    return (
                      <tr key={booking.id}>
                        <td>{formatDate(booking.date)}</td>
                        <td>{client ? client.name : 'Unknown Client'}</td>
                        <td>{booking.services.length} services</td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No upcoming bookings</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Unpaid Invoices */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Unpaid Invoices</h2>
            <Link to="/payments" className="btn btn-primary">View All</Link>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.filter(payment => payment.status === 'Unpaid').length > 0 ? (
                  payments
                    .filter(payment => payment.status === 'Unpaid')
                    .slice(0, 5)
                    .map(payment => {
                      const client = clients.find(c => c.id === payment.clientId)
                      return (
                        <tr key={payment.id}>
                          <td>INV-{payment.id}</td>
                          <td>{client ? client.name : 'Unknown Client'}</td>
                          <td>${payment.amount.toFixed(2)}</td>
                          <td>{formatDate(payment.createdAt)}</td>
                          <td>
                            <Link to={`/payments/${payment.id}`} className="btn btn-secondary">
                              Process
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No unpaid invoices</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

/* Updated Dashboard Styles */
const styles = document.createElement('style')
styles.textContent = `
  .dashboard {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 40px;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .dashboard-header h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .date-display {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stats-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .stats-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .stats-content {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .stats-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stats-icon-wrapper.clients {
    background-color: #e0f2fe;
    color: #0284c7;
  }

  .stats-icon-wrapper.bookings {
    background-color: #f0fdf4;
    color: #16a34a;
  }

  .stats-icon-wrapper.inventory {
    background-color: #fef3c7;
    color: #d97706;
  }

  .stats-icon-wrapper.revenue {
    background-color: #f3e8ff;
    color: #7e22ce;
  }

  .stats-icon {
    font-size: 1.5rem;
  }

  .stats-details {
    flex-grow: 1;
  }

  .stats-label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .stats-number {
    font-size: 2rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    line-height: 1;
  }

  .stats-trend {
    display: inline-block;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .stats-trend.positive {
    color: #16a34a;
  }

  .stats-trend.negative {
    color: #dc2626;
  }

  .revenue-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .revenue-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .revenue-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .revenue-dot.paid {
    background-color: #16a34a;
  }

  .revenue-dot.unpaid {
    background-color: #dc2626;
  }

  .revenue-text {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .stats-footer {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }

  .unpaid-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .indicator-label {
    font-size: 0.875rem;
    color: #dc2626;
  }

  .indicator-link {
    font-size: 0.875rem;
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .indicator-link:hover {
    color: #1f2937;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 40px;
  }

  .dashboard-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
  }

  .card-header h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .table-container {
    overflow-x: auto;
    padding-bottom: 16px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
  }

  th {
    background-color: #f9fafb;
    padding: 12px 16px;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    padding: 12px 16px;
    font-size: 0.875rem;
    color: #1f2937;
    border-bottom: 1px solid #e5e7eb;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .status-badge.scheduled {
    background-color: #f0fdf4;
    color: #16a34a;
  }

  .status-badge.completed {
    background-color: #e0f2fe;
    color: #0284c7;
  }

  .status-badge.cancelled {
    background-color: #fef2f2;
    color: #dc2626;
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stats-number {
      font-size: 1.75rem;
    }

    .dashboard {
      padding-bottom: 60px;
    }

    .dashboard-card {
      margin-bottom: 30px;
    }
  }
`
document.head.appendChild(styles) 