import { NextFunction, Request, Response } from "express";
import { IUserDocument } from "../models/user";
import { Role } from "../models/user"

// takes in a role and returns a middleware function

export const authorise = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user: IUserDocument = req?.user as IUserDocument;
        if (user.role !== role) {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        next();
    }
}
