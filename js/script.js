// Initialize Supabase client using config
let supabase;

try {
    // Check if Supabase config is properly set
    if (!SUPABASE_CONFIG.URL || SUPABASE_CONFIG.URL === 'https://your-project-url.supabase.co') {
        throw new Error('Supabase URL not configured. Please update js/config.js with your actual Supabase credentials.');
    }
    
    if (!SUPABASE_CONFIG.ANON_KEY || SUPABASE_CONFIG.ANON_KEY === 'your-anon-key') {
        throw new Error('Supabase Anon Key not configured. Please update js/config.js with your actual Supabase credentials.');
    }
    
    supabase = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
    console.log('Supabase client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Supabase:', error.message);
    // Show error message to user
    document.addEventListener('DOMContentLoaded', () => {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10001;
            max-width: 400px;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        `;
        errorDiv.innerHTML = `
            <strong>Configuration Error</strong><br>
            ${error.message}<br><br>
            Please update js/config.js with your Supabase credentials.
        `;
        document.body.appendChild(errorDiv);
    });
}

// DOM Elements
const authModal = document.getElementById('authModal');
const container = document.querySelector('.container');
const userInfo = document.querySelector('.user-info');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const authMessage = document.getElementById('authMessage');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

// Cart elements
const cartBtn = document.querySelector('.cart-btn');
const cartPage = document.querySelector('.cart-page');
const closeCartBtn = document.querySelector('.close-cart');
const count = document.querySelector('.one .count');
let orderCount = 0;
let currentTotal = 0;
const totalPrice = document.querySelector('.total-price');
let cartSpan = document.querySelector('.cart-span');

// Cart database functions
async function addToCart(productData) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.error('User not authenticated');
            return false;
        }

        const { data, error } = await supabase
            .from('cart_items')
            .insert({
                user_id: session.user.id,
                product_name: productData.name,
                product_price: productData.price,
                product_image: productData.img,
                quantity: 1,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error adding to cart:', error);
            return false;
        }

        console.log('Product added to cart successfully');
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}

async function getCartItems() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.error('User not authenticated');
            return [];
        }

        const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching cart items:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}

async function removeFromCart(itemId) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.error('User not authenticated');
            return false;
        }

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Error removing from cart:', error);
            return false;
        }

        console.log('Item removed from cart successfully');
        return true;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

async function updateCartDisplay() {
    const cartItems = await getCartItems();
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (!cartItemsContainer) return;

    // Update count and total
    orderCount = cartItems.length;
    count.textContent = orderCount;
    
    currentTotal = cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 0);
    totalPrice.textContent = `$${currentTotal}`;
    
    // Update subtotal in cart page
    const subTotalPrice = document.querySelector('.subtotal .total-price');
    if (subTotalPrice) {
        subTotalPrice.textContent = `$${currentTotal}`;
    }

    // Clear existing items
    cartItemsContainer.innerHTML = '';

    // Add each cart item
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.product_image}" alt="${item.product_name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.product_name}</h4>
                <p class="cart-item-price">$${item.product_price}</p>
                <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
            </div>
            <button class="remove-cart-item" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-cart-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const itemId = e.target.closest('.remove-cart-item').dataset.id;
            const success = await removeFromCart(itemId);
            if (success) {
                await updateCartDisplay();
            }
        });
    });
}

// User management functions
async function createUserProfile(userData) {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{
                id: userData.id,
                email: userData.email,
                full_name: userData.user_metadata?.full_name || userData.email.split('@')[0],
                role: userData.email === ADMIN_EMAIL ? 'admin' : 'user',
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString()
            }]);

        if (error) {
            console.error('Error creating user profile:', error);
            return false;
        }

        console.log('User profile created successfully');
        return true;
    } catch (error) {
        console.error('Error creating user profile:', error);
        return false;
    }
}

async function updateUserLastLogin(userId) {
    try {
        const { error } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', userId);

        if (error) {
            console.error('Error updating last login:', error);
        }
    } catch (error) {
        console.error('Error updating last login:', error);
    }
}

async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

async function getAllUsers() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all users:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
    }
}

async function updateUserProfile(userId, updates) {
    try {
        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId);

        if (error) {
            console.error('Error updating user profile:', error);
            return false;
        }

        console.log('User profile updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return false;
    }
}

async function deleteUser(userId) {
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user:', error);
            return false;
        }

        console.log('User deleted successfully');
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
}

// Admin email from config
const ADMIN_EMAIL = ADMIN_CONFIG.EMAIL;

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (!supabase) {
        console.error('Supabase not initialized. Cannot check authentication.');
        return;
    }
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            // User is already logged in
            await handleAuthenticatedUser(session.user);
        } else {
            // User is not logged in - disable interactions
            disableInteractions();
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        disableInteractions();
    }
    
    // Load products regardless of authentication status
    await loadProducts();
    
    // Initialize cart functionality
    initializeCart();
});

// Initialize cart functionality
function initializeCart() {
    if (cartBtn && cartPage && closeCartBtn) {
cartBtn.addEventListener('click', () => {
    cartPage.classList.add('active');
    document.body.style.overflow = 'hidden'; 
        });

closeCartBtn.addEventListener('click', () => {
    cartPage.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartPage.contains(e.target) && !cartBtn.contains(e.target) && cartPage.classList.contains('active')) {
                cartPage.classList.remove('active');
    document.body.style.overflow = 'auto';
            }
        });
    }
}

// Disable interactions when not authenticated
function disableInteractions() {
    container.classList.remove('authenticated');
    userInfo.classList.remove('authenticated');
    logoutBtn.style.display = 'none';
    userName.style.display = 'none'; // Hide email when not logged in
    loginBtn.style.display = 'flex';
    signupBtn.style.display = 'flex';
}

// Enable interactions when authenticated
function enableInteractions() {
    container.classList.add('authenticated');
    userInfo.classList.add('authenticated');
    logoutBtn.style.display = 'block';
    userName.style.display = 'inline-block'; // Show email when logged in
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
}

// Show authentication modal
function showAuthModal() {
    if (!supabase) {
        showMessage('Authentication service not available. Please check your configuration.', 'error');
        return;
    }
    
    authModal.style.display = 'flex';
    clearMessage();
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector('.auth-form input');
        if (firstInput) firstInput.focus();
    }, 100);
}

// Hide authentication modal (global function)
function hideAuthModal() {
    authModal.style.display = 'none';
    clearMessage();
    // Clear form inputs
    loginForm.reset();
    signupForm.reset();
}

// Handle authenticated user
async function handleAuthenticatedUser(user) {
    enableInteractions();
    userName.textContent = user.email;
    
    // Show user info and logout button
    userName.style.display = 'inline';
    logoutBtn.style.display = 'inline-block';
    
    // Hide login/signup buttons
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    
    // Load cart items for authenticated user
    await updateCartDisplay();
    
    // Check if user is admin
    if (user.email === ADMIN_EMAIL) {
        showAdminPanel();
        changeNavigationForAdmin();
    }
}

// Show admin panel
function showAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
        <div class="admin-header-section">
            <h3>Admin Panel</h3>
            <div class="admin-actions">
                <button class="admin-btn" onclick="showAdminDashboard()">Dashboard</button>
                <button class="admin-btn" onclick="showManageProducts()">Manage Products</button>
                <button class="admin-btn" onclick="showManageOrders()">Manage Orders</button>
                <button class="admin-btn" onclick="showManageUsers()">Manage Users</button>
            </div>
        </div>
        <div id="adminContent" class="admin-content">
            <!-- Admin content will be loaded here -->
        </div>
    `;
    
    // Insert admin panel after the header
    const container = document.querySelector('.container');
    container.insertBefore(adminPanel, container.firstChild);
    
    // Show dashboard by default
    showAdminDashboard();
}

// Change navigation for admin
function changeNavigationForAdmin() {
    const navLinks = document.getElementById('navLinks');
    navLinks.innerHTML = `
        <li><a href="#" class="active" onclick="showAdminDashboard()">Dashboard</a></li>
        <li><a href="#" onclick="showManageProducts()">Manage Products</a></li>
        <li><a href="#" onclick="showManageOrders()">Manage Orders</a></li>
        <li><a href="#" onclick="showManageUsers()">Manage Users</a></li>
    `;
}

// Reset navigation to default
function resetNavigation() {
    const navLinks = document.getElementById('navLinks');
    navLinks.innerHTML = `
        <li><a href="#" class="active">Home</a></li>
        <li><a href="#">All Products</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Contact Us</a></li>
    `;
}

// Admin page functions
function showAdminDashboard() {
    updateActiveNavLink('Dashboard');
    showAdminContent('dashboard');
}

function showManageProducts() {
    updateActiveNavLink('Manage Products');
    showAdminContent('products');
    loadProductsForAdmin();
}

function showManageOrders() {
    updateActiveNavLink('Manage Orders');
    showAdminContent('orders');
    loadOrdersForAdmin();
}

function showManageUsers() {
    updateActiveNavLink('Manage Users');
    showAdminContent('users');
    loadUsersForAdmin();
}

function updateActiveNavLink(activeText) {
    const navLinks = document.querySelectorAll('#navLinks a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent === activeText) {
            link.classList.add('active');
        }
    });
}

function showAdminContent(page) {
    const adminContent = document.getElementById('adminContent');
    if (!adminContent) return;

    const contentMap = {
        dashboard: `
            <div class="admin-dashboard">
                <h2>Admin Dashboard</h2>
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Total Users</h3>
                        <p id="totalUsers">Loading...</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Products</h3>
                        <p id="totalProducts">Loading...</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Orders</h3>
                        <p id="totalOrders">Loading...</p>
                    </div>
                    <div class="stat-card">
                        <h3>Revenue</h3>
                        <p id="totalRevenue">Loading...</p>
                    </div>
                </div>
                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <div id="recentActivity">Loading recent activity...</div>
                </div>
            </div>
        `,
        products: `
            <div class="admin-products">
                <div class="admin-header">
                    <h2>Manage Products</h2>
                    <button class="admin-btn" onclick="showAddProductForm()">Add New Product</button>
                </div>
                <div class="products-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="productsTableBody">
                            <tr><td colspan="6">Loading products...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        orders: `
            <div class="admin-orders">
                <div class="admin-header">
                    <h2>Manage Orders</h2>
                </div>
                <div class="orders-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTableBody">
                            <tr><td colspan="7">Loading orders...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        users: `
            <div class="admin-users">
                <div class="admin-header">
                    <h2>Manage Users</h2>
                </div>
                <div class="users-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <tr><td colspan="7">Loading users...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    };

    adminContent.innerHTML = contentMap[page] || contentMap.dashboard;
    
    if (page === 'dashboard') {
        loadDashboardStats();
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const users = await getAllUsers();
        const products = await getAllProducts();
        const orders = await getAllOrders();
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalOrders').textContent = orders.length;
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        
        // Load recent activity
        loadRecentActivity();
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        const recentActivity = document.getElementById('recentActivity');
        const users = await getAllUsers();
        const orders = await getAllOrders();
        
        // Get recent users and orders
        const recentUsers = users.slice(0, 3);
        const recentOrders = orders.slice(0, 3);
        
        let activityHTML = '<div class="activity-list">';
        
        recentUsers.forEach(user => {
            activityHTML += `
                <div class="activity-item">
                    <span class="activity-icon">👤</span>
                    <span>New user registered: ${user.full_name}</span>
                    <span class="activity-time">${new Date(user.created_at).toLocaleDateString()}</span>
                </div>
            `;
        });
        
        recentOrders.forEach(order => {
            activityHTML += `
                <div class="activity-item">
                    <span class="activity-icon">🛒</span>
                    <span>New order: $${order.total}</span>
                    <span class="activity-time">${new Date(order.created_at).toLocaleDateString()}</span>
                </div>
            `;
        });
        
        activityHTML += '</div>';
        recentActivity.innerHTML = activityHTML;
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

// Load products for admin
async function loadProductsForAdmin() {
    try {
        const products = await getAllProducts();
        const tbody = document.getElementById('productsTableBody');
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" class="product-thumb"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.category || 'General'}</td>
                <td>${product.stock || 0}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="6">Error loading products</td></tr>';
    }
}

// Load orders for admin
async function loadOrdersForAdmin() {
    try {
        const orders = await getAllOrders();
        const tbody = document.getElementById('ordersTableBody');
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No orders found</td></tr>';
            return;
        }
        
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer_name || 'Unknown'}</td>
                <td>${order.items_count || 0} items</td>
                <td>$${order.total || 0}</td>
                <td><span class="status-badge ${order.status || 'pending'}">${order.status || 'Pending'}</span></td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewOrder('${order.id}')">View</button>
                    <button class="action-btn edit-btn" onclick="updateOrderStatus('${order.id}')">Update</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersTableBody').innerHTML = '<tr><td colspan="7">Error loading orders</td></tr>';
    }
}

// Load users for admin
async function loadUsersForAdmin() {
    try {
        const users = await getAllUsers();
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role}">${user.role}</span></td>
                <td><span class="status-badge ${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editUser('${user.id}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="7">Error loading users</td></tr>';
    }
}

// Database functions for admin
async function getAllProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function getAllOrders() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Admin action functions
function showAddProductForm() {
    // Implementation for adding new product
    alert('Add product form - Coming soon!');
}

function editProduct(productId) {
    // Implementation for editing product
    alert(`Edit product ${productId} - Coming soon!`);
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        // Implementation for deleting product
        alert(`Delete product ${productId} - Coming soon!`);
    }
}

function viewOrder(orderId) {
    // Implementation for viewing order details
    alert(`View order ${orderId} - Coming soon!`);
}

function updateOrderStatus(orderId) {
    // Implementation for updating order status
    alert(`Update order ${orderId} - Coming soon!`);
}

function editUser(userId) {
    // Implementation for editing user
    alert(`Edit user ${userId} - Coming soon!`);
}

// Event listeners for login/signup buttons
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        showAuthModal();
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });
}

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        showAuthModal();
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
}

// Form switching
if (showSignup) {
    showSignup.addEventListener('click', () => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        clearMessage();
        // Focus on first input in signup form
        setTimeout(() => {
            document.getElementById('signupName').focus();
        }, 100);
    });
}

if (showLogin) {
    showLogin.addEventListener('click', () => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        clearMessage();
        // Focus on first input in login form
        setTimeout(() => {
            document.getElementById('loginEmail').focus();
        }, 100);
    });
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!supabase) {
            showMessage('Authentication service not available. Please check your configuration.', 'error');
            return;
        }
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Show loading state
        const submitBtn = loginForm.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Update last login time
            await updateUserLastLogin(data.user.id);
            
            showMessage('Login successful! Welcome back!', 'success');
            setTimeout(() => {
                hideAuthModal();
                handleAuthenticatedUser(data.user);
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message, 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Signup form submission with database storage
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!supabase) {
            showMessage('Authentication service not available. Please check your configuration.', 'error');
            return;
        }
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long!', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = signupForm.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        try {
            console.log('Starting signup process...');
            console.log('Supabase config:', { 
                URL: SUPABASE_CONFIG.URL, 
                ANON_KEY: SUPABASE_CONFIG.ANON_KEY ? 'Present' : 'Missing' 
            });
            
            // Test connection first
            const { data: testData, error: testError } = await supabase.auth.getSession();
            if (testError) {
                throw new Error(`Connection failed: ${testError.message}`);
            }
            
            // Create user in Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });
            
            console.log('Signup response:', { data, error });
            
            if (error) {
                console.error('Supabase auth error:', error);
                throw error;
            }
            
            // Store additional user data in database
            if (data.user) {
                console.log('User created successfully, storing in database...');
                const profileCreated = await createUserProfile(data.user);
                if (profileCreated) {
                    console.log('User profile created successfully');
                } else {
                    console.log('User profile creation failed, but auth account was created');
                }
            }
            
            showMessage('Account created successfully! Please check your email for verification.', 'success');
            
            // Switch to login form after 2 seconds
            setTimeout(() => {
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
                clearMessage();
            }, 2000);
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = error.message;
            
            // Provide more user-friendly error messages
            if (error.message.includes('already registered')) {
                errorMessage = 'This email is already registered. Please try logging in instead.';
            } else if (error.message.includes('invalid email')) {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.message.includes('weak password')) {
                errorMessage = 'Password is too weak. Please choose a stronger password.';
            } else if (error.message.includes('Connection failed')) {
                errorMessage = 'Unable to connect to authentication service. Please check your internet connection and try again.';
            } else if (error.message.includes('not configured')) {
                errorMessage = 'Authentication service not properly configured. Please contact support.';
            }
            
            showMessage(errorMessage, 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (!supabase) {
            showMessage('Authentication service not available.', 'error');
            return;
        }
        
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Clear user info and hide logout button
            userName.textContent = '';
            userName.style.display = 'none';
            logoutBtn.style.display = 'none';
            
            // Show login/signup buttons
            loginBtn.style.display = 'inline-block';
            signupBtn.style.display = 'inline-block';
            
            // Reset navigation to default
            resetNavigation();
            
            // Remove admin panel if exists
            const adminPanel = document.querySelector('.admin-panel');
            if (adminPanel) {
                adminPanel.remove();
            }
            
            disableInteractions();
            showMessage('Logged out successfully!', 'success');
            
        } catch (error) {
            showMessage('Error logging out: ' + error.message, 'error');
        }
    });
}

// Utility functions
function showMessage(message, type) {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = `auth-message ${type}`;
    }
}

function clearMessage() {
    if (authMessage) {
        authMessage.textContent = '';
        authMessage.className = 'auth-message';
    }
}

// Load products from database
async function loadProducts() {
    try {
        const products = await getAllProducts();
        
        // Load products into both swipers
        const swiperWrappers = [
            document.querySelector('.myProductsSwiper .swiper-wrapper'),
            document.querySelector('.myProductsSwiper2 .swiper-wrapper')
        ];
        
        swiperWrappers.forEach((swiperWrapper, index) => {
            if (!swiperWrapper) return;
            
            swiperWrapper.innerHTML = ''; // Clear existing slides
            
            products.forEach(product => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                
                const salePercentage = product.sale || Math.round(((product.old_price - product.price) / product.old_price) * 100);
                
                slide.innerHTML = `
                            <div class="card">
                                <div class="images">
                            <div class="sale">%${salePercentage}</div>
                            <img class="img-hover" src="${product.img_hover || product.image}" alt="${product.name}">
                            <img class="orig-image" src="${product.image}" alt="${product.name}">
                                </div>
                                <div class="text">
                            <h3>${product.name}</h3>
                                </div>
                                <div class="rates">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star-half-stroke"></i>
                                </div>
                                <div class="price">
                            <h3 class="new">$ ${product.price}</h3>
                            ${product.old_price ? `<h3 class="old">$ ${product.old_price}</h3>` : ''}
                                </div>
                                <div class="icons">
                            <button class="cart-btn"><i class="fa-solid fa-cart-shopping"></i></button>
                                    <i class="fa-solid fa-heart"></i>
                                    <i class="fa-solid fa-share"></i>
                        </div>
                    </div>
                `;
                
                swiperWrapper.appendChild(slide);
            });
        });
        
        // Initialize Swiper for first products section
        new Swiper('.myProductsSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.myProductsSwiper .products-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
                1200: { slidesPerView: 5, spaceBetween: 30 },
            },
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            loop: true,
        });
        
        // Initialize Swiper for second products section
        new Swiper('.myProductsSwiper2', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.myProductsSwiper2 .products-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
                1200: { slidesPerView: 5, spaceBetween: 30 },
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            loop: true,
        });
        
        // Add event listeners to cart buttons after products are loaded
        const cartBtns = document.querySelectorAll('.icons .cart-btn');
        count.textContent = orderCount;
        totalPrice.textContent = `$${currentTotal}`;

        cartBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                console.log('clicked');
                
                // Get product data from the card
                const card = e.target.closest('.card');
                const productName = card.querySelector('h3').textContent;
                const priceText = card.querySelector('.new').textContent;
                const price = parseFloat(priceText.replace('$', '').replace('.00', ''));
                const productImage = card.querySelector('.orig-image').src;
                
                const productData = {
                    name: productName,
                    price: price,
                    img: productImage
                };
                
                // Add to database if user is authenticated
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const success = await addToCart(productData);
                    if (success) {
                        await updateCartDisplay();
                        showMessage('Product added to cart!', 'success');
                    } else {
                        showMessage('Failed to add product to cart', 'error');
                    }
                } else {
                    showMessage('Please login to add items to cart', 'error');
                }
            })
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
    }
}