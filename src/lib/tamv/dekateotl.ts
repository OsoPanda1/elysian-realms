/**
 * Dekateotl™ — Motor Criptográfico Avanzado TAMV
 * Hash fuerte, firmas HMAC, cifrado, verificación de integridad
 * Usa Web Crypto API (estándar del navegador)
 */

// ── SHA-256 Hash ──
export async function hash256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── SHA-512 Hash (máxima seguridad) ──
export async function hash512(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-512', encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── HMAC Sign ──
export async function hmacSign(
  data: string,
  keyData: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keyData),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── HMAC Verify ──
export async function hmacVerify(
  data: string,
  signature: string,
  keyData: string
): Promise<boolean> {
  const computed = await hmacSign(data, keyData);
  return computed === signature;
}

// ── AES-GCM Encrypt ──
export async function encrypt(
  plaintext: string,
  password: string
): Promise<{ ciphertext: string; iv: string; salt: string }> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt)),
  };
}

// ── AES-GCM Decrypt ──
export async function decrypt(
  ciphertext: string,
  password: string,
  ivB64: string,
  saltB64: string
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return decoder.decode(decrypted);
}

// ── Content Integrity ──
export async function generateContentHash(content: unknown): Promise<string> {
  const serialized = JSON.stringify(content, Object.keys(content as object).sort());
  return hash256(serialized);
}

export async function verifyContentIntegrity(
  content: unknown,
  expectedHash: string
): Promise<boolean> {
  const hash = await generateContentHash(content);
  return hash === expectedHash;
}
