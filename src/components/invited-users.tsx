import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Search } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MultiSelect } from "./multi-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PopoverClose } from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "./ui/separator";

import { Controller, useForm } from "react-hook-form";
import {
  useGetAllLocationsOptions,
  useGetInstanceUsers,
  useRemoveUser,
  useSendUserInvites,
} from "@/hooks/use-query";
import { useEffect, useState } from "react";
import moment from "moment";
import { EllipsisVertical } from "lucide-react";
import { ROLES } from "@/const";

type FormData = {
  name: string;
  email: string;
  role: string;
};

const InvitedUsers = () => {
  const INSTANCE_ZUID = import.meta.env.VITE_INSTANCE_ZUID;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [removeUserDialog, setRemoveUserDialog] = useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const { data: locationsOptions } = useGetAllLocationsOptions();
  const { data: users } = useGetInstanceUsers();
  const {
    mutate: createItemMutate,
    isSuccess: isInviteSent,
    isPending: isInviting,
  } = useSendUserInvites();
  const {
    mutate: removeUserMutate,
    isSuccess: removedUser,
    isPending: isRemoving,
  } = useRemoveUser();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });
  const onSubmit = (data: Record<string, string>) => {
    const payload = {
      accessLevel: Number(data.role),
      entityZUID: INSTANCE_ZUID,
      inviteeEmail: data.email,
      inviteeName: data.name,
      locations:
        selectedLocations.length > 0 ? selectedLocations.join(",") : null,
    };

    createItemMutate({ ...payload });
  };

  const handleRemoveUser = (item: {
    userZUID: string;
    roleZUID: string;
    email: string;
  }) => {
    removeUserMutate(item);
  };

  useEffect(() => {
    if (isInviteSent) {
      setIsDialogOpen(false);
      reset();
      setSelectedLocations([]);
    }

    if (removedUser) {
      setRemoveUserDialog(false);
    }
  }, [isInviteSent, removedUser]);
  return (
    <>
      <div className="w-full md:items-center flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-semibold mb-1">Users</h2>
          <p className="text-sm text-gray-500">
            Manage your users, assign their permissions, and designate locations
          </p>
        </div>
        <div className="flex items-center">
          <div className="relative flex items-center">
            <Search
              width={14}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
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
                <DialogTitle>Invite User</DialogTitle>
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
                          {ROLES.map((role, index) => (
                            <SelectItem key={index} value={role.value}>
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
                  placeholder="Assign Locations"
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
      <div className="border border-gray-200 rounded-md min-h-52 max-h-96 overflow-y-auto">
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
              .filter((value) => {
                if (searchQuery.trim() === "") return value;

                const keyValues = [
                  value.email.toLowerCase(),
                  `${value.firstName?.toLowerCase()} ${value.lastName?.toLowerCase()}`,
                  value.ZUID.toLowerCase(),
                ];

                // Check if any key value includes the search query
                if (
                  keyValues.some((key) =>
                    key.includes(searchQuery.toLowerCase())
                  )
                ) {
                  return value; // Return the object if it matches the search query
                }
              })
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
                      <Popover>
                        <PopoverTrigger className="border-none focus:outline-none focus:border-none bg-transparent">
                          <div className="ml-2 border w-[35px] h-[35px] rounded-full flex items-center justify-center border-white hover:border-gray-300 cursor-pointer hover:bg-white">
                            <EllipsisVertical
                              size={18}
                              className="text-gray-500"
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <PopoverClose className="border-none p-0 text-sm font-normal focus:outline-none focus:border-none bg-transparent">
                            <ul className="text-left">
                              <li
                                onClick={() =>
                                  window.open(`mailto:${user.email}`, "_blank")
                                }
                                className="mb-2"
                              >
                                Email
                              </li>
                            </ul>
                          </PopoverClose>
                          {/* <Dialog
                            open={editLocationDialog}
                            onOpenChange={(open) => setEditLocationDialog(open)}
                          >
                            <DialogTrigger
                              onClick={() => setEditLocationDialog(true)}
                              asChild
                            >
                              <p className="mb-2 text-sm">Edit Locations</p>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit User's Locations</DialogTitle>
                              </DialogHeader>

                              <MultiSelect
                                options={locationsOptions?.data ?? []}
                                onValueChange={setSelectedLocations}
                                defaultValue={selectedLocations}
                                placeholder="Assign Locations"
                                variant="inverted"
                                animation={0}
                                maxCount={3}
                              />

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
                          </Dialog> */}
                          <Separator />
                          <AlertDialog
                            open={removeUserDialog}
                            onOpenChange={(open) => setRemoveUserDialog(open)}
                          >
                            <AlertDialogTrigger className="text-left bg-transparent font-normal text-red-600 flex flex-row justify-start p-0 border-none outline-none mt-2 focus:outline-none focus:border-none text-sm">
                              Remove User
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove User from Instance
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove this user from
                                  this instance? This action cannot be undone.
                                  Please proceed with caution.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="focus:outline-none outline-none focus:border-none border-none">
                                  Cancel
                                </AlertDialogCancel>

                                <Button
                                  disabled={isRemoving}
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() =>
                                    handleRemoveUser({
                                      email: user.email,
                                      userZUID: user.ZUID,
                                      roleZUID: user.role.ZUID,
                                    })
                                  }
                                  type="submit"
                                >
                                  Confirm
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default InvitedUsers;
