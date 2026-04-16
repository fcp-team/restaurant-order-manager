-- =========================================
-- USUARIOS
-- =========================================

-- Busca usuário por ID
SELECT * FROM Usuarios 
WHERE id_usuario = ? AND excluido = 0;

-- Busca usuário por email (login)
SELECT * FROM Usuarios 
WHERE email = ? AND excluido = 0;

-- Insere novo usuário
INSERT INTO Usuarios (nome, email, senha, funcao)
VALUES (?, ?, ?, ?);

-- Atualiza dados do usuário
UPDATE Usuarios 
SET nome = ?, email = ?, funcao = ?
WHERE id_usuario = ?;

-- Marca usuário como excluído
UPDATE Usuarios 
SET excluido = 1 
WHERE id_usuario = ?;


-- =========================================
-- RESTAURANTES
-- =========================================

-- Busca restaurante por ID
SELECT * FROM Restaurantes 
WHERE id_restaurante = ? AND excluido = 0;

-- Lista restaurantes ativos
SELECT * FROM Restaurantes 
WHERE excluido = 0;

-- Insere novo restaurante
INSERT INTO Restaurantes 
(cnpj, razao_social, nome_fantasia, email, telefone)
VALUES (?, ?, ?, ?, ?);

-- Atualiza dados do restaurante
UPDATE Restaurantes 
SET nome_fantasia = ?, telefone = ?, email = ?
WHERE id_restaurante = ?;

-- Marca restaurante como excluído
UPDATE Restaurantes 
SET excluido = 1 
WHERE id_restaurante = ?;


-- =========================================
-- ENDEREÇOS
-- =========================================

-- Busca endereço por restaurante
SELECT * FROM Enderecos 
WHERE id_restaurante = ? AND excluido = 0;

-- Insere endereço
INSERT INTO Enderecos 
(id_restaurante, cep, logradouro, numero, bairro, cidade, estado, pais)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Atualizar endereço
UPDATE Enderecos 
SET logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, pais = ?
WHERE id_restaurante = ?;

-- Deixei sem a parte de deletar pois ja tem o Trigger pra fazer a exlcusão automatica
-- assim que deletar um restaurnte


-- =========================================
-- MENUS
-- =========================================

-- Lista menus
SELECT * FROM Menus 
WHERE excluido = 0;

-- Insere novo menu
INSERT INTO Menus (nome, descricao)
VALUES (?, ?);

-- Atualiza menu
UPDATE Menus 
SET nome = ?, descricao = ?
WHERE id_menu = ?;

-- Marca rmenu como excluído
UPDATE Menus 
SET excluido = 1 
WHERE id_menu = ?;

-- =========================================
-- ITENS
-- =========================================

-- Lista itens por menu
SELECT * FROM Itens 
WHERE id_menu = ? AND excluido = 0;

-- Busca item por ID
SELECT * FROM Itens 
WHERE id_item = ? AND excluido = 0;

-- Insere novo item
INSERT INTO Itens (id_menu, nome, descricao, valor)
VALUES (?, ?, ?, ?);

-- Atualiza item
UPDATE Itens 
SET nome = ?, descricao = ?, valor = ?
WHERE id_item = ?;

-- Marca item como excluído
UPDATE Itens 
SET excluido = 1 
WHERE id_item = ?;


-- =========================================
-- PEDIDOS
-- =========================================

-- Busca pedido por ID
SELECT * FROM Pedidos 
WHERE id_pedido = ? AND excluido = 0;

-- Lista pedidos abertos
SELECT * FROM Pedidos 
WHERE status = 'aberto' AND excluido = 0;

-- Cria novo pedido
INSERT INTO Pedidos 
(id_usuario, mesa, abertura, total, status)
VALUES (?, ?, NOW(), 0, 'aberto');

-- Atualiza status do pedido
-- Lembrado que os Status de Pedidos são: 
-- 'aberto', 'fechado' ou 'cancelado'
UPDATE Pedidos 
SET status = ?
WHERE id_pedido = ?;

-- Fecha pedido
UPDATE Pedidos 
SET fechamento = NOW(), status = 'fechado', total = ?
WHERE id_pedido = ?;

-- Cancela pedido
UPDATE Pedidos 
SET status = 'cancelado'
WHERE id_pedido = ?;

-- Marca pedido como excluído
UPDATE Pedidos 
SET excluido = 1 
WHERE id_pedido = ?;


-- =========================================
-- ITENS PEDIDOS
-- =========================================

-- Lista itens de um pedido
SELECT ip.*, i.nome, i.valor
FROM ItensPedidos ip
JOIN Itens i ON i.id_item = ip.id_item
WHERE ip.id_pedido = ? AND ip.excluido = 0;

-- Adiciona item ao pedido
INSERT INTO ItensPedidos 
(id_pedido, id_item, quantidade, status)
VALUES (?, ?, ?, 'preparando');

-- Atualiza quantidade
UPDATE ItensPedidos 
SET quantidade = ?
WHERE id_itempedido = ?;

-- Atualiza status do item  
-- Lembrado que os Status de ItensPedidos são:
-- 'preparando', 'pronto', 'entregue'
UPDATE ItensPedidos 
SET status = ?
WHERE id_itempedido = ?;

-- Marca item como excluído
UPDATE ItensPedidos 
SET excluido = 1
WHERE id_itempedido = ?;


-- =========================================
-- QUERY PEDIDO + ITENS
-- =========================================

-- Busca pedido com itens
SELECT 
  p.*,
  ip.id_itempedido,
  ip.quantidade,
  ip.status AS status_item,
  i.nome AS nome_prato,
  i.valor
FROM Pedidos p
LEFT JOIN ItensPedidos ip ON ip.id_pedido = p.id_pedido
LEFT JOIN Itens i ON i.id_item = ip.id_item
WHERE p.id_pedido = 1 AND p.excluido = 0;


-- =========================================
-- QUERIES PARA OS RELATÓRIOS 
-- =========================================

-- VENDAS DETALHADAS 
-- Lista pedidos fechados no período
SELECT 
  id_pedido,
  mesa,
  total,
  abertura,
  fechamento
FROM Pedidos
WHERE status = 'fechado'
  AND excluido = 0
  AND abertura BETWEEN ? AND ?
ORDER BY abertura DESC;
  
  
-- ITENS MAIS VENDIDOS 
-- Ranking de itens mais vendidos
SELECT 
  i.nome AS prato,
  SUM(ip.quantidade) AS total_vendido
FROM ItensPedidos ip
JOIN Itens i ON i.id_item = ip.id_item
JOIN Pedidos p ON p.id_pedido = ip.id_pedido
WHERE p.status = 'fechado'
  AND p.excluido = 0
  AND ip.excluido = 0
  AND p.abertura BETWEEN ? AND ?
GROUP BY i.nome
ORDER BY total_vendido DESC;
  
  
-- FATURAMENTO POR DIA 
-- Faturamento agrupado por dia dentro do periodo
SELECT 
  DATE(abertura) AS data,
  SUM(total) AS total_dia
FROM Pedidos
WHERE status = 'fechado'
  AND excluido = 0
  AND abertura BETWEEN ? AND ?
GROUP BY DATE(abertura)
ORDER BY data;