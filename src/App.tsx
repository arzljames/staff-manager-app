import { Plus, Search } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const testUsers = [
  {
    id: 1,
    name: "Arzl James Lao",
    email: "arzl@email.com",
    role: "Owner",
    dateAdded: "Oct 01, 2024",
  },
  {
    id: 2,
    name: "John Doe",
    email: "johndoe@email.com",
    role: "Admin",
    dateAdded: "Oct 10, 2024",
  },
  {
    id: 3,
    name: "Mary Jane Smith",
    email: "maryjane@email.com",
    role: "Contributor",
    dateAdded: "Sep 22, 2024",
  },
  {
    id: 4,
    name: "Anne Lee",
    email: "anne@email.com",
    role: "Contributor",
    dateAdded: "Sep 22, 2024",
  },
  {
    id: 5,
    name: "Stephen Nang",
    email: "stephen@email.com",
    role: "SEO",
    dateAdded: "Sep 24, 2024",
  },
];

function App() {
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
          <Button>
            <Plus />
            Invite User
          </Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md ">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testUsers.map((user) => {
              return (
                <TableRow>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <p>{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">{user.dateAdded}</TableCell>
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
