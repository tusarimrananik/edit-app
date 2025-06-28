"use client";
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
import { Button } from '../ui/button'
import { Key, User } from 'lucide-react'
import { Input } from '../ui/input'
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod";
import { loginSchema } from "@/app/auth/login/utils/loginSchema";
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
export default function DialogNav() {
    const { update } = useSession();
    const searchParams = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");
    const mutation = useMutation({
        mutationFn: async (input: { accessToken: string }) => {
            return await signIn("credentials", {
                accessToken: input.accessToken,
                redirect: false,
            });
        },
        onSuccess: async (data) => {
            if (!data) {
                setErrorMessage("No response received from server");
                return;
            }
            if (!data.error) {
                await update();
                window.location.href = searchParams.get('from') || '/';
            } else {
                setErrorMessage(`Authentication failed: ${data.error}`);
            }
        },
        onError: (error: Error) => {
            setErrorMessage(`Unknown error occurred: ${error.message}`);
        },
    });
    const { mutate, isPending } = mutation
    const handleFormSubmit: SubmitHandler<formField> = async (input) => {
        mutate(input);
    };
    type formField = z.infer<typeof loginSchema>;
    const { register, handleSubmit, formState } = useForm<formField>({
        resolver: zodResolver(loginSchema)
    });
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <User />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enter Access Token</DialogTitle>
                    <DialogDescription>
                        Please enter your access token to login!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">

                            <Input
                                type="text"
                                placeholder="Access Token"
                                {...register("accessToken")}
                            />

                        </div>
                        <Button disabled={isPending} type="submit" className="px-3">
                            {
                                isPending ?
                                    <>
                                        <Loader2 className="animate-spin" />
                                    </>
                                    :
                                    <Key />
                            }
                        </Button>
                    </div>
                    {formState.errors.accessToken && <span className="text-red-500 text-sm">{formState.errors.accessToken?.message}</span>}
                    {formState.errors.root && <span className="text-red-500 text-sm">{formState.errors.root?.message}</span>}
                </form>
                {errorMessage &&
                    <Alert variant="destructive" className="relative">
                        <button className="absolute top-2 right-2" onClick={() => setErrorMessage("")}>
                            <X className="h-4 w-4" />
                        </button>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                }
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