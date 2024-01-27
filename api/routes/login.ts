import { User } from '../../models';
import { OperationError } from '../errors';

//	Обработчик маршрута логина пользователя
export default async function login(ctx) {
	const { email, password } = ctx.request.body;

	try {
		//  Проверяем логин и пароль, затем получаем JWT-токен доступа
		const result = await User.login(email, password);

		ctx.body = { token: result };
	} catch (error) {
		if (error instanceof OperationError) ctx.body = { error: error.toJSON() };
		else throw error;
	}
}
