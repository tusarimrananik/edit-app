import Link from "next/link"
import { Facebook, Mail, MessageCircleMore, Phone, SquareStack } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneNumber } from "@/components/PhoneNumber"
import { Browsers } from "@/components/Browsers"
export default function SocialLinks() {
    return (

        <Card className="rounded-none max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Hack Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    <li className="border border-secondary">
                        <Link
                            href="/facebook"
                            className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
                        >
                            <Facebook className="h-5 w-5 text-primary" />
                            <span>Facebook</span>
                        </Link>
                    </li>
                    <li className="border border-secondary">
                        <Link href="/gmail" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
                            <Mail className="h-5 w-5 text-primary" />
                            <span>Gmail</span>
                        </Link>
                    </li>
                    <li className="border border-secondary">
                        <Link
                            href="/whatsapp"
                            className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
                        >
                            <MessageCircleMore className="h-5 w-5 text-primary" />
                            <span>WhatsApp</span>
                        </Link>
                    </li>

                    <li className="border border-secondary">
                        <Link
                            href="/imo"
                            className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
                        >
                            <Phone className="h-5 w-5 text-primary" />
                            <span>Imo</span>
                        </Link>
                    </li>



                    <li className="border border-secondary">
                        <Link
                            href="/multi"
                            className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
                        >
                            <SquareStack className="h-5 w-5 text-primary" />
                            <span>Multi</span>
                        </Link>
                    </li>


                </ul>
            </CardContent>

            <div className="flex gap-2 justify-between">
                <PhoneNumber />
                <Browsers />
            </div>
        </Card>
    )
}