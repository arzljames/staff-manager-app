import {
  cancelInvite,
  getAllLocationsOptions,
  getInstanceRoles,
  getInstanceUsers,
  getPendingUserInvites,
  removeUser,
  sendUserInvites,
} from "@/lib/api/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetInstanceUsers = () => {
  return useQuery({
    queryKey: ["instanceUsers"],
    queryFn: () => getInstanceUsers(),
  });
};

export const useGetInstanceRoles = () => {
  return useQuery({
    queryKey: ["instanceRoles"],
    queryFn: () => getInstanceRoles(),
  });
};

export const useGetAllLocationsOptions = () => {
  return useQuery({
    queryKey: ["allLocationsOptions"],
    queryFn: () => getAllLocationsOptions(),
  });
};

export const useSendUserInvites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Record<string, unknown>) => sendUserInvites(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingUserInvites"],
      });
    },
  });
};

export const useGetPendingUserInvites = () => {
  return useQuery({
    queryKey: ["pendingUserInvites"],
    queryFn: () => getPendingUserInvites(),
  });
};

export const useCancelInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: any) => cancelInvite(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingUserInvites"],
      });
    },
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: { userZUID: string; roleZUID: string; email: string }) =>
      removeUser(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instanceUsers"],
      });
    },
  });
};
