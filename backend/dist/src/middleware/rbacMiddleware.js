"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacMiddleware = void 0;
const rbacMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Token missing." });
        }
        const userRole = req.user.role.toUpperCase();
        const allowedUpper = allowedRoles.map(r => r.toUpperCase());
        if (allowedUpper.includes(userRole) || allowedUpper.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
    };
};
exports.rbacMiddleware = rbacMiddleware;
