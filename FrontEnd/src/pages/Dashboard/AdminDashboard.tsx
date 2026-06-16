// pages/AdminDashboard.tsx


import StatisticsMetrics from "../../components/dashboard/StatisticsMetrics";
import { GroupIcon } from "../../icons";
const adminMetrics = [
  {
    title: "Total Assets",
    value: 250,
    icon: <GroupIcon />,
  },
  {
    title: "Active Assets",
    value: 180,
    icon: <GroupIcon />,
  },
  {
    title: "Idle Assets",
    value: 45,
    icon: <GroupIcon />,
  },
  {
    title: "Total Sites",
    value: 18,
    icon: <GroupIcon />,
  },
  {
    title: "Active Operators",
    value: 320,
    icon: <GroupIcon />,
  },
];

export default function AdminDashboard() {
  return (
    <>
      <StatisticsMetrics metrics={adminMetrics} />
    </>
  );
}