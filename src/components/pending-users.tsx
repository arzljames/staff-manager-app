import { EllipsisVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useCancelInvite, useGetPendingUserInvites } from "@/hooks/use-query";

const PendingUsers = () => {
  const { data: pendingUserInvites } = useGetPendingUserInvites();
  const { mutate: cancelInviteMutate } = useCancelInvite();

  const handleCancelInvite = (item: any) => {
    cancelInviteMutate(item);
  };
  return (
    <div className="border border-gray-200 rounded-md mt-20 w-[100%] md:w-[40%] min-h-52 max-h-96 overflow-y-auto">
      <Table className="min-w-[700px] md:min-w-0 w-full">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Pending Users</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingUserInvites?.data.map((user, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-10">
                  {user.inviteZUID}
                </TableCell>
                <TableCell>
                  <p>{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </TableCell>

                <TableCell className="text-right w-0">
                  <Popover>
                    <PopoverTrigger className="border-none focus:outline-none focus:border-none bg-transparent">
                      <div className="ml-2 border w-[35px] h-[35px] rounded-full flex items-center justify-center border-white hover:border-gray-300 cursor-pointer hover:bg-white">
                        <EllipsisVertical size={18} className="text-gray-500" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <PopoverClose
                        onClick={() =>
                          handleCancelInvite({
                            inviteeZUID: user.inviteZUID,
                            name: user.name,
                            email: user.email,
                          })
                        }
                        className="border-none p-0 text-sm font-normal focus:outline-none focus:border-none"
                      >
                        Cancel Invite
                      </PopoverClose>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingUsers;
