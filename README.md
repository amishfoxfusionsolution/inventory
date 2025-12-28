# InventoryPro - Complete Inventory Management System

A professional, production-ready inventory management system built with React, TypeScript, Supabase, and Tailwind CSS. Designed for businesses of all types including retail, e-commerce, manufacturing, warehouses, and service providers.

![InventoryPro](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### Core Functionality

- **User Authentication & Authorization**
  - Secure email/password authentication
  - Role-based access control (Admin, Manager, Viewer)
  - Multi-tenant support for multiple organizations
  - User profile management

- **Dashboard Overview**
  - Real-time metrics and KPIs
  - Total inventory value tracking
  - Low stock alerts
  - Stock movement trends
  - Interactive data visualizations

- **Inventory Management**
  - Complete CRUD operations for inventory items
  - SKU and barcode support
  - Category and subcategory organization
  - Supplier management
  - Location/warehouse tracking
  - Customizable reorder levels
  - Multiple unit types (pieces, kg, lbs, etc.)
  - Status tracking (active, discontinued, out of stock)
  - Grid and list view options

- **Categories & Suppliers**
  - Dynamic category management with color coding
  - Supplier CRM with contact information
  - Lead time tracking
  - Purchase history

- **Stock Operations**
  - Inbound stock recording
  - Outbound stock management
  - Stock transfers between locations
  - Inventory adjustments
  - Complete movement history

- **Alerts & Notifications**
  - Low stock alerts with severity levels
  - Expiry date warnings
  - Reorder suggestions
  - Real-time notification system

- **Reports & Analytics**
  - Inventory valuation reports
  - Stock movement analysis
  - Top items by stock
  - Category breakdown
  - CSV export functionality

- **Settings**
  - User profile customization
  - Notification preferences
  - Organization settings (Admin only)

### Technical Features

- **Real-time Updates**: Live data synchronization using Supabase Realtime
- **Dark Mode**: Beautiful light and dark themes
- **Responsive Design**: Mobile-first design that works on all devices
- **Type Safety**: Full TypeScript implementation
- **Security**: Row-level security policies in Supabase
- **Performance**: Optimized queries and efficient data loading

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - Lucide React (icons)

- **Backend**
  - Supabase (PostgreSQL database)
  - Supabase Auth
  - Supabase Realtime
  - Row-level security

- **State Management**
  - React Context API
  - Custom hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. The database schema and sample data are already set up via migrations.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Sidebar, Header)
│   └── pages/          # Page components
├── contexts/           # React contexts (Auth, Theme)
├── lib/               # Utilities and configurations
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles with roles
- **organizations**: Multi-tenant organizations
- **categories**: Product categories
- **suppliers**: Supplier information
- **locations**: Warehouse/store locations
- **inventory_items**: Main inventory data
- **stock_movements**: Transaction history
- **alerts**: System notifications
- **audit_logs**: Activity tracking

## User Roles

- **Admin**: Full access to all features including delete operations
- **Manager**: Can create, read, and update (no delete)
- **Viewer**: Read-only access

## Sample Data

The application includes sample data for demonstration:
- Demo Company organization
- 5 product categories (Electronics, Clothing, Food & Beverages, Tools, Office Supplies)
- 4 suppliers
- 2 locations
- 12 inventory items
- 4 low stock alerts

## Features Roadmap

Future enhancements:
- Barcode scanning integration
- Purchase order management
- Advanced reporting with charts
- CSV/Excel bulk import
- Email notifications
- Mobile app
- Multi-currency support
- Advanced analytics and forecasting

## Security

- Row-level security enforced at database level
- Secure authentication via Supabase Auth
- Role-based access control
- Input validation and sanitization
- HTTPS required in production

## Performance Optimization

- Lazy loading of components
- Efficient database queries with indexes
- Real-time subscriptions only for active data
- Optimized build with code splitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Database powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for businesses worldwide
