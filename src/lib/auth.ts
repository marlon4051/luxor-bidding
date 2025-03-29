import { SignJWT, jwtVerify } from 'jose';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET || 'default_secret_key';

const secret = new TextEncoder().encode(secretKey);

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  const token = await new SignJWT({ 
    userId: user.id, 
    email: user.email 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);

  return { user, token };
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
};
