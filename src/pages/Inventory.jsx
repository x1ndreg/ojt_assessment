import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'

const Inventory = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    status: 'Available',
    notes: ''
  })
  
  // Categories
  const categories = [
    'Plumbing',
    'Electrical',
    'Masonry',
    'Carpentry',
    'General'
  ]
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    })
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingItem) {
      // Update existing item
      updateInventoryItem({
        ...editingItem,
        ...formData
      })
      setEditingItem(null)
    } else {
      // Add new item
      addInventoryItem(formData)
    }
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      quantity: 1,
      status: 'Available',
      notes: ''
    })
    setShowForm(false)
  }
  
  // Handle edit item
  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      status: item.status,
      notes: item.notes || ''
    })
    setShowForm(true)
  }
  
  // Handle delete item
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id)
    }
  }
  
  // Filter inventory based on search term and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })
  
  return (
    <div className="inventory-page">
      <div className="card-header">
        <h1>Inventory Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingItem(null)
            setFormData({
              name: '',
              category: '',
              quantity: 1,
              status: 'Available',
              notes: ''
            })
            setShowForm(!showForm)
          }}
        >
          <FaPlus /> Add Item
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="search-filter-container">
        <div className="search-bar">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-container">
          <label htmlFor="categoryFilter" className="filter-label">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Inventory Form */}
      {showForm && (
        <div className="card mb-4">
          <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Item Name</label>
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
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update Item' : 'Add Item'}
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
      
      {/* Inventory List */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No inventory items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Inventory Summary */}
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">Inventory Summary</h2>
        </div>
        <div className="inventory-summary">
          <div className="summary-cards">
            {categories.map(category => {
              const categoryItems = inventory.filter(item => item.category === category)
              const totalItems = categoryItems.reduce((sum, item) => sum + item.quantity, 0)
              
              return (
                <div key={category} className="summary-card">
                  <h3>{category}</h3>
                  <div className="summary-details">
                    <p>Total Items: {totalItems}</p>
                    <p>Unique Tools: {categoryItems.length}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory

/* Updated Inventory Page Styles */
const styles = document.createElement('style')
styles.textContent = `
  .inventory-page {
    padding: 20px;
    padding-bottom: 40px; /* Add bottom padding to the page */
    height: 100%;
    overflow-y: auto;
  }

  .inventory-page h1 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
  
  .search-filter-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .filter-label {
    font-weight: 500;
    color: #374151;
  }
  
  .filter-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .status-badge.available {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .status-badge.in-use {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .status-badge.maintenance {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .status-badge.out-of-stock {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .inventory-summary {
    padding: 15px;
    padding-bottom: 24px; /* Add padding to summary section */
  }
  
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 16px; /* Add margin to summary cards */
  }
  
  .summary-card {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .summary-card h3 {
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
  }
  
  .summary-details p {
    margin: 5px 0;
    color: #6b7280;
  }

  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px; /* Add margin between cards */
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

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .inventory-page {
      padding-bottom: 60px; /* Increase bottom padding on mobile */
    }

    .card {
      margin-bottom: 30px; /* Increase card margin on mobile */
    }

    .inventory-summary {
      padding-bottom: 32px; /* Increase summary padding on mobile */
    }
  }
`
document.head.appendChild(styles) 