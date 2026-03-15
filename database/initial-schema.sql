CREATE DATABASE gestao_restaurante;
USE gestao_restaurante;

-- =========================
-- USUARIOS
-- =========================
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    funcao VARCHAR(50) NOT NULL,
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (excluido IN (0,1))
) ENGINE=InnoDB;

-- =========================
-- MENUS
-- =========================
CREATE TABLE Menus (
    id_menu INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (excluido IN (0,1))
) ENGINE=InnoDB;

-- =========================
-- RESTAURANTES
-- =========================
CREATE TABLE Restaurantes (
    id_restaurante INT AUTO_INCREMENT PRIMARY KEY,
    cnpj VARCHAR(18),
    razao_social VARCHAR(100),
    nome_fantasia VARCHAR(100),
    inscricao_estadual VARCHAR(20),
    email VARCHAR(150),
    telefone VARCHAR(20),
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (excluido IN (0,1))
) ENGINE=InnoDB;

-- =========================
-- ENDERECOS
-- =========================
CREATE TABLE Enderecos (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    id_restaurante INT NOT NULL UNIQUE,
    cep VARCHAR(9),
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(2),
    pais VARCHAR(50),
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (excluido IN (0,1)),

    CONSTRAINT fk_endereco_restaurante
        FOREIGN KEY (id_restaurante)
        REFERENCES Restaurantes(id_restaurante)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- ITENS
-- =========================
CREATE TABLE Itens (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_menu INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    valor DECIMAL(10,2) NOT NULL,
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (excluido IN (0,1)),

    CONSTRAINT fk_itens_menu
        FOREIGN KEY (id_menu)
        REFERENCES Menus(id_menu)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- PEDIDOS
-- =========================
CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_restaurante INT NOT NULL,
    mesa VARCHAR(10) NOT NULL,
    abertura DATETIME NOT NULL,
    fechamento DATETIME,
    pagamento DECIMAL(10,2),
    total DECIMAL(10,2) NOT NULL,
    status ENUM('aberto','fechado','cancelado') NOT NULL DEFAULT 'aberto',
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (excluido IN (0,1)),

    CONSTRAINT fk_pedidos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_pedidos_restaurante
        FOREIGN KEY (id_restaurante)
        REFERENCES Restaurantes(id_restaurante)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- ITENS PEDIDOS
-- =========================
CREATE TABLE ItensPedidos (
    id_itempedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_item INT NOT NULL,
    quantidade INT NOT NULL,
    nota VARCHAR(255),
    status ENUM('preparando','pronto','entregue') NOT NULL DEFAULT 'preparando',
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (excluido IN (0,1)),

    CONSTRAINT fk_itemspedido_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES Pedidos(id_pedido)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_itemspedido_item
        FOREIGN KEY (id_item)
        REFERENCES Itens(id_item)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==================================
-- TRIGGER PARA ALTERAR EXCLUIDO PARA 1 DO ITEMPEDIDO 
-- QUANDO UM PEDIDO FOR EXCLUIDO
-- ==================================

DELIMITER $$

CREATE TRIGGER trg_excluir_itens_pedido
AFTER UPDATE ON Pedidos
FOR EACH ROW
BEGIN
    IF NEW.excluido = 1 AND OLD.excluido = 0 THEN
        UPDATE ItensPedidos
        SET excluido = 1
        WHERE id_pedido = NEW.id_pedido;
    END IF;
    
     IF NEW.excluido = 0 AND OLD.excluido = 1 THEN
        UPDATE ItensPedidos
        SET excluido = 0
        WHERE id_pedido = NEW.id_pedido;
    END IF;
    
END$$

-- ==================================
-- TRIGGER PARA ALTERAR EXCLUIDO PARA 1 DO ENDERECO 
-- QUANDO UM RESTAURANTE FOR EXCLUIDO
-- ==================================

CREATE TRIGGER trg_excluir_endereco_restaurante
AFTER UPDATE ON Restaurantes
FOR EACH ROW
BEGIN
    IF NEW.excluido = 1 AND OLD.excluido = 0 THEN
        UPDATE Enderecos
        SET excluido = 1
        WHERE id_restaurante = NEW.id_restaurante;
    END IF;
    
    IF NEW.excluido = 0 AND OLD.excluido = 1 THEN
        UPDATE Enderecos
        SET excluido = 0
        WHERE id_restaurante = NEW.id_restaurante;
    END IF;
END$$

DELIMITER ;