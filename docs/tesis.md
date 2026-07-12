# Tesis

<p class="meta"><b>Estado</b> Anteproyecto aprobado · <b>Directora</b> Dra. Deicy Alvarado Nieto · <b>Codirectora</b> MsC. Isabel Amaya Barrera · <a href="https://github.com/Juferoga/mcic-tesis">Repositorio (privado)</a></p>

> **Ocultamiento seguro de información en imágenes generadas por inteligencia artificial: integración de modelos de difusión, teoría del caos y firmas digitales**

## El problema

La esteganografía tradicional modifica una imagen portadora para esconder datos, dejando rastros estadísticos que el estegoanálisis moderno detecta cada vez mejor. Esta tesis propone un sistema *pure coverless*: el mensaje se codifica directamente en el tensor latente caótico que alimenta a Stable Diffusion, de modo que la imagen generada nunca se modifica después de su síntesis.

## Componentes

| Componente | Rol |
|------------|-----|
| Atractor hipercaótico 5D memristivo | Generación determinista de latentes dependiente de clave |
| Modelos de difusión (SD 1.5 / SDXL) | Síntesis de la imagen portadora |
| Estimador de punto fijo libre de iteración (IFE) | Recuperación bit-exacta del payload sobre inversión DDIM |
| Firmas RSA-2048 | Autenticación e integridad del mensaje extraído |

## Resultados preliminares

<div class="swiss-stats" markdown>
  <div class="stat"><b>100 %</b><span>Recuperación y verificación</span></div>
  <div class="stat"><b>20</b><span>Iteraciones de benchmark</span></div>
  <div class="stat"><b>10 / 10</b><span>Calidad visual humana</span></div>
  <div class="stat"><b>SP 800-22</b><span>Batería NIST superada</span></div>
</div>

Configuración óptima: `steps=30`, `guidance=10.0`, `delta=0.1`.
