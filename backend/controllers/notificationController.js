const Notification = require('../models/Notification');

const notificationController = {
  async getNotifications(req, res) {
    const userId = req.user.userId; // Получаем ID текущего пользователя
    try {
      const notifications = await Notification.getByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  },

  async markAsRead(req, res) {
    const { notificationId } = req.params;
    try {
      const updatedNotification = await Notification.markAsRead(notificationId);
      res.json({ message: 'Notification marked as read', updatedNotification });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Error marking notification as read', error });
    }
  },
};

module.exports = notificationController;
