"use client";
import { signIn } from "next-auth/react";
import { Card, CardTitle } from "@/components/ui/card";
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod";
import { loginSchema } from "./utils/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";


export default function LoginPage() {
    const { update, status } = useSession();
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
                window.location.href = '/';
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
    // Now we check session status AFTER all hooks
    if (status === "authenticated") return <>You're already logged in</>;
    if (status === "loading") return <>Loading...</>;

    return (
        <>
            <Card className='flex flex-col gap-4 overflow-hidden rounded-none p-4 select-none max-w-md mx-auto'>
                <CardTitle className='text-center'>Please Login</CardTitle>
                <form className="flex flex-col gap-1" onSubmit={handleSubmit(handleFormSubmit)}>
                    <Input
                        type="text"
                        placeholder="Access Token"
                        className="grow"
                        {...register("accessToken")}
                    />
                    {formState.errors.accessToken && <span className="text-red-500 text-sm">{formState.errors.accessToken?.message}</span>}
                    {formState.errors.root && <span className="text-red-500 text-sm">{formState.errors.root?.message}</span>}
                    <Button disabled={isPending} type="submit" className='w-full mt-2'>
                        {
                            isPending ?
                                <>
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                    Logging In...
                                </>
                                :
                                "Login"
                        }
                    </Button>
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
            </Card>
        </>
    );
}