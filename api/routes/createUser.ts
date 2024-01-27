import { User } from '../../models';
import { OperationError } from '../errors';

//	Обработчик маршрута создания пользователя
export default async function createUser(ctx) {
	const { name, email, password } = ctx.request.body;

	try {
		const result = await User.createUser(name, email, password);

		ctx.body = { data: result };
	} catch (error) {
		if (error instanceof OperationError) ctx.body = { error: error.toJSON() };
		else throw error;
	}
}
