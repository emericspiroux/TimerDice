import { useRef, RefObject, useEffect, ChangeEvent } from 'react';
import moment from 'moment';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from 'react-redux';

import './EventCalendarOneContent.scss';
import { hideModal } from '../../../../../Services/Redux/ducks/modal.ducks';
import { IDiceFaceTime } from '../../../../../Services/Redux/ducks/dice.ducks';

interface EventCalendarOneContentProps {
  eventCalendar: IDiceFaceTime;
  onChangeDescription: Function;
  onDeleteEvent: Function;
}

export default function EventCalendarOneContent({
  eventCalendar,
  onChangeDescription,
  onDeleteEvent,
}: EventCalendarOneContentProps) {
  const dispatch = useDispatch();
  const textArea = useRef() as RefObject<HTMLTextAreaElement>;

  useEffect(() => {
    if (textArea?.current) textArea.current.value = eventCalendar.description || '';
  }, [textArea, eventCalendar]);

  return (
    <div className="EventCalendarOneContent">
      <div className="EventCalendarOneContent__top">
        <div className="EventCalendarOneContent__titleRow">
          <div
            className="EventCalendarOneContent__titleRow__color"
            style={{ backgroundColor: eventCalendar.face.color }}
          />
          <div className="EventCalendarOneContent__titleRow__title">{eventCalendar.face.name}</div>
        </div>
        <div className="EventCalendarOneContent__menu">
          {eventCalendar.end && (
            <div
              className="EventCalendarOneContent__menu-button EventCalendarOneContent__menu__delete"
              onClick={() => onDeleteEvent(eventCalendar)}
            />
          )}
          <div
            className="EventCalendarOneContent__menu-button EventCalendarOneContent__menu__close"
            onClick={() => dispatch(hideModal())}
          />
        </div>
      </div>
      <div className="EventCalendarOneContent__timeRow xs-top">
        <span className="EventCalendarOneContent__timeRow__start">{moment(eventCalendar.start).format('LLL')}</span>
        {eventCalendar.end && (
          <>
            &nbsp;-&nbsp;
            <span className="EventCalendarOneContent__timeRow__end">{moment(eventCalendar.end).format('LLL')}</span>
          </>
        )}
      </div>
      <div className="EventCalendarOneContent__descriptionRow m-top">
        <TextareaAutosize
          minRows={3}
          className="EventCalendarOneContent__descriptionRow__textArea"
          placeholder="Description..."
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChangeDescription(e.target.value, eventCalendar)}
          ref={textArea}
        />
      </div>
    </div>
  );
}
