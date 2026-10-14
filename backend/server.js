const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const residentesRoutes = require('./routes/residentes.routes');
const visitantesRoutes = require('./routes/visitantes.routes');
const personalRoutes = require('./routes/personal.routes');
const accesosRoutes = require('./routes/accesos.routes');
const reportesRoutes = require('./routes/reportes.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5500', 'http://127.0.0.1:8080', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('VIGIA IA funcionando');
});

// Las rutas van DESPUÉS del express.json()
app.use('/api/auth', authRoutes);
app.use('/api/residentes', residentesRoutes);
app.use('/api/visitantes', visitantesRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/accesos', accesosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(3000, () => {
  console.log('Servidor activo en puerto 3000');
});