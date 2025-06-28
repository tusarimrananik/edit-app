"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMutation } from "@tanstack/react-query"
import { useState } from 'react';
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import convertTo12Hour from '@/app/utils/convertTo12Hour';
import { generateFutureTime } from '@/app/utils/generateFutureTime';
import handleImageDownload from '@/app/utils/handleImageDownload';
//I'll Implement copy pasting functionaly letter!
import { pasteFromClipboard } from '@/app/utils/pasteFromClipboard'
import { updateEditsAndBalance } from '@/app/admin/actions';
import { ImoAppSchema } from "@/app/imo/(server)/utils/ImoAppSchema";
import getImoEdit from "@/app/imo/(server)/actions";
type formField = z.infer<typeof ImoAppSchema>;
export default function WhatsApp() {
    const [imgUrls, setImgUrls] = useState<string[]>([])
    const updateEditsAndBalanceMutation = useMutation({
        mutationFn: (data: { id: string, isIncrement: boolean }) => {
            return updateEditsAndBalance(data.id, data.isIncrement);
        }
    })
    const { mutate: mutateUE } = updateEditsAndBalanceMutation
    const mutation = useMutation({
        mutationFn: (data: formField) => {
            const modifiedData = {
                ...data,
                time: convertTo12Hour(data.time)
            };
            return getImoEdit(modifiedData)
        },
        onSuccess: (data) => {
            const imageUrlProfile = `data:image/png;base64,${data.screenshotBufferProfile}`;
            setImgUrls([imageUrlProfile]);
            mutateUE({ id: data.userId, isIncrement: false })
        },
        onError: (error) => {
            console.log('Error:', error);
        },
    });
    const { mutate, isPending, isError, error, reset } = mutation
    const handleFormSubmit: SubmitHandler<formField> = async (data) => {
        mutate(data);
    }
    const { register, handleSubmit, formState, setValue } = useForm<formField>({
        defaultValues: {
            time: generateFutureTime(15)
        },
        resolver: zodResolver(ImoAppSchema)
    });
    return (
        <Card className="flex flex-col gap-4 overflow-hidden rounded-none p-4 select-none max-w-md mx-auto">
            <CardTitle className="text-center">Hack Imo Account</CardTitle>
            <form className="flex flex-col gap-1" onSubmit={handleSubmit(handleFormSubmit)}>
                <Input
                    type="text"
                    placeholder="Imo Name"
                    {...register("ImoName")}
                />
                {formState.errors.ImoName && <span className="text-red-500 text-sm">{formState.errors.ImoName?.message}</span>}
                <Input
                    type="text"
                    placeholder="Imo Number"
                    {...register("ImoNumber")}
                />
                {formState.errors.ImoNumber && <span className="text-red-500 text-sm">{formState.errors.ImoNumber?.message}</span>}
                <Input
                    type="text"
                    placeholder="Imo Id"
                    {...register("ImoId")}
                />
                {formState.errors.ImoId && <span className="text-red-500 text-sm">{formState.errors.ImoId?.message}</span>}
                <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setValue("ImoProfilePic", e.target.files?.[0])}
                    />
                    <Input
                        type="time"
                        {...register("time")}
                    />
                </div>
                {formState.errors.ImoProfilePic && <span className="text-red-500 text-sm">{formState.errors.ImoProfilePic?.message}</span>}
                {formState.errors.time && <span className="text-red-500 text-sm">{formState.errors.time?.message}</span>}
                {formState.errors.root && <span className="text-red-500 text-sm">{formState.errors.root?.message}</span>}
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
            {isError &&
                <Alert variant="destructive" className="relative">
                    <button className="absolute top-2 right-2" onClick={() => reset()}>
                        <X className="h-4 w-4" />
                    </button>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error.message}
                    </AlertDescription>
                </Alert>
            }
            {imgUrls?.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center">
                    {imgUrls.map((imgUrl, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <Card className="rounded-none h-full w-[150px]">
                                <img
                                    className="w-full h-full object-cover"
                                    src={imgUrl}
                                    alt={`Image ${index}`}
                                />
                            </Card>
                            <Button className="mt-2" onClick={() => handleImageDownload(imgUrl)}>
                                Download Image
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}