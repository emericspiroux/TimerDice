import moment from 'moment';
import { ChangeEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import PercentDuration from '../../../Libs/PercentDuration/PercentDuration';
import timestampToTime from '../../../Libs/TimestampToTime/TimestampToTime';
import { IDiceFaceTimeRangeElement } from '../../../Services/Redux/ducks/data.ducks';
import { IDiceFaceTime } from '../../../Services/Redux/ducks/dice.ducks';

import './FaceSummaryDescriptions.scss';

interface FaceSummaryDescriptionsProps {
  events: IDiceFaceTimeRangeElement[];
  totalDuration: number;
  className?: string;
  /* eslint-disable-next-line no-unused-vars */
  onChangeDescription: (e: ChangeEvent<HTMLTextAreaElement>, element: IDiceFaceTime) => void;
  /* eslint-disable-next-line no-unused-vars */
  onDelete: (element: IDiceFaceTime) => void;
}

export default function FaceSummaryDescriptions({
  events,
  totalDuration,
  onChangeDescription,
  onDelete,
  className,
}: FaceSummaryDescriptionsProps) {
  function entriesTable() {
    return events.map((rangeEvent: IDiceFaceTimeRangeElement) => (
      <div key={rangeEvent.face.faceId} className={`FaceSummaryDescriptions__row ${className}`}>
        <div className="FaceSummaryDescriptions__row__titleWrapper">
          <div className="FaceSummaryDescriptions__row__titleWrapper__title">
            <div
              className="FaceSummaryDescriptions__row__titleWrapper__title__dot"
              style={{ backgroundColor: rangeEvent.face.color }}
            />
            <span style={{ color: rangeEvent.face.color }}>
              {rangeEvent.face.name}
              <br /> {PercentDuration(rangeEvent.duration, totalDuration).toFixed(0)}%
            </span>
          </div>
          <div className="FaceSummaryDescriptions__row__titleWrapper__duration m-top">
            Total : {timestampToTime(rangeEvent.duration / 1000)}
          </div>
        </div>
        <div className="FaceSummaryDescriptions__row__descriptionsWrapper">
          {rangeEvent.elements
            .sort((a: IDiceFaceTime, b: IDiceFaceTime) => b.duration - a.duration)
            .map((rangeEventElement: IDiceFaceTime) => (
              <div key={rangeEventElement.id} className="FaceSummaryDescriptions__row__descriptionsWrapper__container">
                <div className="FaceSummaryDescriptions__row__descriptionsWrapper__container__description">
                  <div className="FaceSummaryDescriptions__row__descriptionsWrapper__container__description__text">
                    <TextareaAutosize
                      minRows={1}
                      className="EventCalendarOneContent__descriptionRow__textArea"
                      placeholder="Pas de description..."
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChangeDescription(e, rangeEventElement)}
                      defaultValue={rangeEventElement.description}
                    />
                  </div>
                  <div className="FaceSummaryDescriptions__row__descriptionsWrapper__container__description__subText">
                    {timestampToTime(rangeEventElement.duration / 1000)} - Début :{' '}
                    {moment(rangeEventElement.start).format('LT')}
                  </div>
                </div>
                <div className="FaceSummaryDescriptions__row__descriptionsWrapper__container__deleteWrapper">
                  <div
                    className="FaceSummaryDescriptions__container__deleteWrapper__icon clickable"
                    onClick={() => onDelete(rangeEventElement)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    ));
  }
  return <div className="FaceSummaryDescriptions">{entriesTable()}</div>;
}

FaceSummaryDescriptions.defaultProps = {
  className: '',
};
