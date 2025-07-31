// Supabase Configuration
// Get these values from your Supabase project dashboard
// Go to: https://supabase.com/dashboard → Your Project → Settings → API
const SUPABASE_CONFIG = {
    URL: 'https://clkpcftixxttwlyiwowe.supabase.co', // Your actual Supabase project URL
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsa3BjZnRpeHh0dHdseWl3b3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDkzNjcsImV4cCI6MjA2OTQ4NTM2N30.shlA9qCft9RYDDNP2M07EQ4yUiXRQI8hEFp5WEUov5g' // Your actual Supabase anon key
};

// Admin configuration
const ADMIN_CONFIG = {
    EMAIL: 'omareldeib0@gmail.com', // Change this to your desired admin email
    PASSWORD: '122009omar' // Change this to your desired admin password
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, ADMIN_CONFIG };
} 