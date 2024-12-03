export type UserInstanceResponse = {
  data: {
    ID: number;
    ZUID: string;
    authSource: string;
    authyPhoneCountryCode: string | null;
    authyPhoneNumber: string | null;
    authyUserID: string | null;
    createdAt: string;
    email: string;
    firstName: string;
    lastLogin: string | null;
    lastName: string;
    prefs: string;
    role: {
      ZUID: string;
      createdAt: string;
      createdByUserZUID: string;
      description: string | null;
      entityZUID: string;
      expiry: string | null;
      granularRoleZUID: string | null;
      granularRoles: string | null;
      name: string;
      static: boolean;
      systemRoleZUID: string;
      updatedAt: string;
    };
    signupInfo: string | null;
    staff: boolean;
    unverifiedEmails: string;
    updatedAt: string;
    verifiedEmails: string | null;
    websiteCreator: boolean;
  }[];
  _meta: {
    limit: number;
    offset: number;
    start: number;
    timestamp: string;
    totalResults: number;
  };
};

export type InstanceRolesResponse = {
  data: {
    ZUID: string;
    createdAt: string;
    createdByUserZUID: string;
    description: string | null;
    entityZUID: string;
    expiry: string | null;
    granularRoleZUID: string | null;
    granularRoles: string | null;
    name: string;
    static: boolean;
    systemRole: string | null;
    systemRoleZUID: string;
    updatedAt: string;
  }[];
  _meta: {
    limit: number;
    offset: number;
    start: number;
    timestamp: string;
    totalResults: number;
  };
};

export type AllLocationsOptionsResponse = {
  data: {
    value: string;
    label: string;
  }[];
};

export type PendingUserInvitesResponse = {
  data: {
    email: string;
    inviteZUID: string;
    name: string;
  }[];
  _meta: {
    limit: number;
    offset: number;
    start: number;
    timestamp: string;
    totalResults: number;
  };
};
