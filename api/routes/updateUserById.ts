import * as jwt from 'jsonwebtoken';
import { User } from '../../models';
import { OperationError } from '../errors';
import config from '../../config';

//	Обработчик маршрута обновления пользователя
export default async function updateUserById(ctx) {
	const { ...args } = ctx.request.body;

	const token = ctx.headers.authorization?.split(' ')[1];

	if (token) {
		try {
			//	Сверяем токены
			const decoded = jwt.verify(token, config.secretKey);
			const userId: number = decoded.userId;

			const result = await User.updateUserById(userId, args);

			ctx.body = { data: result };
		} catch (error) {
			if (error instanceof OperationError) ctx.body = { error: error.toJSON() };
			else throw error;
		}
	} else ctx.status = 403;
}
