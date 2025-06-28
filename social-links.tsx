import Link from "next/link"
import { Facebook, Mail, Twitter, Github, Linkedin, Instagram, Youtube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Social() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <Link
              href="https://facebook.com"
              className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
            >
              <Facebook className="h-5 w-5 text-primary" />
              <span>Facebook</span>
            </Link>
          </li>
          <li>
            <Link href="https://gmail.com" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
              <Mail className="h-5 w-5 text-primary" />
              <span>Gmail</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://twitter.com"
              className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
            >
              <Twitter className="h-5 w-5 text-primary" />
              <span>Twitter</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com"
              className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
            >
              <Github className="h-5 w-5 text-primary" />
              <span>GitHub</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://linkedin.com"
              className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
            >
              <Linkedin className="h-5 w-5 text-primary" />
              <span>LinkedIn</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://instagram.com"
              className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
            >
              <Instagram className="h-5 w-5 text-primary" />
              <span>Instagram</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://youtube.com"
              className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
            >
              <Youtube className="h-5 w-5 text-primary" />
              <span>YouTube</span>
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

