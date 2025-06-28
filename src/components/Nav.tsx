import { User, UserCog, Key, House } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card } from './ui/card';
import Link from 'next/link';
import DialogNav from "./utils/DialogNav"
import AlertDialogNav from "./utils/AlertDialogNav"
import { auth } from "@/auth"
import prisma from '@/lib/prisma';
export default async function Nav() {
    const session = await auth()
    let user;
    if (session?.user?.id) {
        user = await prisma.user.findUnique({
            where: {
                id: session?.user?.id
            }
        });
    }
    return (
        <Card className='rounded-none flex justify-between items-center p-4 gap-2'>
            <div className='flex justify-between items-center gap-2'>
                <Link href="/">
                    <Button variant="outline" size="icon">
                        <House />
                    </Button>
                </Link>
                {user?.id === "1" &&
                    <Link href="/admin">
                        <Button variant="outline" size="icon">
                            <UserCog />
                        </Button>
                    </Link>
                }
            </div>
            {user ?
                <AlertDialogNav userData={user} />
                :
                <DialogNav />
            }
        </Card >
    )
}