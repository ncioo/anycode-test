import * as Router from 'koa-router';

const router: Router = new Router();

//	Импортируем функции-обработчики
import * as handlers from './routes';

function mountRoutes(app: any) {
	//	Корневой маршрут
	router.get('/', async ctx => {
		ctx.body = 'anycode test';
	});

	router.get('/login', handlers.login);
	router.post('/register', handlers.register);

	//	Получение всех пользователей
	router.get('/users', handlers.getUsers);

	//	Маршрут создания пользователя без регистрации
	//router.post('/users', routes.createUser);

	//	Маршрут получения конкретного пользователя
	//router.get('/users/:id', routes.getUserById);

	//	Маршруты, требующие JWT-токен:
	//	- Обновление пользователя
	router.put('/users/', handlers.updateUserById);
	//	- Удаление пользователя
	router.delete('/users/', handlers.deleteUserById);
	//

	//	Очень секретный маршрут для проверки роли пользователя
	router.get('/very/secret/route/:id', handlers.checkRoleById);

	app.use(router.routes());
}

export { mountRoutes };
