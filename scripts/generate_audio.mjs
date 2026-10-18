import fs from 'fs';
import path from 'path';

const soundsDir = path.resolve('public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

function createWav(filename, durationSec, sampleRate, generator) {
  const numSamples = Math.floor(durationSec * sampleRate);
  const bytesPerSample = 2; // 16-bit
  const blockAlign = bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generator(t, durationSec)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  const filePath = path.join(soundsDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated local audio: ${filename} (${buffer.length} bytes)`);
}

// 1. pop.wav - gentle wooden pop
createWav('pop.wav', 0.08, 22050, (t, dur) => {
  const env = Math.exp(-t * 40);
  const freq = 440 + (1 - t / dur) * 300;
  return Math.sin(2 * Math.PI * freq * t) * env * 0.4;
});

// 2. success.wav - gentle harmonious chime
createWav('success.wav', 0.35, 22050, (t) => {
  const env = Math.exp(-t * 8);
  const chord = (
    Math.sin(2 * Math.PI * 523.25 * t) +
    Math.sin(2 * Math.PI * 659.25 * t) * 0.8 +
    Math.sin(2 * Math.PI * 783.99 * t) * 0.6
  ) / 2.4;
  return chord * env * 0.35;
});

// 3. swap.wav - uplifting eco swap tone
createWav('swap.wav', 0.28, 22050, (t) => {
  const env = Math.exp(-t * 9);
  const chord = (
    Math.sin(2 * Math.PI * 440 * t) +
    Math.sin(2 * Math.PI * 554.37 * t) * 0.8 +
    Math.sin(2 * Math.PI * 659.25 * t) * 0.6
  ) / 2.4;
  return chord * env * 0.35;
});

// 4. click.wav - soft tactile click
createWav('click.wav', 0.04, 22050, (t) => {
  const env = Math.exp(-t * 100);
  return Math.sin(2 * Math.PI * 1200 * t) * env * 0.25;
});

console.log('✅ All local sound files generated successfully in public/sounds!');
