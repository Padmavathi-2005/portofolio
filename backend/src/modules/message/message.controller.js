import * as messageService from './message.service.js';

export const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getAllMessages();
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    const newMessage = await messageService.createMessage(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    next(error);
  }
};

export const updateMessageReadStatus = async (req, res, next) => {
  try {
    const { read } = req.body;
    const updated = await messageService.markAsRead(req.params.id, read);
    res.status(200).json({ success: true, message: 'Message status updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    await messageService.deleteMessage(req.params.id);
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
