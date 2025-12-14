import React from 'react';
import { PlaystyleScores } from '../types';

interface RadarChartProps {
  scores: PlaystyleScores;
  themeColor?: string; // Optional hex color override
}

const RadarChart: React.FC<RadarChartProps> = ({ scores, themeColor = "#f59e0b" }) => {
  const size = 260;
  const center = size / 2;
  const radius = size / 2 - 50; // Padding for labels
  const levels = 4;
  
  // Define axes
  const axes = [
    { name: 'Aggression', value: scores.aggression },
    { name: 'Defense', value: scores.defense },
    { name: 'Magic', value: scores.magic },
    { name: 'Range', value: scores.range },
    { name: 'Complexity', value: scores.complexity },
  ];

  const angleSlice = (Math.PI * 2) / axes.length;

  const getCoordinates = (value: number, index: number, max: number = 10) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const gridPolygons = Array.from({ length: levels }).map((_, i) => {
    const levelFactor = (i + 1) / levels;
    const points = axes.map((_, idx) => {
      const { x, y } = getCoordinates(10 * levelFactor, idx);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  const dataPoints = axes.map((axis, idx) => {
    const { x, y } = getCoordinates(axis.value, idx);
    return `${x},${y}`;
  }).join(' ');

  const labels = axes.map((axis, idx) => {
    const { x, y } = getCoordinates(13, idx);
    return { x, y, name: axis.name, val: axis.value };
  });

  return (
    <div className="flex flex-col items-center relative z-10 w-full">
        <h3 className="font-bold cinzel text-sm mb-2 uppercase tracking-widest text-slate-400">Tactical Profile</h3>
        <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
            {/* Background Grid */}
            {gridPolygons.map((points, i) => (
                <polygon
                key={i}
                points={points}
                fill={i === levels - 1 ? "rgba(15, 23, 42, 0.5)" : "none"}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
                />
            ))}

            {/* Axes Lines */}
            {axes.map((_, idx) => {
                const { x, y } = getCoordinates(10, idx);
                return (
                <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                />
                );
            })}

            {/* Data Polygon with Dynamic Color */}
            <polygon
                points={dataPoints}
                fill={themeColor}
                fillOpacity="0.2"
                stroke={themeColor}
                strokeWidth="2"
                className="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            />
            
            {/* Data Points (Dots) */}
            {axes.map((axis, idx) => {
                 const { x, y } = getCoordinates(axis.value, idx);
                 return (
                     <circle key={idx} cx={x} cy={y} r="3" fill={themeColor} />
                 )
            })}
            </svg>

            {/* Labels */}
            {labels.map((label, idx) => (
                <div
                key={idx}
                className="absolute text-[10px] font-bold text-slate-500 text-center flex flex-col items-center justify-center w-20"
                style={{
                    left: label.x - 40,
                    top: label.y - 12,
                }}
                >
                    <span className="uppercase">{label.name}</span>
                    <span style={{ color: themeColor }}>{label.val}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default RadarChart;