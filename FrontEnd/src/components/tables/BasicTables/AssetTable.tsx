import { useState } from "react";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Download, Eye, Search } from "lucide-react";
import Button from "../../ui/button/Button";
// import Drawer from "../../ui/Drawer/Drawer";
import { Modal } from "../../ui/modal";
import AssetDetails from "./AssetDetails";
import { useAuth } from "../../../hooks/useAuth";
const assetsData = [
  {
    assetId: "EX001",
    assetName: "Excavator",
    category: "Earth Moving",
    site: "Mumbai",
    status: "Active",
    operator: "John",
    engineHours: 1250,
    idleHours: 180,
    fuelLevel: 75,
  },
  {
    assetId: "DT002",
    assetName: "Dump Truck",
    category: "Transport",
    site: "Pune",
    status: "Idle",
    operator: "Mike",
    engineHours: 980,
    idleHours: 245,
    fuelLevel: 58,
  },
  {
    assetId: "CR003",
    assetName: "Crane",
    category: "Lifting Equipment",
    site: "Delhi",
    status: "Active",
    operator: "David",
    engineHours: 1540,
    idleHours: 120,
    fuelLevel: 82,
  },
  {
    assetId: "BL004",
    assetName: "Backhoe Loader",
    category: "Earth Moving",
    site: "Mumbai",
    status: "Maintenance",
    operator: "Rajesh",
    engineHours: 2100,
    idleHours: 340,
    fuelLevel: 35,
  },
  {
    assetId: "GR005",
    assetName: "Motor Grader",
    category: "Transport",
    site: "Nagpur",
    status: "Active",
    operator: "Amit",
    engineHours: 1320,
    idleHours: 95,
    fuelLevel: 68,
  },
];
interface Asset {
  assetId: string;
  assetName: string;
  category: string;
  site: string;
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
  site: "Mumbai",
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
  currentSite: "Mumbai Site",
  lastSeen: "5 mins ago",
};
interface AssetTableProps {
  data: Asset[];
}
export function AssetTable(Asset: AssetTableProps) {
  const [search, setSearch] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [status, setStatus] = useState("");
  const hasFilters = search || selectedSite || status;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSelectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const sites = [
    { code: "MUM", name: "Mumbai" },
    { code: "PUN", name: "Pune" },
    { code: "VAS", name: "Vashi" },
  ];
  const filteredData = assetsData.filter((data) => {
    const matchesSearch =
      data.assetName.toLowerCase().includes(search.toLowerCase()) ||
      data.category.toLowerCase().includes(search.toLowerCase());
    const matchSite = selectedSite ? data.site == selectedSite : true;
    return matchesSearch && matchSite;
  });
  console.log(filteredData, "filter");
  const clearFilters = () => {
    setSearch("");
    setSelectedSite("");
  };
   const {hasPermission}=useAuth()
  const handleExport = () => {
    const headers = [
      "Asset ID",
      "Name",
      "Category",
      "Site",
      "Status",
      "Operator",
      "Engine Hours",
      "Idle Hours",
      "Fuel",
    ];

    const csvData = filteredData
      .map((asset) =>
        [
          asset.assetId,
          asset.assetName,
          asset.category,
          asset.site,
          asset.status || "N/A",
          asset.operator,
          asset.engineHours,
          asset.idleHours,
          asset.fuelLevel,
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([[headers.join(","), csvData].join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assets_data.csv";
    link.click();

    // setToastType("success");
    // setToastMessage("Data exported successfully!");
    // setTimeout(() => setToastMessage(null), 3000);
  };
  return (
    <>
      <div className=" h-10 flex justify-between mb-4  ">
        <div></div>
        {hasPermission("ASSET_EXPORT") && (
          <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400 transition"
        >
          <Download size={16} />
          Export
        </button>
        )}
        
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
              placeholder="Search by assets by name,category..."
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
                  Asset ID
                </TableCell>
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
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Assigned Site
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
                  Operator
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Engine Hours
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Idle Hours
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Fuel %
                </TableCell>
                {hasPermission("ASSET_VIEW") && (
                  <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  View
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
              {filteredData.map((site) => (
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
                          {site.assetId}
                        </p>
                        {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {site.totalAssets}
                      </span> */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.assetName}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.category}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.site}
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        site.status === "Active"
                          ? "success"
                          : site.status === "Maintenance"
                            ? "warning"
                            : "error"
                      }
                    >
                      {site.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.operator}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.engineHours}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.idleHours}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.fuelLevel}
                  </TableCell>
                  {
                   hasPermission("ASSET_VIEW") && (
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <button
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsDrawerOpen(true);
                      }}
                    >
                      <Eye />
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
            <Drawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              title="Asset Details"
            >
              {isSelectedAsset && <AssetDetails asset={asset}/>}
            </Drawer>
          )} */}
          {isDrawerOpen && (
            <Modal isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              {isSelectedAsset && <AssetDetails asset={asset} />}
            </Modal>
          )}
        </div>
      </div>
    </>
  );
}

export default AssetTable;
