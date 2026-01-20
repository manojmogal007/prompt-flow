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

export const calculatePercentage = (used: number, limit: number, isUnlimited: boolean = false) => {
  if (isUnlimited) return 100;
  return Math.round(Math.min((used / limit) * 100, 100));
};

export const getColor = (percentage: number, isUnlimited: boolean = false) => {
  if (percentage < 50 || isUnlimited)
    return {
      textColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      color: 'bg-green-500',
    };
  if (percentage < 75)
    return {
      textColor: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      color: 'bg-yellow-500',
    };
  return {
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    color: 'bg-red-500',
  };
};
