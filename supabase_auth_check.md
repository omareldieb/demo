# Supabase Authentication Troubleshooting

## **Step 1: Check Supabase Project Settings**

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → Settings**
3. **Check these settings:**

### **Email Auth Settings:**

- ✅ **Enable Email Signup** should be ON
- ✅ **Enable Email Confirmations** can be OFF for testing
- ✅ **Enable Email Change Confirmations** can be OFF

### **URL Configuration:**

- **Site URL**: `http://localhost:3000` (or your local file path)
- **Redirect URLs**: Add your local development URL

## **Step 2: Test with Admin Account**

Try logging in with these credentials:

- **Email**: `omareldeib0@gmail.com`
- **Password**: `122009omar`

## **Step 3: Create a New Test Account**

1. **Click "Sign Up"**
2. **Use a new email address**
3. **Create a password (at least 6 characters)**
4. **Try logging in with the new account**

## **Step 4: Check Browser Console**

1. **Open Developer Tools (F12)**
2. **Go to Console tab**
3. **Try logging in**
4. **Look for any error messages**

## **Step 5: Verify Supabase Connection**

Check if the connection test works:

- Open browser console
- Look for "Supabase client initialized successfully"
- If you see connection errors, check your config

## **Common Issues:**

### **Issue 1: "Invalid login credentials"**

**Solution**:

- Make sure you're using the correct email/password
- Try creating a new account first
- Check if email confirmation is required

### **Issue 2: "User not found"**

**Solution**:

- Create a new account with signup
- Check if the user exists in Supabase Auth dashboard

### **Issue 3: "Connection failed"**

**Solution**:

- Check your Supabase URL and Anon Key
- Verify internet connection
- Check if Supabase service is up

## **Quick Test:**

1. **Open your website**
2. **Click "Sign Up"**
3. **Create a new account**
4. **Try logging in with the new account**
5. **Check if it works**

If signup works but login doesn't, there might be an email confirmation requirement.
