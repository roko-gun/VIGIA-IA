const Dashboard = require('../models/Dashboard');

// Obtener estadísticas del dashboard
exports.stats = (req, res) => {
    Dashboard.totales((err, totalesResult) => {
    if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener totales', error: err.message });
    }

    Dashboard.accesosPorDia((err, diasResult) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al obtener accesos por día', error: err.message });
        }

    Dashboard.ultimosAccesos((err, ultimosResult) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al obtener últimos accesos', error: err.message });
        }
        
        res.json({
            total_personal: totalesResult[0].total_personal,
            total_visitantes: totalesResult[0].total_visitantes,
            total_residentes: totalesResult[0].total_residentes,
            total_accesos_hoy: totalesResult[0].total_accesos_hoy,
            accesos_por_dia: diasResult,
            ultimos_accesos: ultimosResult
        });
    });
});
});
};
