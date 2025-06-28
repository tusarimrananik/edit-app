"use server"
import prisma from "@/lib/prisma";
export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            take: 10
        });
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
export async function updateEditsAndBalance(id: string, isIncrement: boolean) {
    try {
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                edits: {
                    [isIncrement ? 'increment' : 'decrement']: 1
                },
                balance: {
                    [isIncrement ? 'increment' : 'decrement']: 70
                }
            }
        });
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

//prisma fixed!
export async function canEditSet(id: string, canEdit: boolean) {
    try {
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                canEdit: canEdit
            }
        });
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}
