SISTEMA MÉDICO - ESTRUCTURA DE ARCHIVOS

Abre index.html en tu navegador para ejecutar el sistema.

Estructura:
- index.html: estructura HTML y pestañas del paciente.
- css/styles.css: estilos CSS propios.
- js/data.js: datos iniciales, médicos y estado del paciente.
- js/storage.js: guardado y carga con localStorage.
- js/auth.js: inicio de sesión, registro y recuperación de contraseña.
- js/navigation.js: cambio entre pestañas.
- js/profile.js: datos y actualización del perfil.
- js/appointments.js: citas médicas y selección de médicos.
- js/ui.js: ventanas modales, SOS y notificaciones.
- js/init.js: inicialización al cargar la página.

NOTAS:
- Se conservó la página como una aplicación de una sola pantalla con pestañas, tal como estaba en el archivo original.
- Tailwind CSS, Font Awesome e Inter siguen cargándose desde internet, por lo que se necesita conexión para esos recursos externos.
- Los datos se guardan en el almacenamiento local del navegador; no hay servidor ni base de datos real.
- La división conserva el código original. Algunas funciones referenciadas desde el HTML original podrían no estar implementadas en ese archivo y necesitarían revisarse por separado.
