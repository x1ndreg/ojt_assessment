import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaClock, FaUser, FaTools } from 'react-icons/fa'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns'

const Schedule = () => {
  const { bookings, clients } = useAppContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  // Get the days for the current month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  // Navigation functions
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'EEE, MMM d, yyyy')
  }

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    return bookings.filter(booking => isSameDay(new Date(booking.date), date))
  }

  // Handle booking click
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }

  // First, update the calendar header days to be more detailed
  const calendarHeaderDays = [
    { full: 'Sunday' },
    { full: 'Monday' },
    { full: 'Tuesday' },
    { full: 'Wednesday' },
    { full: 'Thursday' },
    { full: 'Friday' },
    { full: 'Saturday' }
  ]

  return (
    <div className="schedule-page">
      <div className="calendar-header">
        <div className="calendar-title">
          <h1>Schedule Calendar</h1>
          <span className="current-month">{format(currentDate, 'MMMM yyyy')}</span>
        </div>
        
        <div className="calendar-navigation">
          <button className="nav-btn" onClick={previousMonth}>
            <FaChevronLeft />
          </button>
          <button className="nav-btn today" onClick={goToToday}>
            <FaCalendarAlt /> Today
          </button>
          <button className="nav-btn" onClick={nextMonth}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header-row">
          {calendarHeaderDays.map(day => (
            <div key={day.short} className="calendar-header-cell">
              <span className="day-name-short">{day.short}</span>
              <span className="day-name-full">{day.full}</span>
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map(day => {
            const dayBookings = getBookingsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={day.toString()}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} 
                          ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="day-header">
                  <span className="day-number">{format(day, 'd')}</span>
                  <span className="day-date">{format(day, 'MMM')}</span>
                  {dayBookings.length > 0 && (
                    <span className="booking-indicator" title={`${dayBookings.length} bookings`}>
                      {dayBookings.length}
                    </span>
                  )}
                </div>
                <div className="day-content">
                  {dayBookings.map(booking => {
                    const client = clients.find(c => c.id === booking.clientId)
                    return (
                      <div
                        key={booking.id}
                        className={`calendar-booking ${booking.status.toLowerCase()}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookingClick(booking)
                        }}
                      >
                        <div className="booking-time">
                          <FaClock /> {format(new Date(booking.date), 'HH:mm')}
                        </div>
                        <div className="booking-info">
                          <span className="booking-client">
                            <FaUser /> {client?.name}
                          </span>
                          <span className="booking-services">
                            {booking.services.length} service{booking.services.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowBookingDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="close-btn" onClick={() => setShowBookingDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="booking-detail-section">
                <div className="detail-header">
                  <FaCalendarAlt />
                  <h3>Date & Time</h3>
                </div>
                <p>{formatDate(new Date(selectedBooking.date))}</p>
              </div>

              <div className="booking-detail-section">
                <div className="detail-header">
                  <FaUser />
                  <h3>Client Information</h3>
                </div>
                {(() => {
                  const client = clients.find(c => c.id === selectedBooking.clientId)
                  return client ? (
                    <div className="client-info">
                      <p className="client-name">{client.name}</p>
                      <p>{client.phone}</p>
                      <p>{client.email}</p>
                    </div>
                  ) : (
                    <p>Client information not available</p>
                  )
                })()}
              </div>

              <div className="booking-detail-section">
                <div className="detail-header">
                  <FaTools />
                  <h3>Services</h3>
                </div>
                <div className="services-list">
                  {selectedBooking.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <div className="service-info">
                        <span className="service-name">{service.name}</span>
                        <span className="service-hours">{service.hours} hours</span>
                      </div>
                      <span className="service-amount">${service.amount?.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="total-amount">
                    <span>Total Amount:</span>
                    <span>${selectedBooking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="booking-status-section">
                <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule

/* Updated Schedule Styles */
const styles = document.createElement('style')
styles.textContent = `
  .schedule-page {
    padding: 24px;
    padding-bottom: 40px;
    min-height: 100%;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .calendar-title h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #1f2937;
  }

  .current-month {
    font-size: 1.2rem;
    color: #6b7280;
    margin-top: 4px;
  }

  .calendar-navigation {
    display: flex;
    gap: 8px;
  }

  .nav-btn {
    padding: 8px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    color: #4b5563;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .nav-btn:hover {
    background: #f9fafb;
  }

  .nav-btn.today {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .calendar-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .calendar-header-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }

  .calendar-header-cell {
    padding: 16px;
    text-align: center;
    font-weight: 600;
    color: #64748b;
    border-right: 1px solid #e5e7eb;
  }

  .calendar-header-cell:last-child {
    border-right: none;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .calendar-day {
    min-height: 150px;
    padding: 12px;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    background: white;
  }

  .calendar-day:nth-child(7n) {
    border-right: none;
  }

  .calendar-day.other-month {
    background: #f8fafc;
  }

  .calendar-day.today {
    background: #eff6ff;
  }

  .calendar-day.selected {
    background: #dbeafe;
  }

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .day-number {
    font-weight: 600;
    font-size: 1.1rem;
    color: #1f2937;
  }

  .other-month .day-number {
    color: #94a3b8;
  }

  .booking-indicator {
    background: #3b82f6;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .day-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .calendar-booking {
    padding: 8px;
    background: #f0f9ff;
    border-left: 3px solid #3b82f6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .calendar-booking:hover {
    transform: translateX(2px);
  }

  .calendar-booking.scheduled {
    background: #f0f9ff;
    border-left-color: #3b82f6;
  }

  .calendar-booking.completed {
    background: #f0fdf4;
    border-left-color: #22c55e;
  }

  .calendar-booking.cancelled {
    background: #fef2f2;
    border-left-color: #ef4444;
  }

  .booking-time {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #3b82f6;
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: 4px;
  }

  .booking-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .booking-client {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #1f2937;
    font-size: 0.875rem;
  }

  .booking-services {
    color: #6b7280;
    font-size: 0.75rem;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    background: white;
    border-radius: 12px 12px 0 0;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #1f2937;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: #6b7280;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .modal-body {
    padding: 24px;
  }

  .booking-detail-section {
    margin-bottom: 24px;
  }

  .booking-detail-section:last-child {
    margin-bottom: 0;
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .detail-header svg {
    color: #3b82f6;
  }

  .detail-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #1f2937;
    font-weight: 600;
  }

  .client-info {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
  }

  .client-info p {
    margin: 4px 0;
    color: #4b5563;
  }

  .client-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 1.1rem;
  }

  .services-list {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .service-item {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .service-item:last-child {
    border-bottom: none;
  }

  .service-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .service-name {
    font-weight: 500;
    color: #1f2937;
  }

  .service-hours {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .service-amount {
    font-weight: 600;
    color: #059669;
  }

  .total-amount {
    padding: 16px;
    background: #f8fafc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: #1f2937;
    border-top: 1px solid #e5e7eb;
  }

  .booking-status-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
  }

  .status-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.875rem;
  }

  .status-badge.scheduled {
    background: #dbeafe;
    color: #1e40af;
  }

  .status-badge.completed {
    background: #dcfce7;
    color: #166534;
  }

  .status-badge.cancelled {
    background: #fee2e2;
    color: #991b1b;
  }

  @media (max-width: 1024px) {
    .calendar-header-cell {
      padding: 12px 8px;
      font-size: 0.875rem;
    }

    .calendar-day {
      min-height: 120px;
    }
  }

  @media (max-width: 768px) {
    .schedule-page {
      padding: 16px;
    }

    .calendar-title h1 {
      font-size: 1.5rem;
    }

    .current-month {
      font-size: 1rem;
    }

    .nav-btn {
      padding: 6px 12px;
    }

    .calendar-day {
      min-height: 100px;
      padding: 8px;
    }

    .day-number {
      font-size: 1rem;
    }

    .calendar-booking {
      padding: 6px;
    }

    .booking-time {
      font-size: 0.75rem;
    }

    .booking-client {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 640px) {
    .modal-content {
      max-height: 100vh;
      border-radius: 0;
    }

    .modal-header {
      padding: 16px;
    }

    .modal-body {
      padding: 16px;
    }

    .service-item {
      padding: 12px;
    }

    .total-amount {
      padding: 12px;
    }
  }
`
document.head.appendChild(styles) 