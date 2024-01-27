import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

import { mountRoutes } from './api';
import pool from './db';
import config from './config';

const app: Koa = new Koa();

//	После подключения к БД и импорта конфига - создаем сервер
(async () => {
	//	Подключаем парсер тела запросов
	app.use(bodyParser());

	//	И добавляем обработчики маршрутов
	mountRoutes(app);

	//	Сервер работает
	app.listen(config.serverPort, () => console.log('App is running.'));
})();
