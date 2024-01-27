import * as jwt from 'jsonwebtoken';
import { User } from '../../models';
import { OperationError } from '../errors';
import config from '../../config';

//	Обработчик маршрута удаления пользователя
export default async function deleteUserById(ctx) {
	const token = ctx.headers.authorization?.split(' ')[1];

	try {
		//	Сверяем токены
		const decoded = jwt.verify(token, config.secretKey);
		const userId: number = decoded.userId;

		const result = await User.deleteUserById(userId);

		ctx.body = { data: result };
	} catch (error) {
		if (error instanceof OperationError) ctx.body = { error: error.toJSON() };
		else throw error;
	}
}
