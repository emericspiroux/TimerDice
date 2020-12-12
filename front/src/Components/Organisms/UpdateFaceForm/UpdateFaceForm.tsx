import { FormEvent, useState } from 'react';
import { BlockPicker } from 'react-color';
import { IDiceFace } from '../../../Services/Redux/ducks/dice.ducks';
import Loader from '../../Atoms/Loader';

import './UpdateFaceForm.scss';

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
  const [name, setName] = useState(face.name);
  const [color, setColor] = useState(face.color);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const faceUpdated = { ...face };
    faceUpdated.name = name;
    faceUpdated.color = color;
    onChange(faceUpdated);
  }

  return (
    <form onSubmit={onSubmit} className={`UpdateFaceForm ${className || ''}`}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        height="295.49275912777307"
        width="333.00814571369443"
        className="UpdateFaceForm__image"
      >
        <g opacity="1">
          <g opacity="1">
            <path
              fillOpacity="0"
              stroke={color || 'rgb(168,168,168)'}
              strokeOpacity="1"
              strokeWidth="15"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              opacity="1"
              fillRule="evenodd"
              /* eslint-disable-next-line max-len */
              d="M102.2154258319257 38.068246408792746C110.06033626361446 33.67189912378075 224.14159022610775 35.11098545490005 229.47172263638143 38.068246408792746C234.80185504665513 41.02550736268544 297.7883102238584 140.19865928551422 297.7233697114357 149.25733411123116C297.65842919901286 158.3160089369481 237.75840313334592 252.4630082365099 229.47172263638143 256.98528289686215C221.1850421394169 261.50755755721445 109.55770028364911 261.0509485625757 102.2154258319257 256.98528289686215C94.8731513802023 252.9196172311486 35.34918398164655 158.3666431242639 35.28477837767905 149.25733411123116C35.22037277371155 140.14802509819842 94.37051540023691 42.464593693804744 102.2154258319257 38.068246408792746Z"
            />
          </g>
          <g opacity="1">
            <path
              fillOpacity="0"
              stroke={color || 'rgb(168,168,168)'}
              strokeOpacity="1"
              strokeWidth="15"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              opacity="1"
              fillRule="evenodd"
              /* eslint-disable-next-line max-len */
              d="M293.3200869812818 150.91409706627437C293.2751362269747 159.33342805429663 111.15606375429986 259.072444570548 104.85743837660269 255.37978712738942C98.55881299890551 251.6871296842309 94.79256777300209 49.64384979622175 104.85743837660269 43.814818180089304C114.92230898020327 37.98578656395686 293.3650377355889 142.49476607825213 293.3200869812818 150.91409706627437Z"
            />
          </g>
          <g>
            <text opacity="1" transform="translate(135.64189430584318, 111.57990949648786)">
              <tspan
                fill={color || 'rgb(168,168,168)'}
                fontSize="54"
                fontFamily="Avenir Next"
                fontWeight="400"
                style={{ whiteSpace: 'pre', textTransform: 'none' }}
                x="0"
                y="54"
              >
                #{face.faceId}
              </tspan>
            </text>
          </g>
        </g>
      </svg>
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
        style={{ color }}
        className="UpdateFaceForm__input xl-bottom xl-top"
      />
      <div className="UpdateFaceForm__button">
        {isLoading ? (
          <Loader size="40px" />
        ) : (
          <button type="submit" className="UpdateFaceForm__button button-blue" disabled={!name}>
            Enregistrer
          </button>
        )}
      </div>
    </form>
  );
}

UpdateFaceForm.defaultProps = {
  className: '',
};
