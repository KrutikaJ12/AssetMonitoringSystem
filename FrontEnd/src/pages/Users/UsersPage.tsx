import { Delete, Download, Eye, Search, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import AssetDetails from "../../components/tables/BasicTables/AssetDetails";
import UserModal from "./UserModal";
import DeleteUserModel from "./DeleteUserModel";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { useUsers } from "../../hooks/useUsers";
// interface User {
//   fullName: string;
//   username: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
//   role: string;
//   user: string;
//   status: string;
// }

interface Asset {
  assetId: string;
  assetName: string;
  category: string;
  user: string;
  status: string;
  operator: string;
  engineHours: number;
  idleHours: number;
  fuelLevel: number;
}
const asset = {
  assetId: "EX001",
  name: "Excavator",
  category: "Earth Moving",
  user: "Mumbai",
  operator: "John",
  customer: "ABC Construction",
  purchaseDate: "12 Jan 2023",
  model: "CAT 320D",
  serialNumber: "CAT320D-EX001",
  status: "Active",
  engineHours: 1250,
  idleHours: 180,
  fuelLevel: 75,
  lastUpdated: "18 Jun 2026 • 10:42 AM",
  lastService: "12 Jun 2026",
  nextService: "150 hrs remaining",
  maintenanceStatus: "Good",
  currentSite: "Mumbai User",
  lastSeen: "5 mins ago",
};
interface AssetTableProps {
  data: Asset[];
}
const UsersPage = (Asset: AssetTableProps) => {
  const {data} = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  console.log("modelopen", isModalOpen);
  const [mode, setMode] = useState<
    "add" | "edit" | "view" | "delete" | "reset-password"
  >("add");

  const [selectedUser, setSelectedUser] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const hasFilters = search || status;
  const [selectedSiteFilter, setSelectedSiteFilter] = useState("");
  const filteredData = data?.data.filter((data) => {
    // const matchesSearch =
    //   data.assetName.toLowerCase().includes(search.toLowerCase()) ||
    //   data.category.toLowerCase().includes(search.toLowerCase());
    const matchSite = selectedSiteFilter ? data.site === selectedSiteFilter : true;
    // return matchesSearch && matchSite;
    return matchSite;
  });
  console.log(filteredData, "filter");
  const clearFilters = () => {
    setSearch("");

  };
  const { hasPermission } = useAuth();
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  const onDelete = () => {
    console.log(selectedUser);
    setIsDeleteModalOpen(false)
  };
  return (
    <>
      <div className=" h-10 flex justify-between mb-4  ">
        <div>Users</div>
        <Button
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            setMode("add");
          }}
        >
          {" "}
          + Add User
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        {/* Search + City/Branch Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
            }}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white min-w-[150px]"
          >
            <option value="">Role</option>
            <option>Admin</option>
            <option>Operator</option>
            <option>Manager</option>
          </select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
          {/* Sites Filter */}
          <select
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
            }}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white min-w-[150px]"
          >
            <option value="">Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between"></div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Username
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                 Mobile No
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                 Status
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                   Role
                </TableCell>

                {hasPermission("ASSET_VIEW") && (
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                )}

                {/* <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Fuel Consumption
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Utilization
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  View
                </TableCell> */}
              </TableRow>
            </TableHeader>

            {/* Table Body */}

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredData?.map((user) => (
                <TableRow className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {/* <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={user.image}
                        className="h-[50px] w-[50px]"
                        alt={user.name}
                      />
                    </div> */}
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.fullName}
                        </p>
                        {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.totalAssets}
                      </span> */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.userName}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.emailId}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.mobileNo}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        user.isActive 
                          ? "success"
                          : user.isActive === "Maintenance"
                            ? "warning"
                            : "error"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.roles?.map((role) => role.roleName).join(", ") || "-"}
                  </TableCell>

                  {hasPermission("ASSET_VIEW") && (
                    <TableCell className="flex gap-3  py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                          setMode("view");
                        }}
                      >
                        <Eye />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                          setMode("edit");
                        }}
                      >
                        <SquarePen />
                      </button>
                      <button onClick={() => handleDelete(selectedUser)}>
                        <Trash2 />
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* {isDrawerOpen && (
            <Drawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              title="Asset Details"
            >
              {isSelectedAsset && <AssetDetails asset={asset}/>}
            </Drawer>
          )} */}
          {/* {isDrawerOpen && (
            <Modal isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              <UserModel/>
            </Modal>
          )} */}

          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode={mode}
            selectedUser={selectedUser}
          />
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete User"
            message="Are you sure you want to delete this user?"
            itemName={selectedUser?.fullName}
            onDelete={()=>onDelete()}
          />
        </div>
      </div>
    </>
  );
};

export default UsersPage;
