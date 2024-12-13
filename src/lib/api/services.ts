import { AxiosResponse } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import {
  UserInstanceResponse,
  InstanceRolesResponse,
  AllLocationsOptionsResponse,
  PendingUserInvitesResponse,
  GetUserByEmailResponse,
} from "./types";

type CreateStaffProps = {
  locations: string | null;
  name: string;
  email: string;
};

const DEVELOPERS_TOKEN = import.meta.env.VITE_DEVELOPERS_TOKEN;
const INSTANCE_ZUID = import.meta.env.VITE_INSTANCE_ZUID;
const STAFF_MODEL_ZUID = import.meta.env.VITE_STAFF_MODEL_ZUID;
const WEBENGINE_URL = import.meta.env.VITE_WEBENGINE_URL;
const WEBENGINE_PW = import.meta.env.VITE_WEBENGINE_PW;

// fetch users within an instance
// populate users with their associated locations based of staff model
export const getInstanceUsers = async (): Promise<
  UserInstanceResponse | undefined
> => {
  try {
    const response = await axiosInstance.get(
      `https://accounts.api.zesty.io/v1/instances/${INSTANCE_ZUID}/users/roles`,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

export const getInstanceRoles = async (): Promise<
  InstanceRolesResponse | undefined
> => {
  try {
    const response = await axiosInstance.get(
      `https://accounts.api.zesty.io/v1/instances/${INSTANCE_ZUID}/roles`,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

export const getAllLocationsOptions = async (): Promise<
  AllLocationsOptionsResponse | undefined
> => {
  try {
    const response = await axiosInstance.get(
      `${WEBENGINE_URL}/datasets/mobile_editor/locations/all_locations_options.json?zpw=${WEBENGINE_PW}`
    );
    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
    return {
      data: [],
    };
  }
};

export const sendUserInvites = async (item: any) => {
  try {
    const response = await axiosInstance.post(
      "https://accounts.api.zesty.io/v1/invites",
      item,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );

    if (response.status === 201) {
      await createStaff({
        locations: item.locations,
        name: item.inviteeName,
        email: item.inviteeEmail,
      });
    }

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// function to create an entry to the staff model upon successfull invites
const createStaff = async ({
  locations = null,
  name,
  email,
}: CreateStaffProps) => {
  try {
    const payload = {
      web: {
        metaTitle: name,
        metaLinkText: name,
        parentZuid: "0",
        canonicalTagMode: 1,
      },
      meta: {
        contentModelZUID: STAFF_MODEL_ZUID,
        langID: 1,
      },
      data: {
        first_name: name,
        email,
        member_locations: locations,
      },
    };

    const response = await axiosInstance.post(
      `https://${INSTANCE_ZUID}.api.zesty.io/v1/content/models/${STAFF_MODEL_ZUID}/items/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

export const getPendingUserInvites = async (): Promise<
  PendingUserInvitesResponse | undefined
> => {
  try {
    const response = await axiosInstance.get(
      `https://accounts.api.zesty.io/v1/instances/${INSTANCE_ZUID}/users/pending`,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

export const cancelInvite = async (item: any) => {
  try {
    const response = await axiosInstance.put(
      `https://accounts.api.zesty.io/v1/invites/${item.inviteeZUID}?action=cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );

    if (response.status === 200) await deleteStaffEntry(item.email);

    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

export const removeUser = async ({
  userZUID,
  roleZUID,
  email,
}: {
  userZUID: string;
  roleZUID: string;
  email: string;
}) => {
  try {
    const response = await axiosInstance.delete(
      `https://accounts.api.zesty.io/v1/users/${userZUID}/roles/${roleZUID}`,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );

    if (response.status === 200) await deleteStaffEntry(email);

    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

const deleteStaffEntry = async (email: string): Promise<void | undefined> => {
  if (!email) return;
  try {
    const searchUserByEmail: AxiosResponse<GetUserByEmailResponse | undefined> =
      await axiosInstance.get(
        `${WEBENGINE_URL}/datasets/mobile_editor/query/getUsersByEmail.json?email=${email}&zpw=${WEBENGINE_PW}`
      );

    if (searchUserByEmail?.data && searchUserByEmail.data?.data.length > 0) {
      for (let i = 0; i < searchUserByEmail.data.data.length; i++) {
        await unPublishItem(
          searchUserByEmail.data.data[i].meta.contentModelZuid,
          searchUserByEmail.data.data[i].meta.ZUID
        );
        await axiosInstance.delete(
          `https://${INSTANCE_ZUID}.api.zesty.io/v1/content/models/${searchUserByEmail.data.data[i].meta.contentModelZuid}/items/${searchUserByEmail.data.data[i].meta.ZUID}`,
          {
            headers: {
              Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
            },
          }
        );
      }
    }
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

const unPublishItem = async (modelZUID: string, itemZUID: string) => {
  try {
    const endpoint = `https://${INSTANCE_ZUID}.api.zesty.io/v1/content/models/${modelZUID}/items/${itemZUID}/publishings`;
    const publishData = await axiosInstance.get(endpoint, {
      headers: {
        Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
      },
    });

    if (!publishData?.data || publishData?.data.length === 0)
      throw new Error("Item is not currently published");

    const latestPublishVersion = publishData.data.data.reduce(
      (prev: any, current: any) =>
        new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current
    );

    const response = await axiosInstance.delete(
      endpoint + `/${latestPublishVersion.ZUID}`,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};
