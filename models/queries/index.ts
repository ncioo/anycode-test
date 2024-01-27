import { readdirSync, readFileSync } from 'fs';

const queries: any = {};
const queriesPath = __dirname;

//	Собираем все SQL-запросы из ./queries/ в один объект
//	и экспортируем его для удобного использования в функциях
readdirSync(queriesPath)
	.filter(file => file.endsWith('.sql'))
	.forEach(file => {
		const name: string = file.split('.')[0];

		const fileContent: string = readFileSync(`${queriesPath}/${file}`).toString();

		queries[name] = fileContent;
	});

export default queries;
