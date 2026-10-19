import React from 'react';
import { useNavigate } from 'react-router';
import {
  Clock,
  Fuel,
  MapPin,
  Settings,
  Wrench,
  Calendar,
  Building2,
  Cpu,
  Gauge,
  RefreshCw,
} from "lucide-react";

interface AssetDetailsProps {
  asset: {
    AssetName: string;
    AssetCode: string;
    Status: string;
    Category: string;
    SiteName: string;
    operator?: string;
    customer?: string;
    purchaseDate?: string;
    Model: string;
    SerialNo: string;
    EngineHours: number;
    IdleHours: number;
    FuelPercentage: number;
    lastUpdated: string;
    lastService?: string;
    nextService?: string;
    maintenanceStatus?: string;
    currentSite?: string;
    lastSeen?: string;
    latitude?: number;
    longitude?: number;
    refillData?: number | 'NA';
    drainData?: number | 'NA';
    tankCapacity?: number | 'NA';
    consumptionSensor?: number | 'NA';
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

// Futuristic Fuel Cluster Component
const AdvancedFuelCluster = ({ asset }: { asset: AssetDetailsProps['asset'] }) => {
  const percentage = asset.FuelPercentage ?? 'NA';
  const rotation = percentage === 'NA' ? -90 : (Number(percentage) / 100) * 180 - 90;

  return (
    <div className="relative rounded-2xl p-5 bg-gradient-to-b from-blue-950/90 via-slate-900/95 to-slate-950 text-white shadow-2xl overflow-hidden border border-blue-500/30">
      
      {/* Background glowing effects */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
            <Fuel size={20} />
          </div>
          <h3 className="font-bold text-lg tracking-wide text-blue-100">Fuel Cluster</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 font-medium animate-pulse">
          Live Sync
        </span>
      </div>

      {/* Semi-circular Gauge & Animated Orbit */}
      <div className="relative w-full flex flex-col items-center justify-center py-6">
        <div className="absolute w-52 h-52 rounded-full border border-blue-500/20 animate-[spin_25s_linear_infinite] pointer-events-none">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-1.5 rounded-full bg-slate-900/80 border border-blue-400/40 text-blue-400 shadow-lg">
            <Settings size={12} />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 p-1.5 rounded-full bg-slate-900/80 border border-cyan-400/40 text-cyan-400 shadow-lg">
            <Cpu size={12} />
          </div>
        </div>

        <div className="absolute w-40 h-40 rounded-full border border-cyan-500/20 animate-[spin_20s_linear_infinite_reverse] pointer-events-none"></div>

        <div className="relative w-56 h-28 overflow-hidden">
          <div className="absolute inset-0 rounded-t-full border-4 border-slate-700/60 border-b-0"></div>
          <div className="absolute inset-0 rounded-t-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 border-l-transparent transform -rotate-45"></div>

          <div 
            className="absolute left-1/2 bottom-0 h-24 w-0.5 bg-gradient-to-t from-transparent via-cyan-400 to-red-500 origin-bottom transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
          </div>

          <div className="absolute bottom-1 left-4 text-xs font-black text-red-500 tracking-wider">E</div>
          <div className="absolute bottom-1 right-4 text-xs font-black text-green-400 tracking-wider">F</div>
        </div>

        <div className="mt-2 flex flex-col items-center z-10">
          <div className="p-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-1 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
            <Fuel size={22} />
          </div>
          <div className="text-2xl font-black tracking-tight text-white">
            {percentage === 'NA' ? 'NA' : `${percentage}%`}
          </div>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-2 mt-4 bg-slate-900/60 rounded-xl p-3.5 border border-slate-800 backdrop-blur-md">
        <div className="flex justify-between items-center py-1 border-b border-slate-800/80 text-sm">
          <span className="text-slate-400">Refill</span>
          <span className="font-semibold text-green-400">{asset.refillData ?? 'NA'}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/80 text-sm">
          <span className="text-slate-400">Drain</span>
          <span className="font-semibold text-amber-400">{asset.drainData ?? 'NA'}</span>
        </div>
        <div className="flex justify-between items-center py-1 text-sm">
          <span className="text-slate-400">Tank Capacity</span>
          <span className="font-semibold text-white">{asset.tankCapacity ?? 'NA'} ltr</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Gauge size={14} className="text-cyan-400" />
            <span>Consumption Sensor</span>
          </div>
          <span className="text-lg font-bold text-white">{asset.consumptionSensor ?? 'NA'} ltr</span>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Data Sync</span>
            <RefreshCw size={12} className="text-emerald-400 animate-spin" />
          </div>
          <span className="text-xs font-medium text-emerald-400">last updated</span>
          <span className="text-sm font-bold text-white">{asset.lastUpdated || '1s ago'}</span>
        </div>
      </div>

    </div>
  );
};

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const navigate = useNavigate();

  const handleViewOnMap = () => {
    // Check current URL to decide whether to use admin or siteManager route prefix
    const currentPath = window.location.pathname;
    const trackingPath = currentPath.startsWith('/admin') 
      ? '/admin/live-tracking' 
      : currentPath.startsWith('/siteManager') 
        ? '/siteManager/live-tracking' 
        : '/admin/live-tracking'; // Default fallback

    navigate(trackingPath, { 
      state: { 
        lat: asset.latitude, 
        lng: asset.longitude, 
        siteName: asset.currentSite || asset.SiteName 
      } 
    });
  };

  return (
    <div className="space-y-6 overflow-y-auto p-4 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-5 bg-white p-4 rounded-xl shadow-sm">
        <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
          🚜
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{asset.AssetName}</h2>
          <p className="text-sm text-gray-500">{asset.AssetCode}</p>

          <span className="inline-flex mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {asset.Status}
          </span>
        </div>
      </div>

      {/* Overview */}
      <section className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-gray-800">
          <Building2 size={18} />
          <h3 className="font-semibold">Overview</h3>
        </div>

        <InfoRow label="Category" value={asset.Category} />
        <InfoRow label="Site" value={asset.SiteName} />
        <InfoRow label="Model" value={asset.Model} />
        <InfoRow label="Serial Number" value={asset.SerialNo} />
      </section>

      {/* Fuel Cluster */}
      <section>
        <AdvancedFuelCluster asset={asset} />
      </section>

      {/* Live Metrics */}
      <section className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-gray-800">
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

        {/* View on Map Button with Dynamic Navigation */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={handleViewOnMap}
            className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin size={16} /> View on Map
          </button>
        </div>
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
    <div className="rounded-lg border border-gray-100 p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        {icon}
      </div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}