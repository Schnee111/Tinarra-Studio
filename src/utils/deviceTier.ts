let cachedDesktopParticleSize: number | null = null;

/**
 * Dynamic device tier detector for desktop WebGL particle rendering.
 * Defaults desktop to high-fidelity (420 = 176,400 particles) for rich visual mass,
 * and gracefully scales down only on resource-constrained or software-emulated environments:
 * - High Tier (Default for modern desktops, Apple Silicon, modern laptops): 420 (176,400 particles)
 * - Mid Tier (Cores <= 4 on basic integrated graphics): 320 (102,400 particles)
 * - Low Tier (Software rasterizer, SwiftShader, legacy Intel HD): 260 (67,600 particles)
 */
export function getDesktopParticleSize(): number {
  if (cachedDesktopParticleSize !== null) {
    return cachedDesktopParticleSize;
  }

  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return 420; // Safe desktop SSR default
  }

  let detectedSize = 420;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = (
        debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ""
      ) as string;
      const rendererLower = (renderer || "").toLowerCase();

      const loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) {
        loseContext.loseContext();
      }

      const isSoftwareOrVirtual =
        rendererLower.includes("swiftshader") ||
        rendererLower.includes("llvmpipe") ||
        rendererLower.includes("software rasterizer") ||
        rendererLower.includes("virtualbox") ||
        rendererLower.includes("vmware");

      const isOldLegacyIntegrated =
        rendererLower.includes("hd graphics") && !rendererLower.includes("uhd");

      if (isSoftwareOrVirtual || isOldLegacyIntegrated) {
        detectedSize = 260;
      } else {
        const cores = navigator.hardwareConcurrency;
        // Only throttle if hardwareConcurrency explicitly reports <= 4 cores on basic integrated graphics
        if (
          cores &&
          cores <= 4 &&
          (rendererLower.includes("intel") || rendererLower.includes("uhd"))
        ) {
          detectedSize = 320;
        } else {
          detectedSize = 420;
        }
      }
    } else {
      const cores = navigator.hardwareConcurrency;
      if (cores && cores <= 4) {
        detectedSize = 320;
      } else {
        detectedSize = 420;
      }
    }
  } catch {
    detectedSize = 420;
  }

  cachedDesktopParticleSize = detectedSize;
  return detectedSize;
}
