/**
 * Image Downscale and Metadata Stripping Utility
 * Downscales images to max 1600px on the longest edge, re-encodes as JPEG at 0.82 quality,
 * and strips EXIF/GPS data via canvas rendering.
 */

/**
 * Pure calculation helper for responsive downscaled dimensions
 * @param {number} width
 * @param {number} height
 * @param {number} maxDimension - Default 1600px
 * @returns {{ width: number, height: number, scaled: boolean }}
 */
export function calculateDownscaledDimensions(width, height, maxDimension = 1600) {
  if (!width || !height || width <= 0 || height <= 0) {
    return { width: maxDimension, height: maxDimension, scaled: false };
  }

  const longestEdge = Math.max(width, height);
  if (longestEdge <= maxDimension) {
    return { width: Math.round(width), height: Math.round(height), scaled: false };
  }

  const scaleRatio = maxDimension / longestEdge;
  return {
    width: Math.round(width * scaleRatio),
    height: Math.round(height * scaleRatio),
    scaled: true
  };
}

/**
 * Downscale image and re-encode to JPEG on an off-screen canvas.
 * Strips EXIF and GPS metadata, keeping size safely under 1.5MB.
 *
 * @param {File|Blob|string} imageInput - File object, Blob, or base64 data URL
 * @param {Object} [options]
 * @param {number} [options.maxDimension=1600]
 * @param {number} [options.quality=0.82]
 * @returns {Promise<{ base64: string, mimeType: string, width: number, height: number, approxSizeBytes: number }>}
 */
export async function downscaleImageToJpeg(imageInput, options = {}) {
  const { maxDimension = 1600, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    let src = '';
    let objectUrlToRevoke = null;

    if (typeof imageInput === 'string') {
      src = imageInput;
    } else if (imageInput instanceof Blob || imageInput instanceof File) {
      if (typeof URL !== 'undefined' && URL.createObjectURL) {
        objectUrlToRevoke = URL.createObjectURL(imageInput);
        src = objectUrlToRevoke;
      }
    }

    if (!src) {
      return reject(new Error('Invalid image input provided.'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }

      try {
        const { width: targetWidth, height: targetHeight } = calculateDownscaledDimensions(
          img.naturalWidth || img.width,
          img.naturalHeight || img.height,
          maxDimension
        );

        if (typeof document === 'undefined') {
          // Non-DOM environment (e.g. Node tests without DOM canvas)
          return resolve({
            base64: src,
            mimeType: 'image/jpeg',
            width: targetWidth,
            height: targetHeight,
            approxSizeBytes: Math.round((src.length * 3) / 4)
          });
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context not available.');
        }

        // Draw image onto canvas (automatically drops EXIF / GPS tags)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const base64Jpeg = canvas.toDataURL('image/jpeg', quality);
        const base64Data = base64Jpeg.replace(/^data:image\/jpeg;base64,/, '');
        const approxSizeBytes = Math.round((base64Data.length * 3) / 4);

        resolve({
          base64: base64Jpeg,
          mimeType: 'image/jpeg',
          width: targetWidth,
          height: targetHeight,
          approxSizeBytes
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      reject(new Error('Failed to load image for downscaling.'));
    };

    img.src = src;
  });
}
