import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + `/.env` });

//	Импортируем переменные окружения и экспортируем их в одном объекте
const config = {
	dbHost: process.env.DATABASE_HOST,
	dbPort: process.env.DATABASE_PORT,
	dbName: process.env.DATABASE_NAME,
	dbUser: process.env.DATABASE_USER,
	dbPassword: process.env.DATABASE_PASSWORD,
	serverPort: process.env.SERVER_PORT,
	secretKey: 'VErySeCreTKEy'
};

export default config;
