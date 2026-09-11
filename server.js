import express from 'express';
import cors from 'cors';
import pool from './db.js';
import path from 'path'; 
/*Importa o módulo nativo do Node.js usado para manipular e resolver caminhos de arquivos e diretórios de forma compatível com qualquer sistema operacional.*/
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/*Importa uma função que converte URLs de arquivos (o formato interno usado pelo import.meta.url no ES Modules) em caminhos de arquivo tradicionais do sistema*/

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// LISTAR TODOS OS EQUIPAMENTOS (GET)
app.get('/equipamentos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipamentos ORDER BY nome ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar equipamentos: ' + error.message });
  }
});

// CADASTRAR EQUIPAMENTO (POST)
app.post('/equipamentos', async (req, res) => {
  const { nome, valor, tipo, quantidade
} = req.body;
  
  try {
    const query = `
      INSERT INTO equipamentos (nome, valor, tipo, quantidade
      )
 VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [nome, valor, tipo, quantidade ]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar equipamento: ' + error.message });
  }
});

// ATUALIZAR EQUIPAMENTO (PUT)
app.put('/equipamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, valor, tipo, quantidade
} = req.body;

  try {
    const query = `
      UPDATE equipamentos 
      SET nome = ?, valor = ?, tipo = ?, quantidade = ?
 WHERE id = ?
    `;
    await pool.query(query, [nome, valor, tipo, quantidade
        , id]);
    res.json({ message: 'Equipamento atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar equipamento: ' + error.message });
  }
});

// DELETAR EQUIPAMENTO (DELETE)
app.delete('/equipamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM equipamentos WHERE id = ?', [id]);
    res.json({ message: 'Equipamento removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar equipamento: ' + error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});