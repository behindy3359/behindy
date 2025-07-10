import React from "react";
import { StatCardProps } from "../../../../components/homepage/types";
import { StatItem } from "../styles";

export const StatCard = React.memo<
StatCardProps
>(function StatCard({ 
  stat, index 
}) {
  const { icon: Icon, title, value, change } = stat;

  return (
    <StatItem
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div className="stat-content">
        <div className="stat-number">{value}</div>
        <div className="stat-label">{title}</div>
        <div className="stat-change">{change}</div>
      </div>
    </StatItem>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.stat.value === nextProps.stat.value &&
    prevProps.stat.change === nextProps.stat.change &&
    prevProps.stat.title === nextProps.stat.title
  );
});