"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import getFacebookScreenshot from "./../(server)/action";
import { useState } from 'react';
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facebookLinkSchema } from "../(server)/utils/facebookLinkSchema";
import { Skeleton } from "@/components/ui/skeleton";
import convertTo12Hour from '@/app/utils/convertTo12Hour';
import { generateFutureTime } from '@/app/utils/generateFutureTime';
import handleImageDownload from '@/app/utils/handleImageDownload';
import { pasteFromClipboard } from '@/app/utils/pasteFromClipboard'
import { updateEditsAndBalance } from '@/app/admin/actions';


type formField = z.infer<typeof facebookLinkSchema>;


export default function Facebook() {

    const [imgUrl, setImgUrl] = useState("");
    const [error, setError] = useState("");
    const updateEditsAndBalanceMutation = useMutation({
        mutationFn: (data: { id: string, isIncrement: boolean }) => {
            return updateEditsAndBalance(data.id, data.isIncrement);
        }
    })


    const { mutate: mutateUE } = updateEditsAndBalanceMutation
    const mutation = useMutation({
        mutationFn: (data: { facebookLink: string, time: string }) => {
            return getFacebookScreenshot(data);
        },
        onSuccess: (data) => {
            if (data.error) {
                setError(data.error)
            }
            if (data.screenshotBuffer && data.userId) {
                const imageUrl = `data:image/png;base64,${data.screenshotBuffer}`;
                setImgUrl(imageUrl);
                mutateUE({ id: data.userId, isIncrement: false })
            }
        },
        onError: (error) => {
            if (error instanceof Error) setError(error.message)
        },

    });
    const { mutate, isPending, isError, reset } = mutation
    const handleFormSubmit: SubmitHandler<formField> = async (data) => {
        const { facebookLink, time } = data;
        const twelveHourTime = convertTo12Hour(time)
        mutate({ facebookLink, time: twelveHourTime });
    }
    const handleInputPaste = async () => {
        const facebookLinkOnlySchema = facebookLinkSchema.pick({ facebookLink: true });
        const result = facebookLinkOnlySchema.safeParse({ facebookLink: await pasteFromClipboard() });
        if (!result.success) {
            return;
        }
        setValue("facebookLink", result.data.facebookLink);
    }
    const { register, handleSubmit, formState, setValue } = useForm<formField>({
        defaultValues: {
            time: generateFutureTime(0)
        },
        resolver: zodResolver(facebookLinkSchema)
    });
    return (
        <Card className='flex flex-col gap-4 overflow-hidden rounded-none p-4 select-none max-w-md mx-auto'>
            <CardTitle className='text-center'>Hack Facebook Account</CardTitle>
            <form className="flex flex-col gap-1" onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex flex-col gap-1">
                    <div className="flex">
                        <Input
                            type="text"
                            placeholder="Facebook Link"
                            className="grow"
                            {...register("facebookLink")}
                            onClick={handleInputPaste}
                        />
                        <Input
                            className='w-auto'
                            type="time"
                            {...register("time")}
                        />
                    </div>
                    {formState.errors.facebookLink && <span className="text-red-500 text-sm">{formState.errors.facebookLink?.message}</span>}
                    {formState.errors.time && <span className="text-red-500 text-sm">{formState.errors.time?.message}</span>}
                    {formState.errors.root && <span className="text-red-500 text-sm">{formState.errors.root?.message}</span>}
                </div>
                <Button disabled={isPending} type="submit" className='w-full mt-2'>
                    {
                        isPending ?
                            <>
                                <Loader2 className="animate-spin mr-2" size={18} />
                                Hacking process initialized. Processing...
                            </>
                            :
                            "Start Hacking"
                    }
                </Button>
            </form>
            {(isError || error) &&
                <Alert variant="destructive" className="relative">
                    <button className="absolute top-2 right-2" onClick={() => setError("")}>
                        <X className="h-4 w-4" />
                    </button>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            }
            {imgUrl &&
                <>
                    <Card className="rounded-none h-full w-[150px] m-auto">
                        <img
                            className="w-full h-full object-cover"
                            src={imgUrl}
                            alt="Facebook Screenshot"
                        />
                    </Card>
                    <Button onClick={() => handleImageDownload(imgUrl)}>
                        Download Image
                    </Button>
                </>}
            {isPending &&
                <>
                    <Skeleton className="rounded-none h-[300px] w-[150px] m-auto">
                    </Skeleton>
                    <Button disabled className="cursor-not-allowed">
                        Download Image
                    </Button>
                </>
            }
        </Card>
    )
}