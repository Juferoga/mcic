# 🔬 Tesis

> **Ocultamiento seguro de información en imágenes generadas por inteligencia artificial: integración de modelos de difusión, teoría del caos y firmas digitales**

![Estado](https://img.shields.io/badge/Estado-Anteproyecto_aprobado-success?style=flat-square) ![Repo](https://img.shields.io/badge/Repo-privado_🔒-lightgrey?style=flat-square)

## ¿De qué se trata?

La esteganografía tradicional modifica una imagen portadora para esconder datos, dejando rastros estadísticos que el estegoanálisis moderno detecta cada vez mejor. Esta tesis propone un sistema **pure coverless**: el mensaje se codifica directamente en el **tensor latente caótico** que alimenta a Stable Diffusion, de modo que la imagen generada **nunca se modifica** después de su síntesis.

## Componentes clave

| Componente | Rol |
|------------|-----|
| 🌀 Atractor hipercaótico 5D memristivo | Generación determinista de latentes dependiente de clave |
| 🧊 Modelos de difusión (SD 1.5 / SDXL) | Síntesis de la imagen portadora |
| 🎯 Estimador de punto fijo libre de iteración (IFE) | Recuperación **bit-exacta** del payload sobre inversión DDIM |
| ✍️ Firmas RSA-2048 | Autenticación e integridad del mensaje extraído |

## Resultados preliminares

- **100 %** de recuperación y verificación en 20 iteraciones de benchmark.
- Calidad visual humana **10/10** con la configuración óptima (`steps=30`, `guidance=10.0`, `delta=0.1`).
- Aleatoriedad de las secuencias caóticas validada con la batería **NIST SP 800-22**.

## Equipo

**Autor:** Juan Felipe Rodríguez Galindo · **Directora:** Dra. Deicy Alvarado Nieto · **Codirectora:** MsC. Isabel Amaya Barrera
