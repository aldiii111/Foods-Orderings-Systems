import { Response, NextFunction } from "express";
import { CustomRequest } from "../types";

export const rbacMiddleware = (allowedRoles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction): any => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Token missing." });
        }
        
        const userRole = req.user.role.toUpperCase();
        const allowedUpper = allowedRoles.map(r => r.toUpperCase());
        
        // Let's also handle lowercase comparisons (e.g. staff/customer vs STAFF/CUSTOMER)
        if (allowedUpper.includes(userRole) || allowedUpper.includes(req.user.role)) {
            return next();
        }

        return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
    };
};
