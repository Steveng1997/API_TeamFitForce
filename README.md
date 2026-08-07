# 🚀 API Backend Integral: TeamFit Force

Backend profesional en Node.js y Express estructurado con **Arquitectura Limpia por Capas (MVC / Layered Architecture)** para alimentar la aplicación móvil **TeamFit Force**.

---

## 📋 Tabla de Contenidos
- [Características Principales](#-características-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Guía de Instalación y Arranque](#-guía-de-instalación-y-arranque)
- [Variables de Entorno (`.env`)](#-variables-de-entorno-env)
- [Documentación de Endpoints (API REST)](#-documentación-de-endpoints-api-rest)
- [Despliegue con Docker / AWS Fargate](#-despliegue-con-docker--aws-fargate)

---

## ✨ Características Principales
* **Perfil de Usuario & Auth**: Registro, inicio de sesión con JWT y hash seguro de contraseñas (`bcryptjs`).
* **Métricas de Salud en Tiempo Real**: Telemetría diaria de pasos, calorías activas, racha de días consecutivo y Frecuencia Cardíaca (FC Reposo).
* **Nutrición & Food Fit 360°**: Metas de macronutrientes (Proteínas, Carbohidratos, Grasas), presupuesto calórico y motor de **Recetas Inteligentes Tipo RAG**.
* **Batidos Funcionales Adaptativos**: Catálogo de batidos verdes y antiinflamatorios con registro interactivo de consumo.
* **Rutinas de Ejercicio & Multimedia**: Rutinas Full Body, reproducción multimedia, control de series, repeticiones y reproducción integrada de playlists (Spotify, YouTube Music, Apple Music).
* **Bóveda Médica & Telemetría IA**:
  * Subida de exámenes en PDF, PNG o JPG (hasta 25 MB).
  * Lectura y clasificación automatizada de biomarcadores (Glucosa en ayunas, Cortisol matutino, PCR Ultrasensible, Vitamina D3, Triglicéridos, HDL).
  * Algoritmo de cálculo del **Score Bioquímico (0 - 100%)**.
  * Motor de recomendaciones inteligentes: alimentos a potenciar, restringir, ajustes a Zona 2 de cardio (128 BPM) y recordatorio de examen preventivo (60 días).
* **Coach IA Virtual**: Chat motivacional interactivo y sugerencias personalizadas de voz/texto.

---

## 📁 Estructura del Proyecto

```
API_TeamFitForce/
├── src/
│   ├── config/             # Configuración de base de datos y env
│   ├── controllers/        # Controladores HTTP por módulo
│   ├── middlewares/        # JWT, CORS, Error Handler, Multer File Uploads
│   ├── models/             # Modelos de datos y adaptadores de BD
│   ├── routes/             # Enrutadores REST API
│   ├── seed/               # Script de sembrado de datos iniciales
│   ├── services/           # Lógica de negocio, Bóveda Médica IA y RAG Nutricional
│   └── utils/              # Gestor de base de datos persistente
├── uploads/                # Archivos subidos (exámenes clínicos)
├── .env.example            # Plantilla de variables de entorno
├── Dockerfile              # Imagen para producción / AWS Fargate
├── docker-compose.yml      # Orquestación de contenedores
├── package.json            # Scripts y dependencias
├── server.js               # Punto de entrada principal Express (Puerto 3000)
└── README.md               # Guía de documentación
```

---

## 🔧 Requisitos Previos
* **Node.js**: v18.0.0 o superior.
* **npm**: v9.0.0 o superior.
* **Docker** (Opcional, para ejecución en contenedor).

---

## ⚙️ Guía de Instalación y Arranque

### 1. Clona o navega a la carpeta del backend
```bash
cd C:\Users\Steven\Desktop\API_TeamFitForce
```

### 2. Instala las dependencias del proyecto
```bash
npm install
```

### 3. Configura las Variables de Entorno
Copia el archivo `.env.example` y renómbralo a `.env`:
```bash
cp .env.example .env
```

### 4. Puebla la Base de Datos con Datos Iniciales (Seeding)
```bash
npm run seed
```

### 5. Inicia el Servidor en Modo Desarrollo
```bash
npm run dev
```
El servidor se iniciará en **`http://localhost:3000`**.

---

## 🔐 Variables de Entorno (`.env`)

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=teamfit_force_super_secret_jwt_key_2026
CORS_ORIGIN=*
DB_TYPE=json_storage
DATABASE_URL=postgres://user:password@localhost:5432/teamfit_db
MONGODB_URI=mongodb://localhost:27017/teamfit_db
UPLOAD_PATH=./uploads
```

---

## 📡 Documentación de Endpoints (API REST)

### 🏥 Healthcheck
* **`GET /api/health`**: Verifica que el servidor esté activo.

### 👤 1. Autenticación & Usuarios
* **`POST /api/auth/register`**: Registrar nuevo usuario.
* **`POST /api/auth/login`**: Iniciar sesión y obtener JWT.
* **`GET /api/users/profile`**: Obtener perfil del usuario actual.
* **`PUT /api/users/profile`**: Actualizar perfil (edad, peso, estatura, objetivo).

### 🏃 2. Métricas de Salud y Biometría
* **`GET /api/biometrics/today`**: Obtener pasos, calorías, racha de días y FC reposo de hoy.
* **`POST /api/biometrics/log`**: Registrar nueva medición biométrica.

### 🥗 3. Nutrición & Food Fit 360°
* **`GET /api/nutrition/summary`**: Obtener presupuesto calórico y desglose de macronutrientes.
* **`POST /api/nutrition/log-meal`**: Registrar una comida consumida.
* **`GET /api/nutrition/recipes`**: Obtener catálogo de Recetas Inteligentes (RAG).
* **`GET /api/nutrition/recipes/:id`**: Obtener detalle e ingredientes de una receta.

### 🥤 4. Batidos Funcionales Adaptativos
* **`GET /api/smoothies`**: Lista de batidos adaptativos (Verde Metabólico, Antiinflamatorio).
* **`PATCH /api/smoothies/:id/toggle-consume`**: Marcar o desmarcar batido como consumido.
* **`POST /api/smoothies`**: Crear un nuevo batido personalizado.

### 🏋️ 5. Rutinas de Ejercicio & Multimedia
* **`GET /api/routines`**: Obtener rutinas de entrenamiento activas.
* **`GET /api/routines/:id`**: Detalle de la rutina y sus ejercicios.
* **`POST /api/routines/:id/progress`**: Guardar el tiempo y progreso de la rutina.
* **`GET /api/routines/playlists`**: Obtener música sincronizada (Spotify, YouTube Music, Apple Music).

### 🧪 6. Bóveda Médica & Telemetría IA
* **`POST /api/medical-vault/upload`**: Subir archivo de examen clínico (PDF/PNG/JPG hasta 25MB) para análisis IA.
* **`GET /api/medical-vault/results`**: Obtener el Score Bioquímico, alertas y recomendaciones consolidadas.
* **`GET /api/medical-vault/biomarkers`**: Lista de biomarcadores (Glucosa, Cortisol, PCR, Vitamina D3, Triglicéridos, HDL).
* **`POST /api/medical-vault/biomarkers`**: Actualizar manualmente lecturas de biomarcadores.

### 🤖 7. Coach IA Virtual
* **`GET /api/coach/history`**: Obtener historial de mensajes con el Coach IA.
* **`POST /api/coach/chat`**: Enviar mensaje al Coach IA y recibir respuesta personalizada.
* **`POST /api/coach/motivate`**: Obtener mensaje o audio de motivación instantánea.

---

## 🐳 Despliegue con Docker / AWS Fargate

### Ejecución Local con Docker Compose
```bash
docker-compose up --build -d
```

### Construcción de Imagen para AWS Fargate
```bash
docker build -t teamfit-force-api .
docker tag teamfit-force-api:latest <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com/teamfit-force-api:latest
docker push <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com/teamfit-force-api:latest
```

---
*Desarrollado con ❤️ para **TeamFit Force**.*
