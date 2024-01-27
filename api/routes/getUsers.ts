import { User } from '../../models';

//	Обработчик маршрута получения пользователей
export default async function getUsers(ctx) {
	const result = await User.getUsers();

	ctx.body = { data: result };
}
