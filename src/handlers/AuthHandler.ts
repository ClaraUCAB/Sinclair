import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.ts";
import { ApiResponse } from "../types/index.ts";

export class AuthHandler {
    constructor(private service: AuthService) {}

    async register(req: Request, res: Response) {
        res
            .setHeader('Authorization', 'Bearer waos')
            .setHeader('X-Que', 'So')
            .type('application/json')
            .send('{"waos": 11037}');
    }

    async login(req: Request, res: Response) {
        res
            .setHeader('Authorization', 'Bearer waos')
            .setHeader('X-Que', 'So')
            .type('application/json')
            .send('{"waos": 11037}');
    }
}

