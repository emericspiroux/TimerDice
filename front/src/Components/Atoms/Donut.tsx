import { ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Donut.scss';

interface DonutProps {
  data: { percent?: number; color?: string }[];
  borderWidth?: string;
  children?: ReactNode;
  size?: string;
  backgroundColor: string;
}

export default function Donut({
  data,
  borderWidth,
  children,
  size,
  backgroundColor,
}: DonutProps) {
  const [conicGradient, setConicGradient] = useState<string>();

  useEffect(() => {
    function getBackground(): string {
      const gradient: string[] = [];
      let previousDeg = 0;
      for (const percentData of data) {
        const newDeg = 360 * ((percentData.percent || 0) / 100);
        gradient.push(
          `${percentData.color || '#2196F3'} ${
            (previousDeg && `${previousDeg}deg `) || '0deg'
          } ${newDeg}deg`,
        );
        previousDeg = newDeg;
      }
      if (previousDeg < 360) {
        gradient.push(`${backgroundColor} ${previousDeg}deg 360deg`);
      }
      return `conic-gradient(${gradient.join(', ')})`;
    }
    const backgroundString = getBackground();
    setConicGradient(backgroundString);
  }, [data, backgroundColor]);

  return (
    <div className="Donut" style={{ width: size, height: size }}>
      <div
        className="Donut__border"
        style={{
          background: conicGradient,
          padding: borderWidth,
        }}
      >
        <div className="Donut__center">{children}</div>
      </div>
    </div>
  );
}

Donut.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      percent: PropTypes.number,
      color: PropTypes.string,
    }),
  ).isRequired,
  backgroundColor: PropTypes.string,
  borderWidth: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.string,
};

Donut.defaultProps = {
  borderWidth: '20px',
  backgroundColor: 'white',
  children: null,
  size: '250px',
};
