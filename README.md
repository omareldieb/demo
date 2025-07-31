# Topico E-commerce with Supabase Authentication

A modern e-commerce website with user authentication, admin panel, and product management using Supabase.

## Features

- 🔐 **User Authentication**: Login/Signup with Supabase Auth
- 👨‍💼 **Admin Panel**: Special admin access with management tools
- 🛒 **Product Slider**: Dynamic product display with Swiper.js
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Clean and professional design
- 👀 **Browse First**: Users can see the site before logging in

## User Experience

### Before Authentication

- ✅ **Home page loads normally** - No popups or overlays
- ✅ **All content visible** - Products, banners, navigation
- ✅ **Product slider works** - Products are displayed and animated
- ✅ **Site fully functional** - Everything loads and works
- ❌ **Interactions disabled** - Can't click buttons, add to cart, etc.
- ❌ **Login required** - Must authenticate to interact

### After Authentication

- ✅ **Full access** - All features unlocked
- ✅ **Shopping cart** - Can add/remove items
- ✅ **User profile** - See username and logout option
- ✅ **Admin features** - Admin users see management panel

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Open `js/config.js` and replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
  URL: "https://your-project-id.supabase.co", // Your project URL
  ANON_KEY: "your-anon-key-here", // Your anon key
};
```

### 3. Configure Admin Access

In `js/config.js`, update the admin credentials:

```javascript
const ADMIN_CONFIG = {
  EMAIL: "admin@yourdomain.com", // Your admin email
  PASSWORD: "your-secure-password", // Your admin password
};
```

### 4. Set Up Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your site URL (e.g., `http://localhost:3000`)
3. Set up email templates if needed

### 5. Create Admin User

1. Run your website locally
2. Sign up with the admin email you configured
3. Verify your email (check spam folder)
4. Log in with admin credentials

### 6. Test the System

1. Open `index.html` in your browser
2. You should see the home page load normally
3. Try clicking buttons (they should be disabled with tooltips)
4. Click "Login" or "Sign Up" to authenticate
5. After login, all interactions should work
6. Try logging in with the admin email to see admin panel

## How It Works

### User Flow

1. **Page Load**: Home page loads normally with all content
2. **Content Visible**: Users can see products, banners, navigation
3. **Interactions Disabled**: Buttons and links are disabled with visual feedback
4. **Authentication**: User clicks login/signup to authenticate
5. **Full Access**: After login, all interactions are enabled
6. **Admin Check**: If admin email, additional admin panel appears

### Technical Implementation

- **Normal Page Load**: No overlays or blockers
- **CSS-based Disabling**: Uses `pointer-events: none` and opacity
- **Visual Feedback**: Disabled elements show reduced opacity
- **Tooltips**: Hover shows "Login required" message
- **Authentication Modal**: Popup form for login/signup
- **Session Management**: Automatic login persistence

### Admin Features

- **Admin Email**: `admin@topico.com` (configurable)
- **Admin Panel**: Manage products, orders, users
- **Special Access**: Only visible to admin users

### Security Features

- ✅ **Email Verification**: Required for new accounts
- ✅ **Session Management**: Automatic login persistence
- ✅ **Admin Protection**: Only specific email can access admin
- ✅ **Secure Logout**: Clears session and user data
- ✅ **Interaction Protection**: Prevents unauthorized interactions

## File Structure

```
ecommerce/
├── index.html              # Main HTML file (loads normally)
├── css/
│   └── style.css          # All styles including disabled interactions
├── js/
│   ├── config.js          # Supabase configuration
│   ├── script.js          # Main JavaScript with auth logic
│   └── products.json      # Product data
└── image e-commrce/       # Product images
```

## Customization

### Change Admin Email

Edit `js/config.js`:

```javascript
const ADMIN_CONFIG = {
  EMAIL: "your-admin@email.com",
  PASSWORD: "your-password",
};
```

### Modify Disabled Interactions

Edit the CSS in `css/style.css`:

```css
.container:not(.authenticated) .cart-btn,
.container:not(.authenticated) .search button,
.container:not(.authenticated) .links a {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Add More Admin Features

In `js/script.js`, expand the admin functions:

```javascript
function manageProducts() {
  // Add your product management logic
}

function manageOrders() {
  // Add your order management logic
}

function manageUsers() {
  // Add your user management logic
}
```

### Styling

All authentication styles are in `css/style.css`:

- `.container:not(.authenticated)` - Disabled interactions
- `.auth-modal` - Login/signup modal
- `.auth-form` - Form styling
- `.admin-panel` - Admin panel styling

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check your Supabase credentials in `config.js`
2. **"Email not verified"**: Check spam folder for verification email
3. **Admin panel not showing**: Verify admin email matches exactly
4. **Products not loading**: Check `products.json` file path
5. **Interactions not disabled**: Check CSS for `.container:not(.authenticated)`

### Debug Mode

Add this to your browser console to debug:

```javascript
// Check current user
supabase.auth.getUser().then(console.log);

// Check session
supabase.auth.getSession().then(console.log);

// Check if authenticated
document.querySelector(".container").classList.contains("authenticated");

// Check disabled elements
document.querySelectorAll(".container:not(.authenticated) *").length;
```

## Next Steps

1. **Database Integration**: Store products in Supabase database
2. **Order Management**: Add shopping cart and checkout
3. **User Profiles**: Add user profile management
4. **Payment Integration**: Add payment processing
5. **Email Notifications**: Set up order confirmations

## Support

If you need help:

1. Check the Supabase documentation
2. Verify your configuration in `config.js`
3. Check browser console for errors
4. Ensure all files are in the correct locations

---

**Note**: This implementation provides the best user experience by showing the site content immediately without any barriers, while still requiring authentication for interactions. Users can browse and see what your site offers before deciding to create an account.
