import { Plus, Search, EllipsisVertical } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  useCancelInvite,
  useGetAllLocationsOptions,
  useGetInstanceRoles,
  useGetInstanceUsers,
  useGetPendingUserInvites,
  useSendUserInvites,
} from "./hooks/use-query";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { MultiSelect } from "./components/multi-select";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

const roleMapping = {
  Admin: 1,
  Developer: 2,
  SEO: 3,
  Publisher: 4,
  Contributor: 5,
  "Developer Contributor": 6,
  "Access Admin": 7,
};

function App() {
  const { data: users } = useGetInstanceUsers();
  const { data: roles } = useGetInstanceRoles();
  const { data: locationsOptions } = useGetAllLocationsOptions();
  const { data: pendingUserInvites } = useGetPendingUserInvites();
  const INSTANCE_ZUID = import.meta.env.VITE_INSTANCE_ZUID;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    mutate: createItemMutate,
    isSuccess: isInviteSent,
    isPending: isInviting,
  } = useSendUserInvites();

  const { mutate: cancelInviteMutate } = useCancelInvite();

  const handleCancelInvite = (item: any) => {
    cancelInviteMutate(item);
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: Record<string, string>) => {
    const payload = {
      accessLevel: roleMapping[data.role],
      entityZUID: INSTANCE_ZUID,
      inviteeEmail: data.email,
      inviteeName: data.name,
      locations:
        selectedLocations.length > 0 ? selectedLocations.join(",") : null,
    };

    createItemMutate({ ...payload });
    const blankFields = Object.keys(data).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>);

    reset(blankFields);
  };

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  useEffect(() => {
    if (isInviteSent) {
      console.log(isInviteSent);
      setIsDialogOpen(false);
      reset();
      setSelectedLocations([]);
    }
  }, [isInviteSent]);

  return (
    <div className="p-4 transition-all duration-300 w-screen h-screen">
      <div className="w-full md:items-center flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-semibold mb-1">Users</h2>
          <p className="text-sm text-gray-500">
            Manage your users and their permissions
          </p>
        </div>
        <div className="flex items-center">
          <div className="relative flex items-center">
            <Search
              width={14}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="max-w-none md:max-w-80 mr-2 pl-8"
              placeholder="Search Users"
            />
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => setIsDialogOpen(open)}
          >
            <DialogTrigger onClick={() => setIsDialogOpen(true)} asChild>
              <Button>
                <Plus />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle onClick={() => reset()}>Invite User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  className={`placeholder:font-medium font-medium ${
                    errors.name ? "border-red-600 " : "border-gray-400"
                  }`}
                  id="name"
                  placeholder="Name"
                  {...register("name", {
                    required: "Name field is required *",
                  })}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs -mt-2">
                    {errors.name.message as string}
                  </p>
                )}
                <Input
                  className={`placeholder:font-medium font-medium ${
                    errors.email ? "border-red-600 " : "border-gray-400"
                  }`}
                  type="email"
                  id="email"
                  required
                  placeholder="Email"
                  {...register("email", {
                    required: "Email field is required *",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs -mt-2">
                    {errors.email.message as string}
                  </p>
                )}

                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`${
                            errors.role ? "border-red-600" : "border-gray-400"
                          } `}
                        >
                          <SelectValue
                            defaultValue=""
                            placeholder="Choose Role"
                            className="text-red-400"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.data.map((role, index) => (
                            <SelectItem key={index} value={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-red-600 text-xs -mt-2">
                          Role field is required *
                        </p>
                      )}
                    </>
                  )}
                />

                <MultiSelect
                  options={locationsOptions?.data ?? []}
                  onValueChange={setSelectedLocations}
                  defaultValue={selectedLocations}
                  placeholder="Assign locations"
                  variant="inverted"
                  animation={0}
                  maxCount={3}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  disabled={isInviting}
                  className="sm:mb-4"
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md ">
        <Table className="min-w-[700px] md:min-w-0">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data
              .filter((admin) => !admin.ZUID.startsWith("55-"))
              .map((user, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-10">
                      {user.ZUID}
                    </TableCell>
                    <TableCell>
                      <p>{user.firstName + " " + user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </TableCell>
                    <TableCell>{user.role.name}</TableCell>
                    <TableCell>
                      {moment(user.createdAt).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell className="text-right w-0">
                      <div className="ml-2 border w-[35px] h-[35px] rounded-full flex items-center justify-center border-white hover:border-gray-300 cursor-pointer hover:bg-white">
                        <EllipsisVertical size={18} className="text-gray-500" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <div className="border border-gray-200 rounded-md mt-20 w-[100%] md:w-[40%]">
        <Table className="min-w-[700px] md:min-w-0">
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
                      <PopoverTrigger className="border-none focus:outline-none focus:border-none">
                        <div className="ml-2 border w-[35px] h-[35px] rounded-full flex items-center justify-center border-white hover:border-gray-300 cursor-pointer hover:bg-white">
                          <EllipsisVertical
                            size={18}
                            className="text-gray-500"
                          />
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
    </div>
  );
}

export default App;
