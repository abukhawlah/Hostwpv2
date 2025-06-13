# Supabase Integration Setup

## 🎉 Supabase Successfully Integrated!

Your HostWP Marketing Website is now connected to Supabase with a comprehensive database structure and React integration.

## 🔐 Backend Login Details

**Project URL:** `https://mnozsjiwtzbtwhekrtum.supabase.co`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ub3pzaml3dHpidHdoZWtydHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDIyMTAsImV4cCI6MjA2NDExODIxMH0.LkHJmR9DtBJIAQ-FmugApXaHSdDXeU8MfFSGUC0pQHo`

**Dashboard Access:** [https://supabase.com/dashboard/project/mnozsjiwtzbtwhekrtum](https://supabase.com/dashboard/project/mnozsjiwtzbtwhekrtum)

## 📊 Database Structure

Your database includes the following tables:

### Core Content Tables
- **`services`** - Service offerings with categories, pricing, and features
- **`service_categories`** - Service categorization
- **`projects`** - Portfolio projects with images and details
- **`case_studies`** - Detailed case studies with client information
- **`images`** - Media management with categories
- **`team_members`** - Team member profiles and expertise

### E-commerce Tables
- **`ecommerce_products`** - Product catalog
- **`ecommerce_categories`** - Product categories
- **`ecommerce_users`** - Customer accounts
- **`ecommerce_cart`** - Shopping cart functionality
- **`ecommerce_orders`** - Order management
- **`ecommerce_order_items`** - Order line items

### Admin & SEO
- **`admin_users`** - Admin user management
- **`seo_settings`** - SEO configuration

## 🚀 React Integration

### Files Created

1. **`src/lib/supabase.js`** - Supabase client configuration and helper functions
2. **`src/hooks/useSupabase.js`** - Custom React hooks for data fetching
3. **`src/components/examples/SupabaseExample.jsx`** - Demo component showing integration

### Usage Examples

#### Basic Data Fetching
```jsx
import { useServices, useProjects } from '../hooks/useSupabase';

function MyComponent() {
  const { data: services, loading, error } = useServices({ featured: true });
  const { data: projects } = useProjects({ category: 'web-development' });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {services?.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  );
}
```

#### Direct Database Queries
```jsx
import { supabase, dbHelpers } from '../lib/supabase';

// Using helper functions
const services = await dbHelpers.getServices({ featured: true });
const projects = await dbHelpers.getProjects({ category: 'web-development' });

// Direct Supabase queries
const { data, error } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true);
```

#### Authentication
```jsx
import { useAuth } from '../hooks/useSupabase';

function LoginComponent() {
  const { user, signIn, signOut, loading } = useAuth();
  
  const handleLogin = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) console.error('Login failed:', error);
  };
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
    </div>
  );
}
```

## 🔧 Environment Configuration

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://mnozsjiwtzbtwhekrtum.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ub3pzaml3dHpidHdoZWtydHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDIyMTAsImV4cCI6MjA2NDExODIxMH0.LkHJmR9DtBJIAQ-FmugApXaHSdDXeU8MfFSGUC0pQHo
```

## 🎯 Demo Page

Visit `/supabase-example` in your application to see the integration in action. This page demonstrates:

- Fetching services, projects, case studies, and team members
- Real-time data display with loading states
- Error handling
- Responsive design with your UI components

## 📚 Available Helper Functions

The `dbHelpers` object provides convenient methods:

- `getServices(options)` - Fetch services with optional filtering
- `getProjects(options)` - Fetch projects with optional filtering  
- `getCaseStudies(options)` - Fetch case studies with optional filtering
- `getTeamMembers()` - Fetch all active team members
- `getSeoSettings()` - Fetch SEO configuration
- `getImages(category)` - Fetch images with optional category filter
- `getProducts(options)` - Fetch e-commerce products

## 🔄 Real-time Features

Use the `useSupabaseSubscription` hook for real-time updates:

```jsx
import { useSupabaseSubscription } from '../hooks/useSupabase';

function RealTimeComponent() {
  useSupabaseSubscription('services', (payload) => {
    console.log('Service updated:', payload);
    // Handle real-time updates
  });
  
  return <div>Real-time component</div>;
}
```

## 🛡️ Security Notes

- The anon key is safe to use in client-side code
- Row Level Security (RLS) should be configured in Supabase for production
- Consider implementing proper authentication for admin features
- Use environment variables for sensitive configuration

## 📖 Next Steps

1. **Configure RLS policies** in your Supabase dashboard for data security
2. **Add sample data** to your tables to test the integration
3. **Customize the helper functions** based on your specific needs
4. **Implement authentication** if you need user accounts
5. **Set up real-time subscriptions** for dynamic content updates

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/mnozsjiwtzbtwhekrtum)
- [Supabase Documentation](https://supabase.com/docs)
- [React Integration Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 