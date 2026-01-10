import bcrypt from 'bcryptjs';
import { User } from '../models/User.ts';

import * as jwt from 'jsonwebtoken';
import { Secret, JwtPayload } from 'jsonwebtoken';

interface UserPayload {
	id: string;
	email: string;
	dateCreated: Date;
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

// Max allowed input length for bcryptjs is 72.
// Max hash length generated is 60. We'll use 72.
/* class CredentialsPO {
    private email: string;
    private password: string;

    constructor(email: string, password: string) {
        if (!email)
            throw new Error();
    }
} */

export class AuthService {
	// TODO: Temporary memory db while we get the actual db
	private users: User[] = [];
	private incrementalId: string = '0';

	/**
	 * Hashes a plaintext password.
	 * @param {string} plaintext
	 * @returns {string} - Hashed password.
	 */
	private async hashPassword(password: string): Promise<string> {
		// Parameters for encryption
		const ROUNDS: number = 12;

		const salt = await bcrypt.genSalt(ROUNDS);
		const hash = await bcrypt.hash(password, salt);

		return hash;
	}

	/**
	 * Compares a password with a hash.
	 * @param {string} password
	 * @param {string} hash
	 * @returns {boolean} - true if valid, false otherwise.
	 */
	private async validatePassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}

	// TODO: Will probably remove
	private storeUser(email: string, password: string) {
		const user: User = {
			id: this.incrementalId,
			email: email,
			password: password,
			createdAt: new Date(),
		};

		this.incrementalId += Math.floor(Math.random()).toString();

		this.users.push(user);
	}

	// TODO: Remove this too
	private getUserFromEmail(email: string): User | null {
		for (const user of this.users) {
			if (user.email === email) return user;
		}

		return null;
	}

	private generateJWT(user: User): string {
		// JWT Parameters
		const EXPIRES_IN: string = '2h';
		const JWT_SECRET: Secret = process.env.JWT_SECRET;

		const payload: UserPayload = {
			id: user.id,
			email: user.email,
			dateCreated: user.dateCreated,
		};

		const token = jwt.sign(payload, JWT_SECRET, {
			expiresIn: EXPIRES_IN,
		});

		return token;
	}

	async register(email: string, password: string): Promise<RegisterStatus> {
		// TODO: Extract all this behaviour
		if (!email) return RegisterStatus.EmailEmpty;

		if (!password) return RegisterStatus.PasswordEmpty;

		if (password.length > 72) return RegisterStatus.PasswordTooLong;

		// TODO: Check if email is taken. We need the db for this!
		if (this.getUserFromEmail(email)) return RegisterStatus.EmailTaken;

		const hash = await this.hashPassword(password);
		console.log(`[DEBUG] ${email}:${hash}.`); // TODO: Remove debug

		// TODO: Store in db. We need db!!!
		this.storeUser(email, hash);

		return RegisterStatus.Success;
	}

	async login(email: string, password: string): [Promise<LoginStatus>, string | null] {
		const user = this.getUserFromEmail(email);

		if (!user) return [LoginStatus.InvalidEmail, null];

		if (!(await this.validatePassword(password, user.password))) return [LoginStatus.WrongPassword, null];

		const token = this.generateJWT(user);
		return [LoginStatus.Success, token];
	}
}
