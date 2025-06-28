"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateAllMultipleSteps, getAllMultipleSteps } from "@/app/multi/action"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { multiSchema } from "./multiSchema";
import { z } from "zod";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, SquareStack, X } from "lucide-react";
import Link from "next/link"
import getFacebookInfo from "./getInfo";
import { updateEditsAndBalance } from "../admin/actions";


type formField = z.infer<typeof multiSchema>;

const queryClient = new QueryClient();


async function copyLink(text: string) {
    if (navigator && navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            if (navigator.permissions) {
                try {
                    const result = await navigator.permissions.query({ name: "clipboard-write" as PermissionName });
                    if (result.state === "prompt") {
                        await navigator.clipboard.writeText(text);
                    }
                } catch (permErr) {
                }
            } else {
            }
        }
    }
}

export default function Page() {


    const [err, setError] = useState("");

    const { data: allData, isLoading, error } = useQuery({
        queryKey: ['getAllMultiple'],
        queryFn: () => getAllMultipleSteps(),
    });

    const mutation = useMutation({
        mutationFn: (data: formField) => {
            return updateAllMultipleSteps(data);
        },
        onSuccess: (data) => {
            console.log("success!");
        },
        onError: (error) => {
            if (error instanceof Error) setError(error.message)
        },
    });



    const updateEditsAndBalanceMutation = useMutation({
        mutationFn: (data: { id: string, isIncrement: boolean }) => {
            return updateEditsAndBalance(data.id, data.isIncrement);
        }
    })

    const { mutate: mutateUE } = updateEditsAndBalanceMutation


    const mutationGetInfo = useMutation({
        mutationFn: (data: { facebookLink: string, time: string }) => {
            return getFacebookInfo(data);
        },
        onSuccess: (data) => {
            if (data.error) {
                setError(data.error)
            }
            // if (data.screenshotBuffer && data.userId) {
            //     // const imageUrl = `data:image/png;base64,${data.screenshotBuffer}`;
            //     // setImgUrl(imageUrl);
            //     mutateUE({ id: data.userId, isIncrement: false })
            // }
        },
        onError: (error) => {
            if (error instanceof Error) setError(error.message)
        },

    });
    const { mutate: mutateGetInfo, isPending: isGetinfoPending, isError: isGetInfoError, reset: isGetINfoREset } = mutation








    const { mutate, isPending, isError } = mutation


    const handleFormSubmit: SubmitHandler<formField> = async (data) => {
        mutate(data);
    }



    const { register, handleSubmit, control, reset } = useForm<formField>({
        resolver: zodResolver(multiSchema)
    });



    useEffect(() => {
        if (allData && allData.length > 0) {
            const firstEntry = allData[0];
            reset({
                step: firstEntry.step || "",
                payment: firstEntry.payment || "",
                profile_pic: firstEntry.profile_pic || "",
                profile_name: firstEntry.profile_name || "",
            });
        }
    }, [allData, reset]);



    return (
        <Card className='flex flex-col gap-4 overflow-hidden rounded-none p-4 select-none max-w-md mx-auto'>
            <CardTitle>Multiple Step</CardTitle>
            {/* I'll Implement letter  */}


            <div className="flex">
                <Input className="flex-grow" type="text" placeholder="Facebook URL" />
                <Button className="flex-grow" type="submit" disabled={isPending}>
                    {isPending ? "getting..." : "Get info"}
                </Button>
            </div>
            <form className="flex flex-col gap-1" onSubmit={handleSubmit(handleFormSubmit)}>
                <Input placeholder="Facebook Name" {...register("profile_name")} />
                <Input placeholder="Profile Pic Url" {...register("profile_pic")} />
                <Input type="number" step="0.01" min="0.01" placeholder="Payment" {...register("payment")} />
                <div className="flex">
                    <Controller
                        name="step"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Step" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Steps</SelectLabel>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <Button className="flex-grow" type="submit" disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>
                {(isError || err) &&
                    <Alert variant="destructive" className="relative">
                        <button className="absolute top-2 right-2" onClick={() => setError("")}>
                            <X className="h-4 w-4" />
                        </button>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {err}
                        </AlertDescription>
                    </Alert>
                }
            </form>
            <div>
                <ul className="flex gap-3">
                    <li className="border border-secondary overflow-hidden flex-grow">
                        <Link
                            href="https://account-recovery-26ne.onrender.com/"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-secondary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <SquareStack className="h-5 w-5 text-primary" />
                            <span>Go To site</span>
                        </Link>
                    </li>
                    <li>
                        <Button className="flex items-center gap-2 p-5" onClick={() => { copyLink("https://account-recovery-26ne.onrender.com/") }}>
                            Copy link
                        </Button>
                    </li>
                </ul>
            </div>
        </Card>
    );
}