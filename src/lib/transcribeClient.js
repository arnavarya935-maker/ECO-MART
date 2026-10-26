/**
 * Resilient Voice-to-Text & Audio Recording Client for EcoMart
 * Works seamlessly across Opera, Chrome, Edge, Firefox, Safari, and Mobile
 * Uses HTML5 MediaRecorder + Gemini Multi-model Speech-to-Text with local fallback
 */

export function isAudioRecordingSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    navigator?.mediaDevices?.getUserMedia ||
    window.MediaRecorder ||
    window.SpeechRecognition ||
    window.webkitSpeechRecognition
  );
}

/**
 * Start capturing microphone audio stream via HTML5 MediaRecorder
 * @returns {Promise<{ stop: () => Promise<Blob | null>, cancel: () => void }>}
 */
export async function startAudioCapture() {
  if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
    throw new Error('MICROPHONE_UNSUPPORTED');
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  const chunks = [];
  const mimeType = (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
    ? 'audio/webm;codecs=opus'
    : ((typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm'))
        ? 'audio/webm'
        : ((typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/mp4'))
            ? 'audio/mp4'
            : ''));

  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.start(150);

  const cleanupTracks = () => {
    try {
      stream.getTracks().forEach((track) => track.stop());
    } catch {}
  };

  return {
    stream,
    stop: () => {
      return new Promise((resolve) => {
        if (recorder.state === 'inactive') {
          cleanupTracks();
          const finalBlob = chunks.length > 0 ? new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }) : null;
          resolve(finalBlob);
          return;
        }

        recorder.onstop = () => {
          cleanupTracks();
          const finalBlob = chunks.length > 0 ? new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }) : null;
          resolve(finalBlob);
        };

        try {
          recorder.stop();
        } catch {
          cleanupTracks();
          resolve(null);
        }
      });
    },
    cancel: () => {
      try {
        if (recorder.state !== 'inactive') recorder.stop();
      } catch {}
      cleanupTracks();
    }
  };
}

/**
 * Send recorded audio blob to /api/transcribe
 * @param {Blob} audioBlob
 * @param {string} language ('en' | 'hi')
 * @returns {Promise<{ transcript: string, source: string, error?: string }>}
 */
export async function transcribeAudioBlob(audioBlob, language = 'en') {
  if (!audioBlob || audioBlob.size < 100) {
    return { transcript: '', source: 'empty_audio' };
  }

  const base64Audio = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioBase64: base64Audio,
      mimeType: audioBlob.type || 'audio/webm',
      language
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  const data = await response.json();
  return {
    transcript: typeof data.transcript === 'string' ? data.transcript.trim() : '',
    source: data.source || 'gemini_audio',
    model: data.model || null
  };
}
