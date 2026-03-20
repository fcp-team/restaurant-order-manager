CREATE DATABASE restaurant_order_manager;
USE restaurant_order_manager;

-- =========================
-- USERS
-- =========================
CREATE TABLE Users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (is_deleted IN (0,1))
) ENGINE=InnoDB;

-- =========================
-- MENUS
-- =========================
CREATE TABLE Menus (
    id_menu INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (is_deleted IN (0,1))
) ENGINE=InnoDB;


-- =========================
-- ITEMS
-- =========================
CREATE TABLE Items (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_menu INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (is_deleted IN (0,1)),
    CONSTRAINT fk_items_menu
        FOREIGN KEY (id_menu) REFERENCES Menus(id_menu)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;
 
-- =========================
-- ORDERS
-- =========================
CREATE TABLE Orders (
    id_order INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    table_number VARCHAR(10) NOT NULL,
    opened_at DATETIME NOT NULL,
    closed_at DATETIME,
    payment DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('open','closed','canceled') NOT NULL DEFAULT 'open',
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (is_deleted IN (0,1)),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE OrderItems (
    id_orderitem INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT NOT NULL,
    id_item INT NOT NULL,
    quantity INT NOT NULL,
    note VARCHAR(255),
    status ENUM('preparing','ready','delivered') NOT NULL DEFAULT 'preparing',
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (is_deleted IN (0,1)),
    CONSTRAINT fk_orderitems_order
        FOREIGN KEY (id_order) REFERENCES Orders(id_order)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_orderitems_item
        FOREIGN KEY (id_item) REFERENCES Items(id_item)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;
