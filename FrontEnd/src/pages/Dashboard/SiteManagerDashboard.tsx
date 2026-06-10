
import StatisticsMetrics from '../../components/dashboard/StatisticsMetrics'
import { GroupIcon } from '../../icons';
const siteManagerMetrics = [
  {
    title: "Site Assets",
    value: 25,
    icon: <GroupIcon />,
  },
  {
    title: "Active Assets",
    value: 18,
    icon: <GroupIcon />,
  },
  {
    title: "Idle Assets",
    value: 4,
    icon: <GroupIcon />,
  },
  {
    title: "Maintenance Due",
    value: 3,
    icon: <GroupIcon />,
  },
  {
    title: "Operators",
    value: 12,
    icon: <GroupIcon />,
  },
];
const SiteManagerDashboard = () => {
  return (
    <div>
      <StatisticsMetrics metrics={siteManagerMetrics}/>
    </div>
  )
}

export default SiteManagerDashboard