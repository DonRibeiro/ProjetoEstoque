/*MySQL*/


/* NOVA IDEIA DE TABELA 

Tabela para contratos correlacionando os equipamentos e seus tipos. 

*/
 
/* show databases; USE estoque; show tables; desc equipamentos; */

CREATE DATABASE IF NOT EXISTS Estoque;
USE Estoque;

/* Criando a tabela de equipamentos */

CREATE TABLE EQUIPAMENTOS(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL, 
    tipo ENUM('Redes', 'Passivo de rede', 'Telefonia') NOT NULL,
    quantidade INT NOT NULL
);
 
/* Inserindo dados na tabela */

INSERT INTO EQUIPAMENTOS (nome, valor, tipo, quantidade) VALUES
('Routerboard 760', 500.00, 'Redes', 10),
('Switch 24 portas', 1000.00, 'Redes', 5),
('Antena UNIFI', 1100.00, 'Redes', 20),
('Caixa TOA', 50.00, 'Passivo de rede', 15),
('Cordão LC/PC-SC/PC', 15.00, 'Passivo de rede', 100),   
('Routerboard 750', 300.00, 'Redes', 26),
('Telefone T20', 150.00, 'Telefonia', 7),
('Telefone T19', 200.00, 'Telefonia', 29),
('Cordão SC/PC-SC/PC', 16.00, 'Passivo de rede', 28),   
('Conector RJ45', 1.00, 'Passivo de rede', 500),
('Patch cord cat5e', 20.00, 'Passivo de rede', 9),
('CCR 2004', 3000.00, 'Redes', 16),
('CCR 1009', 2500.00, 'Redes', 1),
('CCR 1036-12G-4S+', 4000.00, 'Redes', 1),
('CCR 1036-8G-2S+', 4200.00, 'Redes', 1),
('CCR 1072-1G-8S+', 5200.00, 'Redes', 1),
('ATA 200', 420.00, 'Telefonia', 12);

INSERT INTO EQUIPAMENTOS (nome, valor, tipo, quantidade) VALUES
('Conector de campo', 1.50, 'Passivo de rede', 200);


/* QUERYS */ 

SELECT * FROM EQUIPAMENTOS;
SELECT nome,quantidade FROM EQUIPAMENTOS WHERE tipo ='Redes';
SELECT nome, quantidade FROM EQUIPAMENTOS WHERE tipo ='Passivo de rede';
SELECT nome, quantidade FROM EQUIPAMENTOS WHERE tipo ='Telefonia';

SELECT nome, valor FROM EQUIPAMENTOS WHERE valor > 1000;
SELECT nome, valor FROM EQUIPAMENTOS WHERE valor < 1000;
SELECT nome, valor, quantidade FROM EQUIPAMENTOS WHERE nome LIKE 'CCR%';

/* PROCEDURE */ 

CREATE PROCEDURE equipamentos_acima_de_1000()
BEGIN
    SELECT nome, valor FROM EQUIPAMENTOS WHERE valor > 1000;
END;    

CALL equipamentos_acima_de_1000(); /* Chamando a procedure */

/* Alterando a tabela */ 

ALTER TABLE EQUIPAMENTOS ADD COLUMN valor_total DECIMAL(10,2) AS (valor * quantidade);

/* Criando uma forma de vizualizar a tabela com o valor em reais */

CREATE VIEW vw_valoresReal AS 
SELECT id, nome, quantidade, 
CONCAT('R$ ', FORMAT(valor, 2, 'pt_BR')) AS valor, CONCAT('R$ ', FORMAT(valor_total, 2, 'pt_BR')) AS valor_total 
FROM equipamentos;

SELECT * FROM vw_valoresReal; /* Para vizualizar a tabela com o valor em reais */

/* UPDATE */ 
UPDATE equipamentos SET quantidade = 2 WHERE id = 19;
