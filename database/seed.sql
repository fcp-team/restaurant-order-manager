USE restaurant_order_manager;

-- =========================
-- INSERT USERS
-- =========================
INSERT INTO Users (name, email, password, role)
VALUES 
('Admin', 'admin@gmail.com', '123', 'admin'),
('Garçon', 'garcon@gmail.com', '123', 'waiter'),
('Cozinheiro', 'cozinheiro@mail.com', '123', 'chef');

-- =========================
-- INSERT MENUS
-- =========================
INSERT INTO Menus (name, description)
VALUES 
('Cardápio de Pratos', 'Cardápio com pratos derivados do restaurante'),
('Cardápio de Bebidas', 'Cardápio de bebidas do restaurante');

-- =========================
-- INSERT ITEMS
-- =========================
INSERT INTO Items (id_menu, name, description, price)
VALUES
(1, 'Feijoada', 'feijão preto, carne-seca, lombo, costelinha, pé, orelha, rabo de porco, paio, linguiça calabresa e bacon', 25.00),
(1, 'Virada Paulista', 'tutu de feijão cremoso, bisteca suína, couve refogada, arroz branco', 25.00),
(2, 'Coca-Cola', '350ml', 4.99),
(2, 'Suco de Laranja', '350ml', 8.50);

-- =========================
-- INSERT ORDER
-- =========================
INSERT INTO Orders (id_user, table_number, opened_at, payment, total)
VALUES
(2, '01', NOW(), 0.00, 29.99);

-- =========================
-- INSERT ORDER ITEMS
-- =========================
INSERT INTO OrderItems (id_order, id_item, quantity, note)
VALUES
(1, 1, 1, 'não adicionar a orelha de porco'),
(1, 3, 2, 'Sem gelo');
