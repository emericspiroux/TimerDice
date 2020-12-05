/* eslint-disable */
import { ReactNode } from 'react';
import PropTypes from 'prop-types';

import useSinceClock from '../../../Hooks/Atoms/useSinceClock';
import Donut from '../../Atoms/Donut';

interface DonutTimerProps {
  startDate: Date;
  color?: string;
  borderWidth?: string;
  children: ReactNode;
  backgroundColor?: string;
  size?: string;
}

export default function DonutTimer({
  startDate,
  children,
  color,
  size,
  borderWidth,
  backgroundColor,
}: DonutTimerProps) {
  const sinceSecond = useSinceClock(startDate);

  function last60SecondPercent(): number {
    if (!sinceSecond) return 0;
    let last60;
    if (sinceSecond < 60) {
      last60 = sinceSecond % 60;
    } else {
      last60 = (sinceSecond / 60) % 60;
    }
    return Number(((last60 / 60) * 100).toFixed(0));
  }

  const percent = last60SecondPercent();

  return (
    <div className="DonutTimer">
      <Donut
        data={[
          {
            percent,
            color,
          },
        ]}
        size={size}
        borderWidth={borderWidth}
        backgroundColor={backgroundColor}
      >
        {children}
      </Donut>
    </div>
  );
}

DonutTimer.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderWidth: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.string,
};

DonutTimer.defaultProps = {
  startDate: undefined,
  borderWidth: '20px',
  backgroundColor: 'white',
  children: null,
  size: '250px',
  color: '',
};
