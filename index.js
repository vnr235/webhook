

const express = require('express');
const app = express();
const { startWebhookToClay } = require('./services/clayService');
const { sendContactsToSalesforge } = require('./services/salesforge');
const clayRoutes = require('./routes/clay');
const salesforgeRoutes = require('./routes/claywebhook');

app.use(express.json());

app.use('/', clayRoutes);
app.use('/', salesforgeRoutes);

startWebhookToClay(); // Start MongoDB change stream
sendContactsToSalesforge(); // Auto-run once on startup

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
