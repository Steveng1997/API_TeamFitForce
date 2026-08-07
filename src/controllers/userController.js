const UserModel = require('../models/User');

class UserController {
  static async getProfile(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      let user = await UserModel.findById(userId);

      if (!user) {
        const allUsers = await UserModel.findAll();
        user = allUsers[0] || {
          id: userId,
          name: 'Carlos',
          email: 'carlos@teamfit.com',
          age: '32',
          weight: '82',
          size: 'M',
          height: '178',
          goal: 'Tonificar y ganar masa muscular',
        };
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      const updateData = req.body;

      const updated = await UserModel.update(userId, updateData);

      res.json({
        success: true,
        message: 'Perfil de usuario actualizado correctamente',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
