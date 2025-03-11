# Note before proceeding :>
I relied heavily on AI to develop this system, but I also took the time to understand the code and make adjustments where needed. I use AI to enhance my efficiency and take full advantage of the tools readily available today, which is why I often find myself immersed in coding. My primary programming languages are HTML, CSS, PHP, and MySQL. For languages like Java and others, I depend on AI for guidance and support.

For this assessment, I chose to work with React, Vite, and Tailwind CSS, even though I had limited prior experience with these technologies. I didn't incorporate a database, as I found integrating one with React more challenging than I anticipated, likely due to my beginner status. Instead, I opted to use localStorage to store data locally on my device. Despite these challenges, I'm eager and determined to continue learning and expanding my skill set.


# Alexis Construction Services Management System

A comprehensive management system for construction services, designed to help Alexis track rates, schedule clients, and manage billing.

## Features

- **Client Management**: Add, edit, and delete client profiles
- **Service Rate Management**: Configure hourly rates for different services
- **Booking System**: Schedule client visits with validation for date availability
- **Service Details**: Add multiple services to bookings with hours calculation
- **Automatic Billing**: Generate billing transactions after successful bookings
- **Inventory Management**: Track available tools and equipment
- **Payment Processing**: Process payments for generated billing transactions
- **Reports**: View billing statements per customer
- **Weekly Schedule**: View and manage weekly appointments

## Technologies Used

- React.js
- React Router for navigation
- Context API for state management
- Local Storage for data persistence
- Date-fns for date manipulation
- React Datepicker for date selection
- React Icons for UI icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/alexis-construction-services.git
```

2. Navigate to the project directory
```
cd alexis-construction-services
```

3. Install dependencies
```
npm install
```

4. Start the development server
```
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Client Management
- Add new clients with their contact information
- Edit existing client details
- Delete clients when needed

### Service Rate Setup
- Configure hourly rates for each service offered
- Update rates as needed

### Booking Management
- Schedule new client visits
- Add multiple services to a booking
- Specify hours for each service
- System automatically calculates total amount
- System validates date availability

### Inventory Tracking
- Add tools and equipment to inventory
- Track quantity and status of items
- Categorize items by service type

### Payment Processing
- View generated invoices
- Process payments for completed services
- Track payment status

### Reporting
- Generate billing statements per customer
- Filter reports by date range
- Print or download reports

## Data Storage

The application uses browser's Local Storage to persist data. This means:
- Data is stored locally in the user's browser
- Data will persist between sessions
- Clearing browser data will reset the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- Date handling by [date-fns](https://date-fns.org/)
- Date picker by [React Datepicker](https://reactdatepicker.com/)
