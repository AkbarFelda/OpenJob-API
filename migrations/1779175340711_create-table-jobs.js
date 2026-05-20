exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    company_id: { type: 'VARCHAR(50)', notNull: true, references: 'companies(id)', onDelete: 'CASCADE' },
    category_id: { type: 'VARCHAR(50)', notNull: true, references: 'categories(id)', onDelete: 'CASCADE' },
    title: { type: 'VARCHAR(255)', notNull: true },
    description: { type: 'TEXT', notNull: true },
    job_type: { type: 'VARCHAR(50)', notNull: true },
    experience_level: { type: 'VARCHAR(50)', notNull: true },
    location_type: { type: 'VARCHAR(50)', notNull: true },
    location_city: { type: 'VARCHAR(255)' },
    salary_min: { type: 'INTEGER' },
    salary_max: { type: 'INTEGER' },
    is_salary_visible: { type: 'BOOLEAN', default: true },
    status: { type: 'VARCHAR(50)', default: 'open' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};
