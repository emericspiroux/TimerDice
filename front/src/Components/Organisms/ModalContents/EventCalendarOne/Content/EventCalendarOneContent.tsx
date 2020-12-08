import { useRef, RefObject, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from 'react-redux';
import { deleteEvent, IEventBigCalendar, patchEvent } from '../../../../../Services/Redux/ducks/calendar.ducks';

import './EventCalendarOneContent.scss';
import { hideModal } from '../../../../../Services/Redux/ducks/modal.ducks';

export default function EventCalendarOneContent({ eventCalendar }: { eventCalendar: IEventBigCalendar }) {
  const dispatch = useDispatch();
  const textArea = useRef() as RefObject<HTMLTextAreaElement>;

  useEffect(() => {
    if (textArea?.current) textArea.current.value = eventCalendar.resource?.description || '';
  }, [textArea, eventCalendar]);

  let timeId;
  function onChangeDescription() {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      dispatch(patchEvent(eventCalendar.resource.id, { description: textArea.current?.value }));
    }, 1000);
  }

  function onDeleteEvent() {
    dispatch(deleteEvent(eventCalendar.resource.id));
    dispatch(hideModal());
  }

  return (
    <div className="EventCalendarOneContent">
      <div className="EventCalendarOneContent__top">
        <div className="EventCalendarOneContent__titleRow">
          <div
            className="EventCalendarOneContent__titleRow__color"
            style={{ backgroundColor: eventCalendar.hexColor }}
          />
          <div className="EventCalendarOneContent__titleRow__title">{eventCalendar?.title}</div>
        </div>
        <div className="EventCalendarOneContent__menu">
          <div
            className="EventCalendarOneContent__menu-button EventCalendarOneContent__menu__delete"
            onClick={onDeleteEvent}
          />
          <div
            className="EventCalendarOneContent__menu-button EventCalendarOneContent__menu__close"
            onClick={() => dispatch(hideModal())}
          />
        </div>
      </div>
      <div className="EventCalendarOneContent__timeRow xs-top">
        <span className="EventCalendarOneContent__timeRow__start">{new Date(eventCalendar.start).toDateString()}</span>
        &nbsp;-&nbsp;
        <span className="EventCalendarOneContent__timeRow__end">{new Date(eventCalendar.end).toDateString()}</span>
      </div>
      <div className="EventCalendarOneContent__descriptionRow m-top">
        <TextareaAutosize
          minRows={3}
          className="EventCalendarOneContent__descriptionRow__textArea"
          placeholder="Description..."
          onChange={onChangeDescription}
          ref={textArea}
        />
      </div>
    </div>
  );
}
