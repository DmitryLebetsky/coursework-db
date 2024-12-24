const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authController = {
    async register(req, res) {
        const { username, password, role } = req.body;

        try {

            // Проверка, что действие выполняет администратор
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied: Only admins can create accounts' });
            }

            // Проверка уникальности имени пользователя
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Создание пользователя
            const user = await User.create(username, password, role);
            // Исключаем пароль из возвращаемого объекта
            const { password: _, ...userWithoutPassword } = user;
            res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
        } catch (error) {
            res.status(500).json({ message: 'Registration error', error });
        }
    },

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Создание JWT токена
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            res.json({ message: 'Login successful', token, role: user.role });
        } catch (error) {
            res.status(500).json({ message: 'Login error', error });
        }
    },

    logout(req, res) {
        // Удаляем токен на клиенте, либо на сервере добавляем логику,
        // например, логировать выход пользователя, если нужно
        res.status(200).json({ message: 'Logout successful' });
    },
    
    async getRecruiters(req, res) {
        try {
            // Получаем всех пользователей с ролью 'recruiter'
            const recruiters = await User.getByRole('recruiter');
            res.json(recruiters);
        } catch (error) {
            console.error('Error retrieving recruiters:', error);
            res.status(500).json({ message: 'Error retrieving recruiters', error });
        }
    },

    async deleteUser(req, res) {
        const { id } = req.params;
    
        try {
            // Удаляем пользователя по ID
            const deletedUser = await User.delete(id);
            if (deletedUser) {
                res.json({ message: 'User deleted successfully', deletedUser });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }
};

module.exports = authController;
