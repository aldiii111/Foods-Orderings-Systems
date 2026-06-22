import prisma from "./prisma";

export const logActivity = async (action: string, details: string | object, userId?: number) => {
    try {
        const detailStr = typeof details === "string" ? details : JSON.stringify(details);
        await prisma.auditLog.create({
            data: {
                action,
                details: detailStr,
                userId: userId || null,
            }
        });
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
};
