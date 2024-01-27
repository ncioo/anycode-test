//	Различные виды ошибок, необходимые для
//	увеличения информативности ответов
class OperationError {
	type: string;
	message: string;

	constructor(type: string, message: string) {
		this.type = type;
		this.message = message;
	}

	toJSON() {
		return { type: this.type, message: this.message };
	}
}

class NotFoundError extends OperationError {
	constructor(message: string) {
		super('NotFound', message);
	}
}

class IncorrectDataError extends OperationError {
	constructor(message: string) {
		super('IncorrectData', message);
	}
}

class AlreadyExistsError extends OperationError {
	constructor(message: string) {
		super('AlreadyExists', message);
	}
}

export { OperationError, NotFoundError, IncorrectDataError, AlreadyExistsError };
