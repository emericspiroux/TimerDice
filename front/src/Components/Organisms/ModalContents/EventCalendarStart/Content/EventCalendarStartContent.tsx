/* eslint-disable */
// import { useRef, RefObject, useEffect, ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import './EventCalendarStartContent.scss';
import FaceFormList from '../../../../Molecules/FaceFormList/FaceFormList';
import { hideModal } from '../../../../../Services/Redux/ducks/modal.ducks';
import { IDiceFace } from '../../../../../Services/Redux/ducks/dice.ducks';
import moment from 'moment';

interface EventCalendarStartContentProps {
  onStart: (diceFace: IDiceFace) => void;
  title: string;
  range?: {
    start: Date;
    end: Date;
  };
}

export default function EventCalendarStartContent({ onStart, title, range }: EventCalendarStartContentProps) {
  const dispatch = useDispatch();

  return (
    <div className="EventCalendarStartContent">
      <div className="EventCalendarStartContent__top l-bottom">
        <div className="EventCalendarStartContent__titleRow">
          <div className="EventCalendarStartContent__titleRow__title">{title}</div>
          {range && (
            <div className="EventCalendarStartContent__timeRow xs-top">
              <span className="EventCalendarOneContent__timeRow__start">{moment(range.start).format('LLL')}</span>
              &nbsp;-&nbsp;
              <span className="EventCalendarOneContent__timeRow__end">{moment(range.end).format('LLL')}</span>
            </div>
          )}
        </div>
        <div className="EventCalendarStartContent__menu">
          <div className="EventCalendarStartContent__menu__title"></div>
          <div
            className="EventCalendarStartContent__menu-button EventCalendarStartContent__menu__close"
            onClick={() => dispatch(hideModal())}
          />
        </div>
      </div>
      <FaceFormList onSelect={onStart} />
    </div>
  );
}

EventCalendarStartContent.defaultProps = {
  onStart: () => {},
};
