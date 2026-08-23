import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// 1. LISTAR TODOS OS EQUIPAMENTOS (GET)
app.get('/equipamentos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipamentos');
    res.json(rows);
  } catch (error) {
    res
    (500).json({ error: 'Erro ao buscar equipamentos: ' + error.message });
  }
});

// 2. CADASTRAR EQUIPAMENTO (POST)
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
    res
    (201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res
    (500).json({ error: 'Erro  cadastrar equipamento: ' + error.message });
  }
});

// 3. ATUALIZAR EQUIPAMENTO (PUT)
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
    res
    (500).json({ error: 'Erro  atualizar equipamento: ' + error.message });
  }
});

// 4. DELETAR EQUIPAMENTO (DELETE)
app.delete('/equipamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM equipamentos WHERE id = ?', [id]);
    res.json({ message: 'Equipamento removido com sucesso!' });
  } catch (error) {
    res
    (500).json({ error: 'Erro ao deletar equipamento: ' + error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});