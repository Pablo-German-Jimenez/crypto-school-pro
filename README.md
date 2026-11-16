# CryptoSchool

CryptoSchool es una aplicación educativa sobre criptoactivos. Presenta rutas de aprendizaje para conocer Bitcoin, blockchain, seguridad y finanzas descentralizadas, junto con una guía introductoria de activos digitales y una vista de pools de Meteora.

> **Importante:** el contenido es informativo y no constituye asesoramiento financiero ni una recomendación de inversión. Los criptoactivos son volátiles y conllevan riesgos.

## Funcionalidades

- Inicio con presentación de la academia y acceso a sus rutas de aprendizaje.
- Catálogo de cursos con programas introductorios y páginas de detalle.
- Buscador y filtro por categoría para explorar activos digitales.
- Vista de demostración del panel de administración, con contenido de ejemplo.
- Inicio de sesión con Firebase Authentication usando correo/contraseña o Google, restablecimiento de contraseña y opción para recordar la sesión.
- Protección de la ruta `/administrator` para usuarios autenticados.
- Cotizaciones de BTC, ETH, SOL, XRP y ADA mediante el stream público de Binance.
- Explorador de pools DLMM de Meteora con filtros, actualización automática y enlaces a Solscan.
- Diseño adaptable a móvil y control para alternar entre tema claro y oscuro.
- Página 404 con navegación de regreso al contenido.

## Tecnologías

- React 19 y JavaScript
- Vite 7
- React Router 6
- Bootstrap 5
- Lucide React
- Firebase Authentication (SDK modular)

## Requisitos

- Node.js compatible con Vite 7 (Node.js 20.19+ o 22.12+).
- npm.

## Instalación y uso

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone [github url front end](https://github.com/Pablo-German-Jimenez/crypto-school-pro)
cd cryptofutureschoolFrontEnd

```

Instala dependencias y ejecuta el servidor de desarrollo:

```bash
npm install
npm run dev
```

Vite mostrará la dirección local en la terminal (habitualmente `http://localhost:5173`). Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

Para ejecutar ESLint:

```bash
npm run lint
```

## Configurar Firebase Authentication

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y registra una aplicación web.
2. En **Authentication → Sign-in method**, habilita los proveedores **Correo electrónico/contraseña** y **Google**. Al habilitar Google, selecciona el correo de asistencia del proyecto.
3. En **Authentication → Settings → Authorized domains**, comprueba que `localhost` esté en la lista para desarrollo y añade el dominio del sitio al publicarlo.
4. En **Authentication → Users**, crea las cuentas autorizadas que usarán correo y contraseña. El acceso con Google puede crear el usuario al iniciar sesión por primera vez; no hay un formulario de registro propio en la aplicación.
5. Copia `.env.example` como `.env.local` y completa sus variables con los valores de configuración de la aplicación web de Firebase:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   En macOS o Linux puedes usar `cp .env.example .env.local`. Copia solo el valor de cada campo del objeto `firebaseConfig`: no incluyas el nombre (`apiKey:`), las comillas que lo rodean ni la coma final. Reinicia `npm run dev` después de editar `.env.local` para que Vite vuelva a cargarlo.

La ruta `/administrator` requiere una sesión de Firebase; al iniciar sesión desde `/login` con correo o Google, se redirige al panel. También puedes solicitar el restablecimiento de contraseña desde el formulario.

El botón de Google abre una ventana emergente. Si Firebase muestra `auth/unauthorized-domain`, agrega el dominio de desarrollo o producción en **Authentication → Settings → Authorized domains**. El login no necesita variables adicionales a las de `.env.local`.

La configuración web (`apiKey`, `authDomain`, etc.) es pública en una aplicación cliente y no reemplaza las reglas de seguridad. **Nunca** incluyas claves privadas de cuentas de servicio ni credenciales del Admin SDK en variables `VITE_*` o en el frontend. El panel actual es una maqueta y el control de ruta solo verifica que exista una sesión; todavía no valida roles administrativos. Antes de conectar datos o acciones privadas, aplica autorización en un backend y reglas de seguridad de Firebase.

## Publicar en Netlify

El archivo `netlify.toml` configura `npm run build`, publica la carpeta `dist` y redirige las rutas de React a `index.html`, para que funcionen los enlaces directos y las recargas.

1. Sube el repositorio a GitHub y en Netlify selecciona **Add new site → Import an existing project**.
2. Selecciona el repositorio. Netlify tomará la configuración de `netlify.toml`; los valores son **Build command** `npm run build` y **Publish directory** `dist`.
3. En **Site configuration → Environment variables**, agrega las seis variables `VITE_FIREBASE_*` listadas en `.env.example`, usando solo los valores de la configuración web Firebase, sin comillas ni coma final. Configúralas para Production y, si vas a probar deploy previews, para ese contexto también.
4. Después del primer deploy, copia el dominio asignado por Netlify (por ejemplo, `mi-academia.netlify.app`) y agrégalo, sin `https://` ni rutas, en **Firebase Console → Authentication → Settings → Authorized domains**. Agrega también el dominio personalizado si lo utilizas. Para deploy previews, autoriza el dominio exacto de preview que vayas a probar.
5. Si agregas o cambias variables de entorno, vuelve a desplegar el sitio. Comprueba `/login`, el acceso con Google y la carga directa de `/administrator`.

Las variables `VITE_*` se incorporan al bundle del navegador y no son secretos. No configures claves privadas del Admin SDK en Netlify para esta aplicación frontend.

## Rutas principales

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio de CryptoSchool |
| `/login` | Inicio y restablecimiento de sesión Firebase |
| `/courses` | Catálogo de cursos |
| `/courses/bitcoin-basics` | Fundamentos de Bitcoin y blockchain |
| `/courses/crypto-security` | Seguridad y autocustodia |
| `/courses/defi-essentials` | Introducción a DeFi |
| `/stocks` | Guía educativa de activos digitales |
| `/meteora-pools` | Pools DLMM en tendencia |
| `/administrator` | Panel de demostración, disponible para usuarios autenticados |

## Datos y limitaciones

- **Firebase:** el login requiere configurar `.env.local` y habilitar Email/Password y Google en Firebase Console. Las cuentas de correo se crean en la consola; Google puede crear la cuenta al primer acceso.
- **Administrador:** es una maqueta con métricas y cursos ilustrativos. La ruta exige autenticación, pero no hay roles, backend ni operaciones de gestión conectadas.
- **Activos:** la página `/stocks` ofrece descripciones educativas; no muestra precios ni sugiere comprar o vender.
- **Ticker:** las cotizaciones dependen de la conexión del navegador con el WebSocket público de Binance y pueden no estar disponibles en todas las redes o regiones.
- **Meteora:** `/meteora-pools` consulta la API pública de Meteora y necesita conexión a internet. Los datos pueden variar y no predicen resultados futuros.

## Estructura del proyecto

```text
src/
├── components/shared/     # Navegación y pie de página
├── pages/                 # Inicio, login, cursos, activos y vistas
├── App.jsx                # Rutas y estructura general
├── academy.css            # Estilos de la academia
├── CryptoTicker.jsx       # Cotizaciones en tiempo real
└── main.jsx               # Punto de entrada de React
```

## Licencia

Este repositorio no declara una licencia de uso. Añade una licencia antes de distribuir o reutilizar el proyecto.
