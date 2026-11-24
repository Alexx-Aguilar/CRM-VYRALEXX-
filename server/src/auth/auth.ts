import crypto from 'node:crypto';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  agencyId?: string;
  brandId?: string;
  creatorId?: string;
}

const secret = () => process.env.JWT_SECRET || 'vyralexx-development-secret-change-me';

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');

export function createToken(user: AuthUser): string {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({ ...user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 });
  const unsigned = `${header}.${payload}`;
  const signature = crypto.createHmac('sha256', secret()).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;

    const unsigned = `${header}.${payload}`;
    const expected = crypto.createHmac('sha256', secret()).update(unsigned).digest('base64url');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AuthUser & { exp: number };
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      agencyId: decoded.agencyId,
      brandId: decoded.brandId,
      creatorId: decoded.creatorId
    };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key));
  });
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, salt, hash] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key));
  });
  const expected = Buffer.from(hash, 'hex');
  return expected.length === derivedKey.length && crypto.timingSafeEqual(expected, derivedKey);
}
