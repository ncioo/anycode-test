import { User } from '../../models';
import { OperationError } from '../errors';

//	Обработчик маршрута получения пользователя
export default async function getUser(ctx) {
	const id = ctx.params.id;

	try {
		const result = await User.getUserById(id);

		ctx.body = { data: result };
	} catch (error) {
		if (error instanceof OperationError) ctx.body = { error: error.toJSON() };
		else throw error;
	}
}
