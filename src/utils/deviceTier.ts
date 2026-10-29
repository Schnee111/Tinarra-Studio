let cachedDesktopParticleSize: number | null = null;

/**
 * Heuristic device tier detector for desktop WebGL particle rendering.
 * Scales particle FBO resolution dynamically:
 * - High Tier (Dedicated GPU / Apple Silicon / >=8 cores & high RAM): 420 (176,400 particles)
 * - Mid Tier (Modern iGPU Iris Xe/Radeon / 6-8 cores): 320 (102,400 particles)
 * - Entry Tier (Basic iGPU / low cores): 240 (57,600 particles)
 */
export function getDesktopParticleSize(): number {
  if (cachedDesktopParticleSize !== null) {
    return cachedDesktopParticleSize;
  }

  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return 320; // Safe SSR default
  }

  let detectedSize = 320;

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

      // Clean up WebGL context if loseContext extension is supported
      const loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) {
        loseContext.loseContext();
      }

      const isHighEndGPU =
        rendererLower.includes("apple") ||
        rendererLower.includes("nvidia") ||
        rendererLower.includes("geforce") ||
        rendererLower.includes("rtx") ||
        rendererLower.includes("gtx") ||
        rendererLower.includes("quadro") ||
        (rendererLower.includes("radeon") &&
          (rendererLower.includes("rx") ||
            rendererLower.includes("pro") ||
            !rendererLower.includes("integrated")));

      const isMidEndGPU =
        rendererLower.includes("iris") ||
        rendererLower.includes("xe") ||
        rendererLower.includes("radeon") ||
        rendererLower.includes("adreno");

      const isLowEndGPU =
        rendererLower.includes("hd graphics") ||
        rendererLower.includes("uhd graphics") ||
        rendererLower.includes("swiftshader") ||
        rendererLower.includes("llvmpipe") ||
        rendererLower.includes("software");

      if (isHighEndGPU) {
        detectedSize = 420;
      } else if (isMidEndGPU) {
        detectedSize = 320;
      } else if (isLowEndGPU) {
        const cores = navigator.hardwareConcurrency || 4;
        const memory =
          (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
        detectedSize = cores >= 8 && memory >= 8 ? 320 : 240;
      } else {
        // Unidentified GPU - fall back to hardwareConcurrency & deviceMemory
        const cores = navigator.hardwareConcurrency || 4;
        const memory =
          (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
        if (cores >= 8 && memory >= 8) {
          detectedSize = 420;
        } else if (cores >= 6 || memory >= 6) {
          detectedSize = 320;
        } else {
          detectedSize = 240;
        }
      }
    } else {
      // No WebGL context available for probing, fall back to CPU/RAM
      const cores = navigator.hardwareConcurrency || 4;
      const memory =
        (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
      detectedSize = cores >= 8 && memory >= 8 ? 420 : (cores >= 6 ? 320 : 240);
    }
  } catch {
    // If probing throws for any reason, default to 320
    detectedSize = 320;
  }

  cachedDesktopParticleSize = detectedSize;
  return detectedSize;
}
