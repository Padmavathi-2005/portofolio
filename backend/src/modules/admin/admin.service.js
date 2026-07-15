import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';

export const authenticateAdmin = async (username, password) => {
  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!admin) {
    throw new Error('Invalid username or password');
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  // Generate JWT
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    admin: { id: admin.id, username: admin.username },
    token
  };
};

export const createAdminUser = async (username, password) => {
  const existing = await prisma.admin.findUnique({
    where: { username }
  });

  if (existing) {
    throw new Error('Admin username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.admin.create({
    data: {
      username,
      passwordHash
    }
  });

  return { id: admin.id, username: admin.username };
};
