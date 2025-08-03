-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2),
    category VARCHAR(100),
    stock INTEGER DEFAULT 0,
    image VARCHAR(500),
    img_hover VARCHAR(500),
    sale INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    items_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name, description, price, old_price, category, stock, image, img_hover, sale) VALUES
('iPhone 15 Pro', 'Latest iPhone with advanced features', 999.00, 1099.00, 'Phones', 50, 'image e-commrce/products/iphone15.jpg', 'image e-commrce/products/iphone15-hover.jpg', 9),
('MacBook Pro M3', 'Powerful laptop for professionals', 1999.00, 2199.00, 'Computers', 25, 'image e-commrce/products/macbook.jpg', 'image e-commrce/products/macbook-hover.jpg', 9),
('Samsung Galaxy S24', 'Android flagship smartphone', 899.00, 999.00, 'Phones', 40, 'image e-commrce/products/galaxy.jpg', 'image e-commrce/products/galaxy-hover.jpg', 10),
('iPad Air', 'Versatile tablet for work and play', 599.00, 699.00, 'Tablets', 30, 'image e-commrce/products/ipad.jpg', 'image e-commrce/products/ipad-hover.jpg', 14),
('Dell XPS 13', 'Premium Windows laptop', 1299.00, 1499.00, 'Computers', 20, 'image e-commrce/products/dell.jpg', 'image e-commrce/products/dell-hover.jpg', 13),
('AirPods Pro', 'Wireless earbuds with noise cancellation', 249.00, 299.00, 'Audio', 100, 'image e-commrce/products/airpods.jpg', 'image e-commrce/products/airpods-hover.jpg', 17),
('Sony WH-1000XM5', 'Premium noise-canceling headphones', 399.00, 449.00, 'Audio', 35, 'image e-commrce/products/sony.jpg', 'image e-commrce/products/sony-hover.jpg', 11),
('Apple Watch Series 9', 'Smartwatch with health features', 399.00, 449.00, 'Wearables', 60, 'image e-commrce/products/watch.jpg', 'image e-commrce/products/watch-hover.jpg', 11);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for products (readable by all, writable by admin)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by admin" ON products FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'omareldeib0@gmail.com');
CREATE POLICY "Products are updatable by admin" ON products FOR UPDATE USING (auth.jwt() ->> 'email' = 'omareldeib0@gmail.com');
CREATE POLICY "Products are deletable by admin" ON products FOR DELETE USING (auth.jwt() ->> 'email' = 'omareldeib0@gmail.com');

-- Create policies for orders (users can see their own orders, admin can see all)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all orders" ON orders FOR SELECT USING (auth.jwt() ->> 'email' = 'omareldeib0@gmail.com');
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update all orders" ON orders FOR UPDATE USING (auth.jwt() ->> 'email' = 'omareldeib0@gmail.com');

-- Create policies for order_items
CREATE POLICY "Order items are viewable by order owner" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);
CREATE POLICY "Admin can view all order items" ON order_items FOR SELECT USING (auth.jwt() ->> 'email' = 'omareldeib0@gmail.com');
CREATE POLICY "Order items are insertable by order owner" ON order_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);