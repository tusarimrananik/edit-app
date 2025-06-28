"use server";
import prisma from "@/lib/prisma";

export async function setActiveBrowser(name: string) {
    await prisma.$transaction([
        // Set all selections to inactive.
        prisma.browsers.updateMany({
            data: { isActive: false },
        }),
        // Activate the desired selection.
        prisma.browsers.update({
            where: { name: name },
            data: { isActive: true },
        }),
    ]);
}

export async function getActiveBrowser() {
    try {
        const activeSelection = await prisma.browsers.findFirst({
            where: { isActive: true },
        });
        return activeSelection;
    } catch (error) {
        console.error("Error fetching active selection:", error);
        throw error;
    }
}

