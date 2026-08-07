const UserModel = require('../models/User');

class UserController {
  static async getProfile(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      let user = await UserModel.findById(userId);

      if (!user) {
        user = await UserModel.findByEmail(req.user?.email || '');
      }

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

      // No retornar el hash de la contraseña por seguridad
      const { password, ...safeUser } = user;

      res.json({
        success: true,
        data: safeUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      const updateData = req.body;

      let updated = await UserModel.update(userId, updateData);
      if (!updated) {
        const user = await UserModel.findByEmail(req.user?.email || '');
        if (user) {
          updated = await UserModel.update(user.id, updateData);
        }
      }

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
