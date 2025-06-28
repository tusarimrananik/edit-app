"use client";
import { Copy } from "lucide-react"
import { useState } from "react" // Add this import

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PhoneNumber() {
  const phoneNumber = "01750195068"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber)
    } catch (err) {
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Number</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>টাকা পাঠানোর নাম্বার</DialogTitle>
          <DialogDescription>
            নিচের নাম্বার এ সেন্ড মানি করো! Bkash/Nagad
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={phoneNumber}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
