import {
  Clock,
  Fuel,
  MapPin,
  Settings,
  Wrench,
  Calendar,
  User,
  Building2,
} from "lucide-react";


interface AssetDetailsProps {
  asset: {
    assetId: string;
    name: string;
    category: string;
    site: string;
    operator: string;
    customer: string;
    model: string;
    serialNumber: string;
    purchaseDate: string;
    status: string;
    engineHours: number;
    idleHours: number;
    fuelLevel: number;
    lastUpdated: string;
    lastService: string;
    nextService: string;
    maintenanceStatus: string;
    currentSite: string;
    lastSeen: string;
  };
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-start py-1">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900 text-right">
      {value}
    </span>
  </div>
);

export default function AssetDetails({ asset }: any) {
  return (
    <div className="space-y-6 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-5">
        <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
          🚜
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold">{asset.AssetName}</h2>
          <p className="text-sm text-gray-500">{asset.AssetCode}</p>

          <span className="inline-flex mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {asset.Status}
          </span>
        </div>
      </div>

      {/* Overview */}
      <section >
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={18} />
          <h3 className="font-semibold">Overview</h3>
        </div>

        <InfoRow label="Category" value={asset.Category} />
        <InfoRow label="Site" value={asset.SiteName} />
        <InfoRow label="Operator" value={asset.operator} />
        <InfoRow label="Customer" value={asset.customer} />
        <InfoRow label="Purchase Date" value={asset.purchaseDate} />
        <InfoRow label="Model" value={asset.Model} />
        <InfoRow label="Serial Number" value={asset.SerialNo} />
      </section>

      {/* Live Metrics */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Settings size={18} />
          <h3 className="font-semibold">Live Metrics</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={<Clock size={18} />}
            title="Engine Hours"
            value={`${asset.EngineHours} hrs`}
          />

          <MetricCard
            icon={<Clock size={18} />}
            title="Idle Hours"
            value={`${asset.IdleHours} hrs`}
          />

          <MetricCard
            icon={<Fuel size={18} />}
            title="Fuel Level"
            value={`${asset.FuelPercentage}%`}
          />

          <MetricCard
            icon={<Calendar size={18} />}
            title="Last Updated"
            value={asset.lastUpdated}
          />
        </div>
      </section>

      {/* Maintenance */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Wrench size={18} />
          <h3 className="font-semibold">Maintenance</h3>
        </div>

        <InfoRow label="Last Service" value={asset.lastService} />
        <InfoRow label="Next Service" value={asset.nextService} />

        <InfoRow
          label="Health"
          value={
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              {asset.maintenanceStatus}
            </span>
          }
        />
      </section>

      {/* Location */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={18} />
          <h3 className="font-semibold">Location</h3>
        </div>

        <InfoRow label="Current Site" value={asset.currentSite} />
        <InfoRow label="Last Seen" value={asset.lastSeen} />

        <button className="mt-3 text-sm font-medium text-blue-600 hover:underline">
          View on Map
        </button>
      </section>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function MetricCard({ icon, title, value }: MetricCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500">{title}</span>
        {icon}
      </div>

      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}