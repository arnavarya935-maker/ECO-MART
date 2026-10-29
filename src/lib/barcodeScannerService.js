/**
 * Offline-first Barcode Scanner Service using local bundled WASM.
 * Zero CDN URLs. Seamlessly polyfills native BarcodeDetector when missing.
 */
import zxingWasmUrl from 'zxing-wasm/reader/zxing_reader.wasm?url';
import { BarcodeDetector as PolyfillDetector, prepareZXingModule } from 'barcode-detector/ponyfill';

let isPrepared = false;

export function getBarcodeDetectorClass() {
  // If native BarcodeDetector is available in current browser (e.g. Chrome on Android or macOS)
  if (typeof globalThis !== 'undefined' && 'BarcodeDetector' in globalThis && globalThis.BarcodeDetector !== PolyfillDetector) {
    return globalThis.BarcodeDetector;
  }

  if (!isPrepared) {
    try {
      prepareZXingModule({
        overrides: {
          locateFile: (wasmPath, prefix) => {
            if (wasmPath.endsWith('.wasm')) {
              return zxingWasmUrl;
            }
            return prefix + wasmPath;
          }
        }
      });
      isPrepared = true;
    } catch (err) {
      console.warn('[barcodeScannerService] Error setting local WASM override:', err);
    }
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.BarcodeDetector = PolyfillDetector;
  }

  return PolyfillDetector;
}

/**
 * Creates an instance of BarcodeDetector supporting common retail & eco barcodes.
 * @param {Array<string>} formats
 * @returns {Object} BarcodeDetector instance
 */
export function createBarcodeDetector(formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code', 'code_128']) {
  const DetectorClass = getBarcodeDetectorClass();
  return new DetectorClass({ formats });
}
