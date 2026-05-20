require('dotenv').config();
const express = require('express');
const ClientError = require('./exceptions/ClientError');
const path = require('path');

const app = express();

app.use(express.json());
// Serves documents folder publicly or as needed, maybe we don't need it right away but for file uploads it is good
// app.use('/documents', express.static(path.join(__dirname, '../documents')));

const usersRoute = require('./api/users/routes');
const authenticationsRoute = require('./api/authentications/routes');
const companiesRoute = require('./api/companies/routes');
const categoriesRoute = require('./api/categories/routes');
const jobsRoute = require('./api/jobs/routes');
const applicationsRoute = require('./api/applications/routes');
const bookmarksRoute = require('./api/bookmarks/routes');
const profileRoute = require('./api/profile/routes');
const documentsRoute = require('./api/documents/routes');

app.use('/users', usersRoute);
app.use('/authentications', authenticationsRoute);
app.use('/companies', companiesRoute);
app.use('/categories', categoriesRoute);
app.use('/jobs', jobsRoute);
app.use('/applications', applicationsRoute);
app.use('/bookmarks', bookmarksRoute);
app.use('/profile', profileRoute);
app.use('/documents', documentsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
});

module.exports = app;
