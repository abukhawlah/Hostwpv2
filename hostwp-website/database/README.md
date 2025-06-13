# Database Setup Instructions

This directory contains SQL migration files for setting up the HostWP website database in Supabase.

## Quick Setup

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your HostWP project

2. **Execute SQL Migration**
   - Navigate to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `migrations/create_site_settings_table.sql`
   - Run the query

## What This Migration Creates

### `site_settings` Table
- **Purpose**: Stores global website settings (favicon, title, contact info, etc.)
- **Key Features**:
  - Single row constraint (only one settings record allowed)
  - Auto-updating `updated_at` timestamp
  - Row Level Security (RLS) enabled
  - Default values for all settings

### Table Structure
```sql
- id (INTEGER, PRIMARY KEY, always = 1)
- favicon_enabled (BOOLEAN, default: false)
- favicon_url (TEXT, nullable)
- site_title (TEXT, default: 'HostWP - Premium Web Hosting Services')
- site_description (TEXT, default: 'Professional WordPress Hosting Solutions')
- meta_keywords (TEXT, default: 'wordpress hosting, web hosting, domain registration')
- contact_email (TEXT, default: 'support@hostwp.com')
- support_phone (TEXT, default: '1-800-HOST-WP')
- created_at (TIMESTAMP WITH TIME ZONE, auto-set)
- updated_at (TIMESTAMP WITH TIME ZONE, auto-updated)
```

### Security Policies
- **Authenticated users**: Full access (read/write/update/delete)
- **Anonymous users**: Read-only access (for public website)

## Environment Variables

Make sure these are set in your Supabase project:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous public key

## Code Integration

The settings are managed through:
- **Hook**: `src/hooks/useSiteSettings.jsx` - Global state management
- **Component**: `src/components/admin/SettingsManager.jsx` - Admin interface
- **Database**: `src/lib/supabase.js` - Database helpers

## Benefits of Database Storage

✅ **Centralized**: Settings apply to all users globally
✅ **Persistent**: Survives browser data clearing
✅ **Secure**: Data backed up in the cloud
✅ **Real-time**: Changes sync across multiple admin sessions
✅ **Scalable**: Easy to add new settings fields

## Troubleshooting

### Settings Not Saving
1. Check Supabase connection in browser dev tools
2. Verify environment variables are set correctly
3. Ensure the migration has been run successfully
4. Check RLS policies allow the authenticated user to write

### Settings Not Loading
1. Verify the table exists in Supabase
2. Check that default settings row was inserted (id = 1)
3. Confirm RLS policies allow anonymous read access 