---
marp: true
---

# Práctica: Desarrollo colaborativo de un videojuego web con metodologías ágiles

## Objetivo de la práctica
Iniciar al alumnado en el desarrollo colaborativo de un proyecto software realista utilizando **GitHub como control de versiones**, **VS Code como entorno de desarrollo** y **Antigravity como asistente de generación de código**, aplicando una organización básica inspirada en **SCRUM**.

---

## Parte 1. Preparación del entorno de trabajo

### 1. Configuración inicial
Cada alumno debe asegurarse de tener:
- Visual Studio Code instalado.
- Una cuenta activa en GitHub.
- Antigravity instalado y operativo en VS Code.

Los pasos concretos de instalación y configuración no se detallan deliberadamente. El alumnado deberá localizarlos, probarlos y resolverlos en grupo, documentando las dificultades encontradas.

---

### 2. Creación y conexión del repositorio
1. Crear un repositorio nuevo en GitHub (nombre libre).
2. Activar **GitHub Pages**:
   - Rama: `main`
   - Carpeta: raíz del proyecto.
3. Comprobar que la web es accesible desde la siguiente URL:https://USUARIO.github.io/NOMBRE_DEL_REPO/

---

### 3. Integración con Antigravity y VS Code
- Clonar el repositorio utilizando Antigravity.
- Abrir el proyecto en Visual Studio Code.
- Configurar:
- **Live Server** para visualizar los cambios en tiempo real.
- **Git** desde la consola de VS Code:
 ```
 git config --global user.name "username"
 git config --global user.email "your.email@example.com"
 ```

---

### 4. Primer contacto con el flujo de trabajo
1. Solicitar a Antigravity una primera modificación sencilla del proyecto (por ejemplo, generar una estructura HTML básica).
2. Realizar el primer commit:
- Usar el apartado *Source Control* de VS Code.
- Escribir un mensaje de commit claro y descriptivo.
- Ejecutar *commit & push*.
3. Configurar el acceso a GitHub:
- Generar un **Personal Access Token** (usando la plantilla sugerida).
- Copiar el token (`ghp_…`) y pegarlo cuando VS Code lo solicite.

---

## Parte 2. Inicio del proyecto

### Organización del trabajo
- Grupos de **3 personas**.
- Cada grupo debe acordar:
- Reparto de tareas.
- Normas básicas de commits.
- Estrategia de comunicación y coordinación.

---

## Requisitos del proyecto

### Estructura general
- Menú principal desde el que se accede al juego.
- Un juego principal que encadena **12 microjuegos**:
- 4 microjuegos diseñados por cada integrante.
- El jugador dispone de **4 vidas**:
- Cada fallo resta una vida.
- Al perder todas las vidas, el juego finaliza.

---

### Microjuegos
Cada microjuego debe cumplir los siguientes criterios:
- Un objetivo único y claramente definido.
- Un tiempo límite para completarlo.
- Interacción directa mediante ratón y/o teclado.
- Dificultad basada en físicas simples o en control preciso.

Ejemplo orientativo (no obligatorio):
> Arrastrar con el ratón una cerilla y encenderla antes de que se agote el tiempo. El sistema de físicas dificulta la acción. Si el tiempo se acaba sin cumplir el objetivo, el jugador pierde una vida y continúa con el siguiente microjuego.

---

### Contenido educativo
- Cada microjuego debe estar relacionado con uno o varios **Objetivos de Desarrollo Sostenible**.
- Se valorará especialmente la relación con:
- Energía sostenible.
- Consumo responsable.
- Protección del medio ambiente.

---

## Parte 3. Gestión del proyecto

### Planificación
- Elaborar un **diagrama de Gantt sencillo** que contemple:
- Diseño.
- Desarrollo.
- Integración.
- Pruebas.

---

### Organización de tareas
- Uso de **Trello** (u otra herramienta similar) para:
- Definir el backlog.
- Asignar tareas.
- Hacer seguimiento del progreso.

---

### Control de versiones
- GitHub será el repositorio único del proyecto.
- Se tendrá en cuenta:
- Frecuencia de commits.
- Claridad de los mensajes.
- Coordinación entre los miembros del grupo.

---

## Ampliación (opcional)
- Investigar el uso de un servidor para permitir la competición entre varios jugadores:
- Ranking de puntuaciones.
- Resultados compartidos.
- Multijugador básico.

---

### Consideración final
Este proyecto no tiene un único camino correcto. Se valorará especialmente la toma de decisiones en grupo, la resolución de problemas técnicos y la coherencia entre diseño, implementación y organización del trabajo.
