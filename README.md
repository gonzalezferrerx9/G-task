# G-Task: Tu Gestor de Flujos de Trabajo Kanban 

**G-Task** es una aplicación de tablero Kanban, minimalista y  diseñada para ayudarte a organizar, seguir y gestionar tus tareas con facilidad. Construida con un stack tecnológico moderno, ofrece una experiencia de usuario fluida y en tiempo real, perfecta para proyectos personales.

```bash
###  Características Principales

**Arrastrar y Soltar Intuitivo: Mueve tareas sin esfuerzo entre las columnas.
**Base de Datos en Tiempo Real: Gracias a Firebase Firestore, tu tablero se mantiene actualizado instantáneamente.
**Autenticación Segura: Sistema de registro e inicio de sesión de usuarios con Firebase Authentication.
**Gestión de Tareas Detallada: Crea tareas con títulos, descripciones, fechas límite, etiquetas personalizadas.
**Seguimiento de Tiempo: Mide automáticamente el tiempo invertido en las tareas que están En Proceso.
**Modo Claro y Oscuro: Interfaz adaptable a tus preferencias visuales.

###  Stack Tecnológico

**Lenguajes Fundamentales: HTML, CSS, JavaScript
**Framework y Librería: Next.js (App Router) con React
**Lenguaje Principal: TypeScript
**Estilos: Tailwind CSS
**Componentes UI: ShadCN UI
**Backend y Base de Datos: Firebase Authentication y Firestore
**Arrastrar y Soltar: Dnd-kit

### Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

**1. Clona el repositorio**


git clone https://github.com/gonzalezferrerx9/G-task.git
cd G-task


**2. Instala las dependencias**


npm install


**3. Configura las variables de entorno de Firebase**


Este proyecto utiliza Firebase para la autenticación y la base de datos. Para conectar la aplicación, necesitas tus propias claves. Crea un archivo llamado `.env.local` en la raíz del proyecto y añade el siguiente contenido:


NEXT_PUBLIC_FIREBASE_API_KEY=TU_VALOR_AQUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=TU_VALOR_AQUI
NEXT_PUBLIC_FIREBASE_PROJECT_ID=TU_VALOR_AQUI
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=TU_VALOR_AQUI
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=TU_VALOR_AQUI
NEXT_PUBLIC_FIREBASE_APP_ID=TU_VALOR_AQUI


*   **¿Dónde encontrar estos valores?**
    1.  Ve a tu [Consola de Firebase](https://console.firebase.google.com/).
    2.  Selecciona tu proyecto.
    3.  Haz clic en el ícono de engranaje y ve a **Configuración del proyecto**.
    4.  En la pestaña **General**, baja a la sección "Tus apps".
    5.  Selecciona tu aplicación web y busca la opción **Configuración** o **"SDK setup and configuration"**.
    6.  Verás un objeto `firebaseConfig`. Copia los valores correspondientes y pégalos en tu archivo `.env.local`.

**4. Ejecuta el proyecto**


npm run dev
```
Abre [http://localhost:9002](http://localhost:9002) (o el puerto que la terminal indique) en tu navegador para ver la aplicación en funcionamiento.
