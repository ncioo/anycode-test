import { User } from '../../models';
import { OperationError } from '../errors';

//	Обработчик маршрута регистрации пользователя
export default async function register(ctx) {
	const { name, email, password } = ctx.request.body;

	try {
		//  Создаем нового пользователя и получаем JWT-токен доступа
		const result = await User.register(name, email, password);

		ctx.body = { token: result };
	} catch (error) {
		if (error instanceof OperationError) ctx.body = { error: error.toJSON() };
		else throw error;
	}
}
