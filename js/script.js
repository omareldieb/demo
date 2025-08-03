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
    
    // Load cart items for authenticated user
    await updateCartDisplay();
    
    // Check if user is admin
    if (user.email === ADMIN_EMAIL) {
        showAdminPanel();
    }
}

// Show admin panel
function showAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
        <h3>Admin Panel</h3>
        <div class="admin-actions">
            <button class="admin-btn" onclick="manageProducts()">Manage Products</button>
            <button class="admin-btn" onclick="manageOrders()">Manage Orders</button>
            <button class="admin-btn" onclick="manageUsers()">Manage Users</button>
        </div>
    `;
    
    // Insert admin panel after the header
    const container = document.querySelector('.container');
    container.insertBefore(adminPanel, container.firstChild);
}

// Admin functions
async function manageProducts() {
    alert('Product management panel - Coming soon!');
}

async function manageOrders() {
    alert('Order management panel - Coming soon!');
}

async function manageUsers() {
    try {
        const users = await getAllUsers();
        if (users.length === 0) {
            alert('No users found in the database.');
            return;
        }
        
        let userList = 'User Management:\n\n';
        users.forEach(user => {
            userList += `Name: ${user.full_name}\n`;
            userList += `Email: ${user.email}\n`;
            userList += `Role: ${user.role}\n`;
            userList += `Created: ${new Date(user.created_at).toLocaleDateString()}\n`;
            userList += `Last Login: ${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}\n`;
            userList += `Active: ${user.is_active ? 'Yes' : 'No'}\n`;
            userList += '─'.repeat(30) + '\n';
        });
        
        alert(userList);
    } catch (error) {
        console.error('Error managing users:', error);
        alert('Error loading user data. Please try again.');
    }
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
            
            // Clear user info and disable interactions
            userName.textContent = '';
            disableInteractions();
            
            // Remove admin panel if exists
            const adminPanel = document.querySelector('.admin-panel');
            if (adminPanel) {
                adminPanel.remove();
            }
            
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

// Load products from JSON (existing functionality)
async function loadProducts() {
    try {
        const response = await fetch('js/products.json');
        const products = await response.json();
        
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
                            <img class="img-hover" src="${product.img_hover}" alt="${product.name}">
                            <img class="orig-image" src="${product.img}" alt="${product.name}">
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
                            <h3 class="new">$ ${product.price}.00</h3>
                            ${product.old_price ? `<h3 class="old">$ ${product.old_price}.00</h3>` : ''}
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
                const price = parseInt(priceText.replace('$', '').replace('.00', ''));
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