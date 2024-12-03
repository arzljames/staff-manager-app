import { axiosInstance } from "../api/axiosInstance";
import {
  UserInstanceResponse,
  InstanceRolesResponse,
  AllLocationsOptionsResponse,
  PendingUserInvitesResponse,
} from "./types";

type CreateStaffProps = {
  locations: string | null;
  name: string;
  email: string;
};

const DEVELOPERS_TOKEN = import.meta.env.VITE_DEVELOPERS_TOKEN;
const INSTANCE_ZUID = import.meta.env.VITE_INSTANCE_ZUID;

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
      "https://mobileeditortest.zesty.dev/datasets/mobile_editor/locations/all_locations_options.json"
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
    const contentModelZUID = "6-92cd8ab9e6-26dl95";
    const payload = {
      web: {
        metaTitle: name,
        metaLinkText: name,
        metaKeywords: name + " - " + email,
        parentZuid: "0",
        canonicalTagMode: 1,
      },
      meta: {
        contentModelZUID,
        langID: 1,
      },
      data: {
        first_name: name,
        email,
        member_locations: locations,
      },
    };

    const response = await axiosInstance.post(
      `https://${INSTANCE_ZUID}.api.zesty.io/v1/content/models/${contentModelZUID}/items/`,
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

    if (response.status === 200) await deleteStaffEntry(item.name, item.email);
    return response.data;
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};

const deleteStaffEntry = async (
  name: string,
  email: string
): Promise<void | undefined> => {
  if (!name || !email) return;
  try {
    const contentModelZUID = "6-92cd8ab9e6-26dl95";
    const searchItemByMetaKeywords = await axiosInstance.get(
      `https://${INSTANCE_ZUID}.api.zesty.io/v1/search/items?q=${
        name + " - " + email
      }`,
      {
        headers: {
          Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
        },
      }
    );

    if (
      searchItemByMetaKeywords.status === 200 &&
      searchItemByMetaKeywords?.data?.data.length > 0
    ) {
      await axiosInstance.delete(
        `https://${INSTANCE_ZUID}.api.zesty.io/v1/content/models/${contentModelZUID}/items/${searchItemByMetaKeywords.data.data[0].meta.ZUID}`,
        {
          headers: {
            Authorization: `Bearer ${DEVELOPERS_TOKEN}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error: ", error);
  }
};
