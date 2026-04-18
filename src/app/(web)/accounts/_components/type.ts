/* eslint-disable @typescript-eslint/no-explicit-any */
// types/user.ts
export interface UserProfileResponse {
  status: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      pickupAddress: string;
      profileImage: string;
      subscription: any;
      subscriptionUsage: any;
      role: string;
      // ... add other fields if needed
    };
    totalPackages: number;
    totalReturnOrders: any;
  };
}

// types/user.ts
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
  pickupAddress: string;
}