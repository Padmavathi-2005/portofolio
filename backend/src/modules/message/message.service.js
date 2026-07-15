import prisma from '../../config/db.js';

export const getAllMessages = async () => {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const createMessage = async (messageData) => {
  return await prisma.contactMessage.create({
    data: {
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject || null,
      message: messageData.message,
      read: false
    }
  });
};

export const markAsRead = async (id, readStatus = true) => {
  return await prisma.contactMessage.update({
    where: { id },
    data: { read: readStatus }
  });
};

export const deleteMessage = async (id) => {
  return await prisma.contactMessage.delete({
    where: { id }
  });
};
