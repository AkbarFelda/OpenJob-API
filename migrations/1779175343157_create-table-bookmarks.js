exports.up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    job_id: { type: 'VARCHAR(50)', notNull: true, references: 'jobs(id)', onDelete: 'CASCADE' },
  });
  
  pgm.addConstraint('bookmarks', 'unique_user_id_job_id', {
    unique: ['user_id', 'job_id']
  });
};

exports.down = (pgm) => {
  pgm.dropTable('bookmarks');
};
