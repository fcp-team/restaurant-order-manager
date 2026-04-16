USE gestao_restaurante;

-- =========================
-- INSERT USUARIOS
-- =========================
INSERT INTO Usuarios (nome, email, senha, funcao)
VALUES 
('Admin', 'admin@gmail.com', '123', 'admin'),
('Garçon', 'garcon@gmail.com', '123', 'garcom'),
('Cozinheiro', 'cozinheiro@mail.com', '123', 'cozinheiro');

-- =========================
-- INSERT RESTAURANTES
-- =========================
INSERT INTO Restaurantes (cnpj, razao_social, nome_fantasia, inscricao_estadual, email, telefone)
VALUES
('12.345.678/0001-99','Restaurante LTDA','Restaurante','123456789','contato@restaurante.com','(19)99999-9999');

-- =========================
-- INSERT ENDERECOS
-- =========================
INSERT INTO Enderecos (id_restaurante, cep, logradouro, numero, complemento, bairro, cidade, estado, pais)
VALUES
(1,'13720-000','Rua Central','100','Sala 1','Centro','São José do Rio Pardo','SP','Brasil');

-- =========================
-- INSERT MENUS
-- =========================
INSERT INTO Menus (nome, descricao)
VALUES 
('Cardápio de Pratos','Cardápio com pratos do restaurante'),
('Cardápio de Bebidas','Cardápio de bebidas do restaurante');

-- =========================
-- INSERT ITENS
-- =========================
INSERT INTO Itens (id_menu, nome, descricao, valor)
VALUES
(1,'Feijoada','feijão preto, carne-seca, lombo, costelinha, pé, orelha, rabo de porco, paio, linguiça calabresa e bacon',25.00),
(1,'Virada Paulista','tutu de feijão cremoso, bisteca suína, couve refogada, arroz branco',25.00),
(2,'Coca-Cola','350ml',4.99),
(2,'Suco de Laranja','350ml',8.50);

-- =========================
-- INSERT PEDIDOS
-- =========================
INSERT INTO Pedidos (id_usuario, mesa, abertura, pagamento, total)
VALUES
(2,'01',NOW(),0.00,29.99);

-- =========================
-- INSERT ITENS PEDIDOS
-- =========================
INSERT INTO ItensPedidos (id_pedido, id_item, quantidade, nota)
VALUES
(1, 1, 1,'não adicionar a orelha de porco'),
(1, 3, 2,'Sem gelo');

-- =========================
-- SELECTS PARA TESTAR
-- =========================
SELECT * FROM Usuarios;
SELECT * FROM Restaurantes;
SELECT * FROM Enderecos;
SELECT * FROM Menus;
SELECT * FROM Itens;
SELECT * FROM Pedidos;
SELECT * FROM ItensPedidos;
