exports.up = (pgm) => {
  pgm.createTable('documents', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    filename: { type: 'VARCHAR(255)', notNull: true },
    path: { type: 'VARCHAR(255)', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
};
