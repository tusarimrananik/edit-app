"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getActiveBrowser, setActiveBrowser } from "@/app/utils/getAndSetBrowsers";
import { useSession } from "next-auth/react";

const queryClient = new QueryClient();

export function Browsers() {
  const [selectedBrowser, setSelectedBrowser] = useState("");
  const { data: session } = useSession();

  // Always call the query hook; disable it when the session is not valid.
  const { data: browsers, isLoading, error } = useQuery({
    queryKey: ['browsers'],
    queryFn: () => getActiveBrowser(),
    enabled: session?.user?.id === "1",
  });

  const mutation = useMutation({
    mutationFn: (data: string) => setActiveBrowser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['browsers'] });
    },
  });

  useEffect(() => {
    if (browsers) {
      setSelectedBrowser(browsers.name);
    }
  }, [browsers]);

  const handleValueChange = (value: string) => {
    setSelectedBrowser(value);
    mutation.mutate(value);
  };

  // Now, conditionally render based on session.user.id AFTER all hooks have been called.
  if (!session || session.user?.id !== "1") {
    return null;
  }

  if (isLoading) {
    return <Skeleton className="w-[180px] h-[40px]" />;
  }

  if (error) {
    return <div>Error fetching browsers</div>;
  }

  return (
    <Select onValueChange={handleValueChange} value={selectedBrowser}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Browser" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Browsers</SelectLabel>
          <SelectItem value="localhost">localhost</SelectItem>
          <SelectItem value="browserless">browserless</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
