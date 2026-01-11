import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';

import { UserModel } from '../models/User.ts';

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

interface UserPayload {
	id: string;
	email: string;
}

export enum RegisterStatus {
	Success,
	EmailTaken,
	EmailEmpty,
	PasswordEmpty,
	PasswordTooLong,
}

export enum LoginStatus {
	Success,
	InvalidEmail,
	WrongPassword,
}

export class AuthService {
	private async hashPassword(password: string): Promise<string> {
		const ROUNDS = 12;
		const salt = await bcrypt.genSalt(ROUNDS);
		return await bcrypt.hash(password, salt);
	}

	private async validatePassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}

	private generateJWT(userId: string, email: string): string {
		if (!JWT_SECRET) throw new Error('Falta JWT_SECRET en el .env');

		const EXPIRES_IN = '2h';
		const payload: UserPayload = { id: userId, email };

		return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
	}

	async verifyJWT(token: string): Promise<boolean> {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

			if (!decoded?.id || !decoded?.email) return false;

			// Confirma existencia en DB
			const exists = await UserModel.exists({
				_id: new mongoose.Types.ObjectId(decoded.id),
				email: decoded.email.toLowerCase(),
			});

			return !!exists;
		} catch {
			return false;
		}
	}

	async register(email: string, password: string): Promise<RegisterStatus> {
		if (!email) return RegisterStatus.EmailEmpty;
		if (!password) return RegisterStatus.PasswordEmpty;
		if (password.length > 72) return RegisterStatus.PasswordTooLong;

		const normalizedEmail = email.trim().toLowerCase();

		const alreadyExists = await UserModel.exists({ email: normalizedEmail });
		if (alreadyExists) return RegisterStatus.EmailTaken;

		const hash = await this.hashPassword(password);

		await UserModel.create({
			email: normalizedEmail,
			password: hash, // guardamos el hash bcrypt en "password"
			// createdAt se genera solo por timestamps
		});

		return RegisterStatus.Success;
	}

	async login(email: string, password: string): Promise<[LoginStatus, string | null]> {
		const normalizedEmail = email?.trim().toLowerCase();

		const user = await UserModel.findOne({ email: normalizedEmail }).lean();
		if (!user) return [LoginStatus.InvalidEmail, null];

		const ok = await this.validatePassword(password, user.password);
		if (!ok) return [LoginStatus.WrongPassword, null];

		const token = this.generateJWT(String(user._id), user.email);
		return [LoginStatus.Success, token];
	}
}