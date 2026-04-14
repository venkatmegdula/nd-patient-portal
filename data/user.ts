import type { User } from "@/lib/types";

/* Mock logged-in user for the prototype */
export const mockUser: User = {
  id: "user-ravi-123",
  name: "Ravi Kumar",
  phone: "9848012345",
  age: 45,
  gender: "male",
  savedAddresses: [
    {
      id: "addr-001",
      label: "Home",
      address: "Flat 4B, Vasavi Apartments, Road No. 3, Banjara Hills",
      pincode: "500034",
      area: "Banjara Hills",
    },
    {
      id: "addr-002",
      label: "Work",
      address: "Hitech City, Cyberabad, Hyderabad",
      pincode: "500081",
      area: "Hitech City",
    },
  ],
};
