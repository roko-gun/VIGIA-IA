const ExcelJS = require('exceljs');
const Reporte = require('../models/Reporte');

// ================== Reportes en JSON =======================

exports.accesosGenerales = (req, res) => {
    Reporte.accesosGenerales((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al generar reporte', error: err.message });
        }
        res.json(results);
    });
};

exports.accesosPorFecha = (req, res) => {
    const { desde, hasta } = req.params;

    Reporte.accesosPorFecha(desde, hasta, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al generar reporte', error: err.message });
        }
        res.json(results);
    });
};

exports.horasTrabajadas = (req, res) => {
    Reporte.horasTrabajadas((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al generar reporte', error: err.message });
        }
        res.json(results);
    });
};

exports.visitasPorApartamento = (req, res) => {
    Reporte.visitasPorApartamento((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al genera reporte', error: err.message });
        }
        res.json(results);
    });
};

// ==================== Exportar a Excel =======================

// funcion auxiliar para exportar datos a excel
const exportarExcel = async (res, datos, columnas, nombreHoja, nombreArchivo) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(nombreHoja);

    worksheet.columns = columnas;
    worksheet.addRows(datos);

    // Estilos encabezado
    worksheet.getRow(1).font = { bold: true, color: {argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0A2540' }
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // configurar la respuesta HTTP
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
};

// 1, exportar accesos gnerales
exports.accesosGeneralesExcel = (req, res) => {
    Reporte.accesosGenerales(async (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al generar el reporte', error: err.message});
        }

        const columnas = [
            { header: 'ID', key: 'id', with: 8 },
            { header: 'Tipo', key: 'tipo_usuario', width: 15 },
            { header: 'Nombre', key: 'nombre_usuario', width: 30 },
            { header: 'Accion', key: 'accion', with: 12 },
            { header: 'Fecha y Hora', key: 'fecha_hora', with: 25 }
        ];

        await exportarExcel(res, results, columnas, 'Accesos', 'reporte_accesos');
    });
};

// 2. Exportar accesos por fecha
exports.accesosPorFechaExcel = (req, res) => {
    const { desde, hasta } = req.params;

    Reporte.accesosPorFecha(desde, hasta, async (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al generar reporte', error: err.message });
        }

        const columnas = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Tipo', key: 'tipo_usuario', width: 15 },
            { header: 'Nombre', key: 'nombre_usuario', width: 30 },
            { header: 'Acción', key: 'accion', width: 12 },
            { header: 'Fecha y Hora', key: 'fecha_hora', width: 25 }
        ];

        await exportarExcel(res, results, columnas, 'Accesos por Fecha', `accesos_${desde}_${hasta}`);
    });
};

// 3. Exportar horas trabajadas
exports.horasTrabajadasExcel = (req, res) => {
    Reporte.horasTrabajadas(async (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al generar reporte', error: err.message });
        }

        const columnas = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Cédula', key: 'cedula', width: 15 },
            { header: 'Cargo', key: 'cargo', width: 20 },
            { header: 'Primer Ingreso', key: 'primer_ingreso', width: 25 },
            { header: 'Última Salida', key: 'ultima_salida', width: 25 },
            { header: 'Total Ingresos', key: 'total_ingresos', width: 15 },
            { header: 'Total Salidas', key: 'total_salidas', width: 15 }
        ];

        await exportarExcel(res, results, columnas, 'Horas Trabajadas', 'reporte_horas_trabajadas');
    });
};

// 4. Exportar visitas por apartamento
exports.visitasPorApartamentoExcel = (req, res) => {
    Reporte.visitasPorApartamento(async (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al generar reporte', error: err.message });
        }
        
        const columnas = [
            { header: 'Apartamento', key: 'apartamento', width: 20 },
            { header: 'Total Visitas', key: 'total_visitas', width: 15 },
            { header: 'Visitantes Únicos', key: 'visitantes_unicos', width: 18 }
        ];
    
        await exportarExcel(res, results, columnas, 'Visitas', 'reporte_visitas_apartamento');
    });
};
