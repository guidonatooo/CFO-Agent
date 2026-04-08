window.CFODb = {
  async query(sql, params = [], userId) {
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params, userId })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro desconhecido');
      return { data: json.data, error: null };
    } catch (err) {
      console.warn('CFODb error:', err.message);
      return { data: null, error: err.message };
    }
  },

  async select(tabela, userId) {
    return this.query(
      `SELECT * FROM ${tabela} WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId], userId
    );
  },

  async insert(tabela, campos, valores, userId) {
    const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
    return this.query(
      `INSERT INTO ${tabela} (user_id, ${campos.join(', ')}) VALUES ($${valores.length + 1}, ${placeholders}) RETURNING id`,
      [...valores, userId], userId
    );
  },

  async deleteById(tabela, id, userId) {
    return this.query(
      `DELETE FROM ${tabela} WHERE id = $1 AND user_id = $2`,
      [id, userId], userId
    );
  }
};
