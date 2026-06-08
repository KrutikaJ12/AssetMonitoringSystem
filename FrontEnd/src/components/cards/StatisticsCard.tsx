import { GroupIcon } from "../../icons";

const StatisticsCard = ({ key, title, value, icon }) => {
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {title}
            </span>
            <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
              {value}
            </h4>
          </div>
          <div className=" flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
        </div>
        {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
      </div>
    </>
  );
};

export default StatisticsCard;
