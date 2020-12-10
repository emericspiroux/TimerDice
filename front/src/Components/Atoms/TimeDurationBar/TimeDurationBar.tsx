import timestampToTime from '../../../Libs/TimestampToTime/TimestampToTime';
import './TimeDurationBar.scss';

export default function TimeDurationBar({
  percent,
  name,
  color,
  duration,
  className,
}: {
  percent: number;
  name: string;
  color: string;
  duration: number;
  className?: string;
}) {
  return (
    <div className={`TimeDurationBar ${className}`}>
      <div className="TimeDurationBar__name" style={{ color }}>
        {name}
      </div>
      <div className="TimeDurationBar__barWrapper">
        <div className="TimeDurationBar__barWrapper__before">{timestampToTime(duration / 1000)}</div>
        <div className="TimeDurationBar__barWrapper__bar" style={{ width: `${percent}%`, backgroundColor: color }}>
          <div className="TimeDurationBar__barWrapper__bar__after">{timestampToTime(duration / 1000)}</div>
        </div>
      </div>
      <div className="TimeDurationBar__percent">{percent.toFixed(0)}%</div>
    </div>
  );
}

TimeDurationBar.defaultProps = {
  className: '',
};
