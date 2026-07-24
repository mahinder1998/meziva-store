-- meziva-store database schema
-- Run this once against your MySQL database (Hostinger hPanel > Databases >
-- phpMyAdmin, or via mysql CLI) BEFORE running scripts/seed.js.

CREATE TABLE IF NOT EXISTS collections (
  slug VARCHAR(100) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  image VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  slug VARCHAR(150) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  collection_slug VARCHAR(100),
  price INT NOT NULL,
  compare_at_price INT NULL,
  description TEXT,
  how_to_use TEXT,
  additional_info JSON,
  images JSON,
  sizes JSON,
  stock INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  meta_content_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_slug) REFERENCES collections(slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(50) PRIMARY KEY,
  product_slug VARCHAR(150) NOT NULL,
  name VARCHAR(100),
  rating INT,
  title VARCHAR(200),
  comment TEXT,
  date DATETIME,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product_slug (product_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  order_number INT UNIQUE,
  created_at DATETIME,
  status VARCHAR(30),
  payment_method VARCHAR(30),
  customer_name VARCHAR(150),
  customer_email VARCHAR(150),
  customer_phone VARCHAR(30),
  customer_address VARCHAR(500),
  customer_city VARCHAR(100),
  customer_state VARCHAR(100),
  customer_pincode VARCHAR(20),
  items JSON,
  subtotal INT,
  shipping INT,
  total INT,
  razorpay JSON,
  shiprocket JSON,
  INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
