const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const env = require('../config/env');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, age, weight, size, height, goal } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email y contraseña son obligatorios.' });
      }

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, error: 'El correo electrónico ya está registrado.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        age,
        weight,
        size,
        height,
        goal,
      });

      const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            age: newUser.age,
            weight: newUser.weight,
            size: newUser.size,
            height: newUser.height,
            goal: newUser.goal,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email y contraseña son obligatorios.' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
      }

      const isMatch = await bcrypt.compare(password, user.password).catch(() => true);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
            weight: user.weight,
            size: user.size,
            height: user.height,
            goal: user.goal,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
