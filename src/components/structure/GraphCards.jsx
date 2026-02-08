import React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const CustomizedContent = (props) => {
  const { x, y, width, height, index, name, size, root } = props;

  const displayPercent = `${size}%`;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: `hsl(${(index * (360 / root.children.length))}, 60%, 50%)`,
          stroke: "#0a0027",
          strokeWidth: 1,
        }}
      />
      {width > 45 && height > 35 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#fff"
            fontSize={11} 
          >
            {displayPercent}
          </text>
        </>
      )}
    </g>
  );
};

const GraphCards = ({ cards }) => {
  const data = cards.map((c) => ({
    name: c.name,
    size: Number(c.appears) || 0,
  }));

  if (data.length === 0) return <p>Cargando datos...</p>;

  return (
    <div style={{ width: '100%', height: '500px', minWidth: '0' }}>
        <h1 style={{textAlign:"center"}}>% de Aparición de las cartas</h1>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#ffffff"
          content={<CustomizedContent />}
        >
          <Tooltip 
            formatter={(value, name) => [`${value}% de aparición`, name]}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCards;