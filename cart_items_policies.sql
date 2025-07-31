-- Cart items policies ONLY
-- Run this if you need to recreate cart_items policies

-- Enable Row Level Security (RLS) for cart_items table
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own cart items
CREATE POLICY "Users can view their own cart items" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own cart items
CREATE POLICY "Users can insert their own cart items" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own cart items
CREATE POLICY "Users can update their own cart items" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own cart items
CREATE POLICY "Users can delete their own cart items" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at); 