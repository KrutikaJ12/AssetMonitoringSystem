import { Delete, Download, Eye, MapPin, Search, SquarePen, Trash2 } from "lucide-react";
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

const SiteAdmin = (Asset) => {
  const { data, isLoading, error } = useSites();
  console.log("siteData", data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedSiteFilter, setSelectedSiteFilter] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mode, setMode] = useState<
    "add" | "edit" | "view" | "delete" | "reset-password"
  >("add");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const hasFilters = search || selectedSite || status;
  const [isSelectedAsset, setSelectedAsset] = useState<any>(null);

  const sites = [
    { code: "MUM", name: "Mumbai" },
    { code: "PUN", name: "Pune" },
    { code: "VAS", name: "Vashi" },
  ];

  const filteredData = data?.data?.filter((site) => {
    const matchSite = selectedSiteFilter
      ? site.site === selectedSiteFilter
      : true;
    const matchSearch = search
      ? site.SiteName?.toLowerCase().includes(search.toLowerCase()) ||
        site.LocationName?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchSite && matchSearch;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedSite("");
    setSelectedSiteFilter("");
  };

  const { hasPermission } = useAuth();

  const handleDelete = (user) => {
    setSelectedAsset(user);
    setIsDeleteModalOpen(true);
  };

  const onDelete = () => {
    console.log("Deleted successfully");
    setIsDeleteModalOpen(false);
  };

  // Live Map redirect handler function
  const handleNavigateToLiveMap = (site) => {
    navigate("/admin/live-tracking", {
      state: {
        siteId: site.SiteID,
        siteName: site.SiteName,
        lat: parseFloat(site.Latitude) || 19.076,
        lng: parseFloat(site.Longitude) || 72.8777,
      },
    });
  };

  return (
    <>
      <div className="h-10 flex justify-between mb-4">
        <div className="text-xl font-semibold text-gray-800 dark:text-white">Sites</div>
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setMode("add");
          }}
        >
          + Add Sites
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        {/* Search + City/Branch Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
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

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Site Name
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Location
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Coordinates
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Asset Count
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Site Manager
                </TableCell>
                {hasPermission("ASSET_VIEW") && (
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredData?.map((site, index) => (
                <TableRow key={site.SiteID || index}>
                  {/* 1. SITE NAME HYPERLINK */}
                  <TableCell className="py-3">
                    <button
                      onClick={() => handleNavigateToLiveMap(site)}
                      className="group flex items-center gap-1.5 text-left font-medium text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 hover:underline transition-all"
                    >
                      <span>{site.SiteName}</span>
                      <MapPin size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </TableCell>

                  {/* 2. LOCATION NAME HYPERLINK */}
                  <TableCell className="py-3 text-theme-sm">
                    <button
                      onClick={() => handleNavigateToLiveMap(site)}
                      className="text-brand-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400 text-left cursor-pointer transition-colors"
                    >
                      {site.LocationName}
                    </button>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {site.Latitude}, {site.Longitude}
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
                        site.IsActive
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
                    <TableCell className="flex gap-3 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <button
                        onClick={() => {
                          setSelectedSite(site);
                          setIsModalOpen(true);
                          setMode("view");
                        }}
                      >
                        <Eye className="hover:text-brand-500" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSite(site);
                          setIsModalOpen(true);
                          setMode("edit");
                        }}
                      >
                        <SquarePen className="hover:text-brand-500" />
                      </button>
                      <button onClick={() => handleDelete(site)}>
                        <Trash2 className="hover:text-red-500" />
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

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