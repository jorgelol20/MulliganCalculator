import React from "react";
import { useTranslation } from "react-i18next";
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
        <foreignObject x={x} y={y} width={width} height={height}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '2px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            <span style={{
              position: 'relative',
              fontSize: '0.7cqw',
              fontWeight: 'bold',
              lineHeight: '1',
              wordBreak: 'break-word'
            }}>
              {name}
            </span>
            <span style={{ fontSize: '10px', marginTop: '2px' }}>
              {displayPercent}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

const GraphCards = ({ cards, numberOfHands }) => {
  const {t, i18n} = useTranslation();
  const data = cards.map((c) => ({
    name: c.name,
    size: Number((c.appears * 100 / numberOfHands).toFixed(1)) || 0,
  }));

  if (data.length === 0) return <p>Cargando datos...</p>;

  return (
    <div style={{ width: '100%', height: '500px', minWidth: '0' }}>
      <h1 style={{ textAlign: "center" }}>{t('cardAppears')}</h1>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#ffffff"
          content={<CustomizedContent />}
        >
          <Tooltip
            formatter={(value, name) => [
              `${t('numberOf')}${value}%${t('numberOf2')}`, 
              name
            ]}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCards;
