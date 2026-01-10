import { Request, Response } from 'express';
import { AuthService, RegisterStatus, LoginStatus } from '../services/AuthService.ts';
import { ApiResponse, AuthApiResponse } from '../types/index.ts';

export class AuthHandler {
	constructor(private service: AuthService) {}

	async register(req: Request, res: Response) {
		if (!req.body) {
			const response = {
				success: false,
				error: 'La petición no tiene cuerpo.',
				timestamp: new Date().toISOString(),
			};

			res.status(400).json(response).send();
		}

		const email = req.body.email;
		const password = req.body.password;
		const registerStatus = await this.service.register(email, password);

		if (registerStatus !== RegisterStatus.Success) {
			const error = (() => {
				switch (registerStatus) {
					case RegisterStatus.EmailTaken:
						return 'Email ya tomado.';
					case RegisterStatus.EmailEmpty:
						return 'Email no suministrado.';
					case RegisterStatus.PasswordEmpty:
						return 'Contraseña no suministrada.';
					case RegisterStatus.PasswordTooLong:
						return 'Contraseña demasiado larga';
					default:
						return 'Error desconocido.';
				}
			})();

			console.log(error);

			const response = {
				success: false,
				error: error,
				timestamp: new Date().toISOString(),
			};

			res.status(400).json(response).send();
		}

		// Usuario registrado exitósamente
		res.status(200).send();
	}

	async login(req: Request, res: Response) {
		if (!req.body) {
			const response = {
				success: false,
				error: 'La petición no tiene cuerpo.',
				timestamp: new Date().toISOString(),
			};

			res.status(400).json(response).send();
		}

		const email = req.body.email;
		const password = req.body.password;
		const [loginStatus, token] = await this.service.login(email, password);

		if (loginStatus !== LoginStatus.Success) {
			const error = (() => {
				switch (loginStatus) {
					case LoginStatus.InvalidEmail:
						return 'Email inválido.';
					case LoginStatus.WrongPassword:
						return 'Contraseña incorrecta.';
					default:
						return 'Error desconocido.';
				}
			})();

			console.log(error);

			const response = {
				success: false,
				error: error,
				timestamp: new Date().toISOString(),
			};

			res.status(400).json(response).send();
		}

		// Usuario inició sesión exitósamente
		const response: AuthApiResponse = {
			success: true,
			data: { token: token },
			timestamp: new Date().toISOString(),
		};

		res.status(200).json(response).send();
	}
}
