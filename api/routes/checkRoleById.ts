import { User } from '../../models';

//	Обработчик секретного маршрута
export default async function checkRoleById(ctx) {
	const id = ctx.params.id;

	const result = await User.checkRoleById(id);

	if (result?.role === 'ADMIN') ctx.status = 200;
	else ctx.status = 403;
}
