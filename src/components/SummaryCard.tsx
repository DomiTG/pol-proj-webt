interface Props {
  title: string;
  value: string;
  subtitle?: string;
  colorClass: string;
  icon: string;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  colorClass,
  icon,
}: Props) {
  return (
    <div className={`summary-card summary-card--${colorClass}`}>
      <div className="summary-card__icon">{icon}</div>
      <div className="summary-card__body">
        <p className="summary-card__title">{title}</p>
        <p className="summary-card__value">{value}</p>
        {subtitle && <p className="summary-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
