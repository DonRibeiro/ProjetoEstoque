CREATE DATABASE IF NOT EXISTS Estoque;
USE Estoque;

CREATE TABLE EQUIPAMENTOS(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL, 
    tipo VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL
);

INSERT INTO EQUIPAMENTOS (nome, valor, tipo, quantidade) VALUES
('Routerboard 760', 500.00, 'Redes', 10),
('Switch 24 portas', 1000.00, 'Redes', 5),
('Antena UNIFI', 1100.00, 'Redes', 20),
('Caixa TOA', 50.00, 'Passivo de rede', 15),
('Cordão LC/PC-SC/PC', 15.00, 'Passivo de rede', 100);