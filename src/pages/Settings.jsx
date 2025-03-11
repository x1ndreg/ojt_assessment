import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const Settings = () => {
  const { services, addService, updateService, deleteService } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    hourlyRate: ''
  })
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'hourlyRate' ? parseFloat(value) || '' : value
    })
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingService) {
      // Update existing service
      updateService({
        ...editingService,
        ...formData
      })
      setEditingService(null)
    } else {
      // Add new service
      addService(formData)
    }
    
    // Reset form
    setFormData({
      name: '',
      hourlyRate: ''
    })
    setShowForm(false)
  }
  
  // Handle edit service
  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      hourlyRate: service.hourlyRate
    })
    setShowForm(true)
  }
  
  // Handle delete service
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id)
    }
  }
  
  return (
    <div className="settings-page">
      <div className="card-header">
        <h1>Settings</h1>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Service Rates</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setEditingService(null)
              setFormData({
                name: '',
                hourlyRate: ''
              })
              setShowForm(!showForm)
            }}
          >
            <FaPlus /> Add Service
          </button>
        </div>
        
        {/* Service Form */}
        {showForm && (
          <div className="service-form mb-4">
            <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Service Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="hourlyRate" className="form-label">Hourly Rate ($)</label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Services List */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Hourly Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map(service => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>${service.hourlyRate.toFixed(2)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleEdit(service)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(service.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No services found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Other settings sections can be added here */}
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">Company Information</h2>
        </div>
        <div className="company-info">
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-input"
              defaultValue="Alexis Construction Services"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              className="form-input"
              defaultValue="alexis@construction.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              className="form-input"
              defaultValue="123-456-7890"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

/* Settings Page Styles */
const styles = document.createElement('style')
styles.textContent = `
  .settings-page h1 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
  
  .service-form {
    padding: 20px;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    margin: 0 -20px 20px;
  }
  
  .service-form h3 {
    margin-bottom: 15px;
    font-size: 1.2rem;
  }
  
  .company-info {
    padding: 20px 0;
  }
`
document.head.appendChild(styles) 