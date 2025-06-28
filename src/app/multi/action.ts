"use server";
import prisma from "@/lib/prisma";
export async function updateAllMultipleSteps(newData: {
    step?: string;
    payment?: string;
    profile_pic?: string;
    profile_name?: string;
}) {
    try {
        const filteredData: any = {};
        Object.entries(newData).forEach(([key, value]) => {
            if (value !== undefined) {
                filteredData[key] = value;
            }
        });
        if (Object.keys(filteredData).length === 0) {
            console.log("No data to update.");
            return { count: 0 };
        }

        const updated = await prisma.multipleStep.updateMany({
            where: {}, // Update all rows
            data: filteredData,
        });
        console.log(`${updated.count} record(s) updated.`);
        return updated;
    } catch (error) {
        console.error('Failed to update records:', error);
        throw error;
    }
}

export async function getAllMultipleSteps() {
    try {
        const allData = await prisma.multipleStep.findMany();
        return allData;
    } catch (error) {
        console.error('Failed to get records:', error);
        throw error;

    }
}