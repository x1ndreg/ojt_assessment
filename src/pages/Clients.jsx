import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingClient) {
      // Update existing client
      updateClient({
        ...editingClient,
        ...formData
      })
      setEditingClient(null)
    } else {
      // Add new client
      addClient(formData)
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    })
    setShowForm(false)
  }
  
  // Handle edit client
  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address
    })
    setShowForm(true)
  }
  
  // Handle delete client
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id)
    }
  }
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  )
  
  return (
    <div className="clients-page">
      <div className="card-header">
        <h1>Client Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingClient(null)
            setFormData({
              name: '',
              email: '',
              phone: '',
              address: ''
            })
            setShowForm(!showForm)
          }}
        >
          <FaPlus /> Add Client
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {/* Client Form */}
      {showForm && (
        <div className="card mb-4">
          <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
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
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingClient ? 'Update Client' : 'Add Client'}
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
      
      {/* Clients List */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{client.address}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleEdit(client)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(client.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No clients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Clients

/* Clients Page Styles */
const styles = document.createElement('style')
styles.textContent = `
  .clients-page h1 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .search-input-container {
    position: relative;
    max-width: 400px;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }
  
  .search-input {
    width: 100%;
    padding: 10px 10px 10px 40px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 5px;
  }
  
  .btn-icon.edit {
    color: #3b82f6;
  }
  
  .btn-icon.delete {
    color: #ef4444;
  }
`
document.head.appendChild(styles) 