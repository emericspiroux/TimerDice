import { FormEvent, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BlockPicker } from 'react-color';
import { Picker, Emoji } from 'emoji-mart';

import { IDiceFace, stopCurrentSettingDiceFace } from '../../../Services/Redux/ducks/dice.ducks';
import 'emoji-mart/css/emoji-mart.css';
import Loader from '../../Atoms/Loader';
import DiceLogoPlaceholder from '../../Atoms/DiceLogoPlaceholder';

import './UpdateFaceForm.scss';
import EmojiMartObject from '../../../Types/emoji-mart.types';

export default function UpdateFaceForm({
  face,
  onChange,
  isLoading,
  className,
}: {
  face: IDiceFace;
  onChange: Function;
  isLoading: boolean;
  className?: string;
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState(face.name);
  const [color, setColor] = useState(face.color);
  const [slackText, setSlackText] = useState(face.slackStatus?.text);
  const [slackEmoji, setSlackEmoji] = useState(face.slackStatus?.emoji);
  const [isDisplayEmojiPicker, setIsDisplayEmojiPicker] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const faceUpdated = { ...face };
    faceUpdated.name = name;
    faceUpdated.color = color;
    faceUpdated.slackStatus = face.slackStatus || {};
    faceUpdated.slackStatus.text = slackText;
    faceUpdated.slackStatus.emoji = slackEmoji;
    onChange(faceUpdated);
  }

  function onBack(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.preventDefault();
    dispatch(stopCurrentSettingDiceFace());
  }

  return (
    <form onSubmit={onSubmit} className={`UpdateFaceForm ${className || ''}`}>
      <div className="DiceSettings__image">
        <DiceLogoPlaceholder color={color} text={`#${face.faceId}`} />
      </div>
      <BlockPicker
        color={color}
        colors={[
          '#2196F3',
          '#2ABCD0',
          '#A7D72E',
          '#37D67A',
          '#FED73A',
          '#F9B93D',
          '#E32C69',
          '#683EAF',
          '#697689',
          '#384046',
        ]}
        onChange={(colorPicker) => setColor(`rgb(${colorPicker.rgb.r}, ${colorPicker.rgb.g}, ${colorPicker.rgb.b})`)}
        className="UpdateFaceForm__colorPicker"
      />
      <input
        type="text"
        onChange={(event) => setName(event.target.value)}
        defaultValue={face.name}
        placeholder="Nom de la face..."
        style={{ color }}
        className="UpdateFaceForm__input s-bottom xl-top"
      />
      <div className="UpdateFaceForm__slack xl-bottom xl-top">
        <div
          className="UpdateFaceForm__slack__emoji"
          onClick={(e) => {
            e.stopPropagation();
            setIsDisplayEmojiPicker(true);
          }}
        >
          {isDisplayEmojiPicker && (
            <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
              <Picker
                set="apple"
                onSelect={(emoji: EmojiMartObject) => {
                  setSlackEmoji(emoji.colons);
                  setIsDisplayEmojiPicker(false);
                }}
                i18n={{ search: 'Recherche', categories: { search: 'Résultats de recherche', recent: 'Récents' } }}
              />
              <div className="UpdateFaceForm__slack__closeEmoji" />
            </div>
          )}
          <Emoji emoji={slackEmoji || ':question:'} size={40} />
        </div>
        <input
          type="text"
          onChange={(event) => setSlackText(event.target.value)}
          defaultValue={face.slackStatus?.text || ''}
          style={{ color }}
          placeholder="Slack status..."
          maxLength={100}
          className="UpdateFaceForm__input UpdateFaceForm__input-slack"
        />
      </div>
      <div className="UpdateFaceForm__button">
        {isLoading ? (
          <Loader size="40px" />
        ) : (
          <>
            <button type="submit" className="button button-blue" disabled={!name}>
              Enregistrer
            </button>
            <button type="submit" className="button button-back s-top" onClick={onBack}>
              Retour
            </button>
          </>
        )}
      </div>
    </form>
  );
}

UpdateFaceForm.defaultProps = {
  className: '',
};
