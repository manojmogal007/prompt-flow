const toB64Url = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const fromB64Url = (b64url: string): string => {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

export const encodeNameAndId = (name: string, id?: string): string => {
  const encName = toB64Url(name);
  if (!id) return encName;
  const encId = toB64Url(id); // <-- ObjectId encoded too
  return `${encName}.${encId}`; // dot is safe (not in Base64URL alphabet)
};

export const decodeNameAndId = (token: any): { name: string; id?: string } => {
  if (!token) return { name: '' };

  const [encName, encId] = token.split('.');
  const name = fromB64Url(encName);
  const id = encId ? fromB64Url(encId) : undefined;
  return { name, id };
};

export const formatDate = (dateString: string, time = false) => {
  if (!time) return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
