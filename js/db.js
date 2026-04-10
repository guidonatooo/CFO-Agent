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

  _userId() {
    return window.CFOGetUserId ? window.CFOGetUserId() : null;
  },

  async select(tabela, userId) {
    const uid = userId || this._userId();
    return this.query(
      `SELECT * FROM ${tabela} WHERE user_id = $1 ORDER BY created_at DESC`,
      [uid], uid
    );
  },

  async insert(tabela, campos, valores, userId) {
    const uid = userId || this._userId();
    const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
    return this.query(
      `INSERT INTO ${tabela} (user_id, ${campos.join(', ')}) VALUES ($${valores.length + 1}, ${placeholders}) RETURNING id`,
      [...valores, uid], uid
    );
  },

  async deleteById(tabela, id, userId) {
    const uid = userId || this._userId();
    return this.query(
      `DELETE FROM ${tabela} WHERE id = $1 AND user_id = $2`,
      [id, uid], uid
    );
  }
};
