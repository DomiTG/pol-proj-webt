import type { MonthlySummary } from "../types";
import { monthLabel } from "../utils/format";

interface Props {
  data: MonthlySummary[];
}

export default function MonthlyChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Zatím žádná data pro zobrazení grafu.</p>
      </div>
    );
  }

  const recent = data.slice(-6);
  const maxVal = Math.max(
    ...recent.map((d) => Math.max(d.income, d.expenses)),
    1
  );

  const BAR_HEIGHT = 180;
  const BAR_WIDTH = 32;
  const GROUP_GAP = 16;
  const GROUP_WIDTH = BAR_WIDTH * 2 + GROUP_GAP;
  const SIDE_PAD = 32;
  const totalWidth = recent.length * (GROUP_WIDTH + 24) + SIDE_PAD * 2;

  return (
    <div className="chart-wrapper">
      <svg
        width="100%"
        viewBox={`0 0 ${totalWidth} ${BAR_HEIGHT + 52}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Měsíční přehled příjmů a výdajů"
        role="img"
      >
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = Math.round(BAR_HEIGHT * frac);
          return (
            <line
              key={frac}
              x1={SIDE_PAD}
              x2={totalWidth - SIDE_PAD}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {recent.map((d, i) => {
          const x = SIDE_PAD + i * (GROUP_WIDTH + 24);
          const incomeH = Math.round((d.income / maxVal) * BAR_HEIGHT);
          const expH = Math.round((d.expenses / maxVal) * BAR_HEIGHT);

          return (
            <g key={d.month}>
              {/* income bar */}
              <rect
                x={x}
                y={BAR_HEIGHT - incomeH}
                width={BAR_WIDTH}
                height={incomeH}
                rx={4}
                fill="#22c55e"
                opacity={0.85}
              />
              {/* expense bar */}
              <rect
                x={x + BAR_WIDTH + GROUP_GAP}
                y={BAR_HEIGHT - expH}
                width={BAR_WIDTH}
                height={expH}
                rx={4}
                fill="#ef4444"
                opacity={0.85}
              />
              {/* month label */}
              <text
                x={x + BAR_WIDTH + GROUP_GAP / 2}
                y={BAR_HEIGHT + 20}
                textAnchor="middle"
                fontSize={11}
                fill="#64748b"
              >
                {monthLabel(d.month)}
              </text>
            </g>
          );
        })}

        {/* legend */}
        <rect
          x={totalWidth - SIDE_PAD - 120}
          y={BAR_HEIGHT + 36}
          width={12}
          height={12}
          rx={2}
          fill="#22c55e"
        />
        <text
          x={totalWidth - SIDE_PAD - 104}
          y={BAR_HEIGHT + 47}
          fontSize={11}
          fill="#64748b"
        >
          Příjmy
        </text>
        <rect
          x={totalWidth - SIDE_PAD - 50}
          y={BAR_HEIGHT + 36}
          width={12}
          height={12}
          rx={2}
          fill="#ef4444"
        />
        <text
          x={totalWidth - SIDE_PAD - 34}
          y={BAR_HEIGHT + 47}
          fontSize={11}
          fill="#64748b"
        >
          Výdaje
        </text>
      </svg>
    </div>
  );
}
