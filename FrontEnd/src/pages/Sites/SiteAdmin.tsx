import { Delete, Download, Eye, Search, SquarePen, Trash2 } from "lucide-react";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Modal } from "../../components/ui/modal";
import Badge from "../../components/ui/badge/Badge";
import AssetDetails from "../../components/tables/BasicTables/AssetDetails";
import Buttons from "../UiElements/Buttons";
import SiteModal from "./SiteModal";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { useSites } from "../../hooks/useSites";
import { useNavigate } from "react-router";


// interface Asset {
// assetId: string;
// assetName: string;
// category: string;
// site: string;
// status: string;
// operator: string;
// engineHours: number;
// idleHours: number;
// fuelLevel: number;
// }
// const asset = {
//   assetId: "EX001",
//   name: "Excavator",
//   category: "Earth Moving",
//   site: "Mumbai",
//   operator: "John",
//   customer: "ABC Construction",
//   purchaseDate: "12 Jan 2023",
//   model: "CAT 320D",
//   serialNumber: "CAT320D-EX001",
//   status: "Active",
//   engineHours: 1250,
//   idleHours: 180,
//   fuelLevel: 75,
//   lastUpdated: "18 Jun 2026 • 10:42 AM",
//   lastService: "12 Jun 2026",
//   nextService: "150 hrs remaining",
//   maintenanceStatus: "Good",
//   currentSite: "Mumbai Site",
//   lastSeen: "5 mins ago",
// };
// interface AssetTableProps {
//   data: Asset[];
// }
const SiteAdmin = (Asset) => {
  const { data, isLoading, error } = useSites();
  console.log("siteData", data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedSiteFilter, setSelectedSiteFilter] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  console.log("modelopen", isModalOpen);
  const [mode, setMode] = useState<
    "add" | "edit" | "view" | "delete" | "reset-password"
  >("add");
  const [search, setSearch] = useState("");
  const navigate = useNavigate()
  const [status, setStatus] = useState("");
  const hasFilters = search || selectedSite || status;
  const [isSelectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const sites = [
    { code: "MUM", name: "Mumbai" },
    { code: "PUN", name: "Pune" },
    { code: "VAS", name: "Vashi" },
  ];
  const filteredData = data?.data.filter((data) => {
    // const matchesSearch =
    //   data.assetName.toLowerCase().includes(search.toLowerCase()) ||
    //   data.category.toLowerCase().includes(search.toLowerCase());
    const matchSite = selectedSiteFilter
      ? data.site === selectedSiteFilter
      : true;
    // return matchesSearch && matchSite;
    return matchSite;
  });

  console.log(filteredData, "filter");
  const clearFilters = () => {
    setSearch("");
    setSelectedSite("");
  };
  const { hasPermission } = useAuth();
  const handleDelete = (user) => {
    setSelectedAsset(user);
    setIsDeleteModalOpen(true);
  };
  const onDelete = () => {
    console.log("Deleted sucessfully");
    setIsDeleteModalOpen(false);
  };
  return (
    <>
      <div className=" h-10 flex justify-between mb-4  ">
        <div>Sites</div>
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setMode("add");
          }}
        >
          {" "}
          + Add Sites
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
              placeholder="Search Site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <Button size="sm" variant="outline">
            Status
          </Button>

          {/* Sites Filter */}
          <select
            value={selectedSite}
            onChange={(e) => {
              setSelectedSite(e.target.value);
            }}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white min-w-[150px]"
          >
            <option value="">All sites</option>
            {sites.map((site) => (
              <option key={site.code} value={site.name}>
                {site.name}
              </option>
            ))}
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

        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          {/* <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Asset Allocation
            </h3>
          </div> */}
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Site Name
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Location
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Coordinates
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Asset Count
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
                  Site Manager
                </TableCell>

                {hasPermission("ASSET_VIEW") && (
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredData?.map((site) => (
                <TableRow className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {/* <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={site.image}
                        className="h-[50px] w-[50px]"
                        alt={site.name}
                      />
                    </div> */}
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {site.SiteName}
                        </p>
                        {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {site.totalAssets}
                      </span> */}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.LocationName}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.Latitude},{site.Longitude}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/admin/assets?siteId=${site.SiteID}`)}
                      className="font-medium text-brand-500 hover:underline"
                    >
                      {site.AssetCount}
                    </button>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        `${site.IsActive}`
                          ? "success"
                          : site.status === "Maintenance"
                            ? "warning"
                            : "error"
                      }
                    >
                      {site.IsActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.SiteManagerName || "Not Assigned"}
                  </TableCell>

                  {hasPermission("ASSET_VIEW") && (
                    <TableCell className="flex gap-3  py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <button
                        onClick={() => {
                          setSelectedSite(site);
                          setIsModalOpen(true);
                          setMode("view");
                        }}
                      >
                        <Eye />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSite(site);
                          setIsModalOpen(true);
                          setMode("edit");
                        }}
                      >
                        <SquarePen />
                      </button>
                      <button onClick={() => handleDelete(asset)}>
                        <Trash2 />
                      </button>
                    </TableCell>
                  )}
                  {/* <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${site.utilization}%` }}
                        />
                      </div>

                      <span>{site.utilization}%</span>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* {isDrawerOpen && (
            <Modal isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              {isSelectedAsset && <AssetDetails asset={asset} />}
            </Modal>
          )} */}
          <SiteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode={mode}
            selectedSite={selectedSite}
          />
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete Site"
            message="Are you sure you want to delete this site?"
            itemName={""}
            onDelete={() => onDelete()}
          />
        </div>
      </div>
    </>
  );
};

export default SiteAdmin;
