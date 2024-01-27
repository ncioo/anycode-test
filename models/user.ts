import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import pool from '../db';
import { NotFoundError, IncorrectDataError, AlreadyExistsError } from '../api/errors';
import config from '../config';

import queries from './queries';

//	Тип пользователя
type UserType = {
	id: number; //			Первичный ключ
	name: string; //		Имя пользователя
	email: string; //		Адрес электронной почты
	password: string; // 	Хешированный пароль
	role: string; //		Роль
};

class User {
	constructor() {}

	/**
	 * Метод логина пользователя
	 * @param email		Емейл пользователя
	 * @param password 	Хешированный пароль пользователя
	 * @returns			JWT-токен доступа
	 */
	static async login(email: string, password: string) {
		//	Ищем пользователя по емейлу
		const isUserExist = await pool.query('SELECT * FROM users WHERE email = $1', [
			email
		]);

		if (isUserExist.rows.length == 0) throw new NotFoundError('User not found');

		const user: UserType = isUserExist?.rows[0];

		//	Сверяем пароли
		const isPasswordMatch: boolean = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch) throw new IncorrectDataError('Invalid password');

		//	Генерируем токен
		const token: string = jwt.sign({ userId: user.id }, config.secretKey, {
			expiresIn: '1h'
		});

		return token; //	Возвращаем токен доступа
	}

	/**
	 * Метод регистрации пользователя
	 * @param name 		Имя пользователя
	 * @param email 	Емейл пользователя
	 * @param password 	Обычный пароль пользователя
	 * @returns			JWT-токен доступа
	 */
	static async register(name: string, email: string, password: string) {
		//	Ищем пользователя по емейлу
		const isEmailExist = await pool.query('SELECT * FROM users WHERE email = $1', [
			email
		]);

		if (isEmailExist.rows.length > 0)
			throw new AlreadyExistsError('Email already exist');

		//	Вызываем метод createUser()
		const user = await this.createUser(name, email, password);

		//	Генерируем токен
		const token: string = jwt.sign({ userId: user.id }, config.secretKey, {
			expiresIn: '1h'
		});

		return token; //	Возвращаем токен доступа
	}

	/**
	 * Метод получения всех пользователей
	 * @returns Массив объектов пользователей
	 */
	static async getUsers() {
		const result = await pool.query('SELECT id, name, email FROM users');

		const users: Array<UserType> = result?.rows;

		return users; //	Возвращаем массив пользователей
	}

	/**
	 * Метод получения конкретного пользователя по его ID
	 * @returns Объект пользователя
	 */
	static async getUserById(id: number) {
		const result = await pool.query(queries.getUserById, [id]);

		if (result.rows.length == 0) throw new NotFoundError('User not found');

		const user: UserType = result?.rows[0];

		return user; //		Возвращаем найденного пользователя
	}

	/**
	 * Метод создания пользователя с хешированием его пароля
	 * @param name 		Имя пользователя
	 * @param email 	Емейл пользователя
	 * @param password 	Обычный пароль пользователя
	 * @returns 		Объект созданного пользователя
	 */
	static async createUser(name: string, email: string, password: string) {
		if (!name || !email || !password)
			throw new IncorrectDataError('Incorrect data provided');

		//	Хешируем пароль
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		//	Добавляем пользователя в БД
		const result = await pool.query(queries.createUser, [
			name,
			email,
			hashedPassword
		]);

		const user: UserType = result?.rows[0];

		return user; //		Возвращаем часть данных созданного пользователя
	}

	/**
	 * Метод удаления конкретного пользователя по его ID
	 * @param id 	ID пользователя
	 * @returns 	Объект удаленного пользователя
	 */
	static async deleteUserById(id: number) {
		//	Удаляем пользователя из БД
		const result = await pool.query(queries.deleteUserById, [id]);

		if (result.rows.length == 0) throw new NotFoundError('User not found');

		const user: UserType = result?.rows[0];

		return user; //		Возвращаем часть данных удаленного пользователя
	}

	/**
	 * Метод обновления полей конкретного пользователя по его ID
	 * @param id 	ID пользователя
	 * @param args 	Объект с изменяемыми полями пользователя
	 * @returns 	Объект измененного пользователя
	 */
	static async updateUserById(id: number, args: object) {
		//	Массивы для работы с генерацией SQL-запроса
		const updates: Array<string> = [],
			values: Array<any> = [id];

		//	Собираем массивы из объекта изменений
		for (const key in args) {
			if (key === 'password') continue;

			updates.push(`${key} = $${values.length + 1}`);
			values.push(args[key]);
		}

		//	Собираем финальный SQL-запрос
		const query = `UPDATE users 
			SET ${updates.join(', ')}
			WHERE id = $1
			RETURNING id, name, email;`;

		//	Обновляем пользователя
		const result = await pool.query(query, values);

		if (result.rows.length == 0) throw new NotFoundError('User not found');

		const user: UserType = result?.rows[0];

		return user; //		Возвращаем часть данных обновленного пользователя
	}

	/**
	 * Метод получения роли конкретного пользователя по его ID
	 * @param id 	ID пользователя
	 * @returns 	Объект пользователя с его ролью
	 */
	static async checkRoleById(id: number) {
		const result = await pool.query(`SELECT role FROM users WHERE id = $1`, [id]);

		const user: UserType = result?.rows[0];

		return user; //		Возвращаем найденного пользователя и его роль
	}
}

export default User;
