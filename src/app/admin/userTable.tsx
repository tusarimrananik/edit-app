"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "./actions";
import { updateEditsAndBalance, canEditSet } from "./actions";
import { Switch } from "@/components/ui/switch"

export default function UsersTable() {
  const queryClient = useQueryClient();
  const { data: users, error, isLoading } = useQuery({
    queryKey: ["tenUsers"],
    queryFn: getUsers,
  });

  const mutation = useMutation({
    mutationFn: ({ id, isIncrement }: { id: string; isIncrement: boolean }) => {
      return updateEditsAndBalance(id, isIncrement);
    },

    onMutate: async ({ id, isIncrement }) => {
      await queryClient.cancelQueries({ queryKey: ["tenUsers"] });
      const previousUsers = queryClient.getQueryData<any[]>(["tenUsers"]);
      queryClient.setQueryData(["tenUsers"], (oldUsers: any[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              edits: (user.edits || 0) + (isIncrement ? 1 : -1),
              balance: (user.balance || 0) + (isIncrement ? 70 : -70),
            };
          }
          return user;
        });
      });
      return { previousUsers };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["tenUsers"], context.previousUsers);
      }
      console.error("Mutation failed:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tenUsers"] });
    },
  });


  const mutationCanEdit = useMutation({
    mutationFn: ({ id, canEdit }: { id: string; canEdit: boolean }) => {
      return canEditSet(id, canEdit);
    },

    onMutate: async ({ id, canEdit }) => {
      await queryClient.cancelQueries({ queryKey: ["tenUsers"] });
      const previousUsers = queryClient.getQueryData<any[]>(["tenUsers"]);

      queryClient.setQueryData(["tenUsers"], (oldUsers: any[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              canEdit: canEdit
            };
          }
          return user;
        });
      });

      return { previousUsers };
    },

    onError: (err, variables, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["tenUsers"], context.previousUsers);
      }
      console.error("Mutation failed:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tenUsers"] });
    }
  });


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!users) return <>No user Found!</>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Access Token</TableHead>
          <TableHead>Can Edit</TableHead>
          <TableHead className="text-right">Edit Left</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>৳ {user.balance || 0}</TableCell>
            <TableCell>{user.accessToken}</TableCell>

            <TableCell>
              <Switch
                checked={user.canEdit || false}
                onCheckedChange={(checked) =>
                  mutationCanEdit.mutate({ id: user.id, canEdit: checked })
                }
              />
            </TableCell>


            <TableCell className="text-right">
              <div className="flex justify-end items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    mutation.mutate({ id: user.id, isIncrement: false })
                  }
                >
                  <Minus />
                </Button>
                {user.edits || 0}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    mutation.mutate({ id: user.id, isIncrement: true })
                  }
                >
                  <Plus />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}