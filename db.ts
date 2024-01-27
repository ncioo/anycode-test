import { Pool } from 'pg';
import config from './config';
import queries from './models/queries';

//	Инициализируем подключение к БД
const pool = new Pool({
	user: config.dbUser,
	host: config.dbHost,
	database: config.dbName,
	password: config.dbPassword,
	port: config.dbPort
});

//	Проверяем существование нужной таблицы
pool.query(queries.createTable);

export default pool;
