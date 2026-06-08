import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define the TypeScript interface for the table rows
// interface Site {
//   id: number; // Unique identifier for each site
//   name: string; // Site name
//   variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
//   category: string; // Category of the site
//   price: string; // Price of the site (as a string with currency symbol)
//   // status: string; // Status of the site
//   image: string; // URL or path to the site image
//   status: "Delivered" | "Pending" | "Canceled"; // Status of the site
// }

// Define the table data using the interface
// const tableData: Site[] = [
//   {
//     id: 1,
//     name: "MacBook Pro 13”",
//     variants: "2 Variants",
//     category: "Laptop",
//     price: "$2399.00",
//     status: "Delivered",
//     image: "/images/site/site-01.jpg", // Replace with actual image URL
//   },
//   {
//     id: 2,
//     name: "Apple Watch Ultra",
//     variants: "1 Variant",
//     category: "Watch",
//     price: "$879.00",
//     status: "Pending",
//     image: "/images/site/site-02.jpg", // Replace with actual image URL
//   },
//   {
//     id: 3,
//     name: "iPhone 15 Pro Max",
//     variants: "2 Variants",
//     category: "SmartPhone",
//     price: "$1869.00",
//     status: "Delivered",
//     image: "/images/site/site-03.jpg", // Replace with actual image URL
//   },
//   {
//     id: 4,
//     name: "iPad Pro 3rd Gen",
//     variants: "2 Variants",
//     category: "Electronics",
//     price: "$1699.00",
//     status: "Canceled",
//     image: "/images/site/site-04.jpg", // Replace with actual image URL
//   },
//   {
//     id: 5,
//     name: "AirPods Pro 2nd Gen",
//     variants: "1 Variant",
//     category: "Accessories",
//     price: "$240.00",
//     status: "Delivered",
//     image: "/images/site/site-05.jpg", // Replace with actual image URL
//   },
// ];
interface SiteSummary {
  id: number;
  siteName: string;
  totalAssets: number;
  activeAssets: number;
  idleAssets: number;
  maintenance: number;
  operators: number;
  fuelConsumption: number;
  utilization: number;
}

const tableData: SiteSummary[] = [
  {
    id: 1,
    siteName: "Mumbai Site",
    totalAssets: 25,
    activeAssets: 18,
    idleAssets: 4,
    maintenance: 3,
    operators: 18,
    fuelConsumption: 2450,
    utilization: 72,
  },
  {
    id: 2,
    siteName: "Pune Site",
    totalAssets: 12,
    activeAssets: 9,
    idleAssets: 2,
    maintenance: 1,
    operators: 10,
    fuelConsumption: 1350,
    utilization: 68,
  },
    {
    id: 3,
    siteName: "Hyderbad Site",
    totalAssets: 40,
    activeAssets: 28,
    idleAssets: 6,
    maintenance: 6,
    operators: 28,
    fuelConsumption:3680,
    utilization: 70,
  },
];
export default function SiteSummary() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Site Summary
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
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
                Total Assets
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Active Assets
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Idle Assets
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Maintainence
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Operators
              </TableCell>
              <TableCell
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
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((site) => (
              <TableRow key={site.id} className="">
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
                        {site.siteName}
                      </p>
                      {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {site.totalAssets}
                      </span> */}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {site.totalAssets}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {site.activeAssets}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {site.idleAssets}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {site.maintenance}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {site.operators}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {site.fuelConsumption}
                </TableCell>
                {/* <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      site.status === "Delivered"
                        ? "success"
                        : site.status === "Pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {site.status}
                  </Badge>
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${site.utilization}%` }}
                      />
                    </div>

                    <span>{site.utilization}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
