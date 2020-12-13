import { useRef, RefObject, useEffect, ChangeEvent, useState } from 'react';
import moment from 'moment';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from 'react-redux';

import './EventCalendarOneContent.scss';
import { hideModal } from '../../../../../Services/Redux/ducks/modal.ducks';
import { IDiceFace, IDiceFaceTime } from '../../../../../Services/Redux/ducks/dice.ducks';
import FaceForm from '../../../../Molecules/FaceForm/FaceForm';

interface EventCalendarOneContentProps {
  eventCalendar: IDiceFaceTime;
  onChangeDescription: Function;
  onChangeFace: Function;
  onDeleteEvent?: Function;
  onStopEvent?: Function;
}

export default function EventCalendarOneContent({
  eventCalendar,
  onChangeDescription,
  onChangeFace,
  onDeleteEvent,
  onStopEvent,
}: EventCalendarOneContentProps) {
  const dispatch = useDispatch();
  const textArea = useRef() as RefObject<HTMLTextAreaElement>;
  const [eventCalendarCurrent, setEventCalendarCurrent] = useState(eventCalendar);

  useEffect(() => {
    if (textArea?.current) textArea.current.value = eventCalendar.description || '';
  }, [textArea, eventCalendar]);

  function onChangeFaceElement(selected: IDiceFace) {
    const updatedEvent: IDiceFaceTime = {
      ...eventCalendarCurrent,
      faceId: selected.faceId,
      face: selected,
    };
    setEventCalendarCurrent(updatedEvent);
    onChangeFace(selected.faceId, updatedEvent);
  }

  return (
    <div className="EventCalendarOneContent">
      <div className="EventCalendarOneContent__top">
        <div className="EventCalendarOneContent__titleRow">
          <FaceForm current={eventCalendarCurrent.face} onUpdate={onChangeFaceElement} />
          <div className="EventCalendarOneContent__titleRow__title">{eventCalendarCurrent.face.name}</div>
        </div>
        <div className="EventCalendarOneContent__menu">
          {onStopEvent && (
            <div
              className="EventCalendarOneContent__menu-button EventCalendarOneContent__menu__stop"
              onClick={() => onStopEvent(eventCalendarCurrent)}
            />
          )}
          {onDeleteEvent && eventCalendarCurrent.end && (
            <div
              className="EventCalendarOneContent__menu-button EventCalendarOneContent__menu__delete"
              onClick={() => onDeleteEvent(eventCalendarCurrent)}
            />
          )}
          <div
            className="EventCalendarOneContent__menu-button EventCalendarOneContent__menu__close"
            onClick={() => dispatch(hideModal())}
          />
        </div>
      </div>
      <div className="EventCalendarOneContent__timeRow xs-top">
        <span className="EventCalendarOneContent__timeRow__start">
          {moment(eventCalendarCurrent.start).format('LLL')}
        </span>
        {eventCalendarCurrent.end && (
          <>
            &nbsp;-&nbsp;
            <span className="EventCalendarOneContent__timeRow__end">
              {moment(eventCalendarCurrent.end).format('LLL')}
            </span>
          </>
        )}
      </div>
      <div className="EventCalendarOneContent__descriptionRow m-top">
        <TextareaAutosize
          minRows={3}
          className="EventCalendarOneContent__descriptionRow__textArea"
          placeholder="Description..."
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChangeDescription(e.target.value, eventCalendarCurrent)}
          ref={textArea}
        />
      </div>
    </div>
  );
}

EventCalendarOneContent.defaultProps = {
  onStopEvent: undefined,
  onDeleteEvent: undefined,
};
