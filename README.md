# VIGIA IA - LogiEstandar

Sistema Inteligente de Gestión de Personal y Control de Acceso mediante Reconocimiento Facial para Conjuntos Residenciales.

## Descripción

VIGIA IA es una plataforma web que integra la gestión de personal, visitantes, residentes y el control de acceso mediante reconocimiento facial en una sola solución, orientada a conjuntos residenciales y empresas de seguridad.

Este proyecto se desarrolla como Proyecto Productivo bajo enfoque empresarial para la etapa productiva del programa Tecnología en Análisis y Desarrollo de Software (ADSO) del SENA.

## Características principales

- Autenticación con JWT y contraseñas cifradas (bcrypt)
- CRUD completo de Personal, Visitantes y Residentes
- Registro de accesos (ingreso/salida) con filtros por tipo, acción y fecha
- Reportes en JSON y exportables a Excel
- Dashboard con gráficos estadísticos
- Cumplimiento de la Ley 1581 de 2012 (protección de datos personales)
- Diseño moderno Security Tech (Midnight Navy + Electric Cyan)

## Tecnologías utilizadas

### Backend
- Node.js + Express.js
- MariaDB (compatible con MySQL)
- mysql2, bcryptjs, jsonwebtoken, cors, dotenv, exceljs

### Frontend
- HTML5 + CSS3
- Bootstrap 5
- JavaScript (vanilla)
- Chart.js
- Bootstrap Icons

## Estructura del proyecto

VIGIA IA/
- backend/
- frontend/
- database/
- docs/

## Instalación y uso

1. Clonar el repositorio
2. Instalar dependencias: cd backend && npm install
3. Configurar archivo .env con datos de MariaDB
4. Crear base de datos vigia_ia
5. Arrancar backend: npm run dev
6. Arrancar frontend: cd frontend && python3 -m http.server 8080
7. Abrir http://localhost:8080

Credenciales de prueba:
- Correo: admin@vigiaia.com
- Contraseña: 123456

## Historias de Usuario implementadas

- HU-01: Inicio de sesión con JWT
- HU-02: CRUD de Residentes
- HU-03: CRUD de Visitantes
- HU-04: CRUD de Personal
- HU-05: Registros de Acceso con filtros
- HU-06: Reportes y exportación a Excel

## Autor

Ronal Alberto González
Aprendiz ADSO - SENA
Proyecto productivo bajo enfoque empresarial

## Licencia

Este proyecto es de uso académico para el SENA. Todos los derechos reservados 2026 LogiEstandar.
