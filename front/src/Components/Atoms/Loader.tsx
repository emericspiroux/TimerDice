import './Loader.scss';

export default function Loader({ size = '40px', isInline }: { size: string; isInline?: boolean }) {
  const sizeType = size.slice(-2);
  let borderWidth;

  switch (sizeType) {
    case 'px':
      borderWidth = Number(size.slice(size.length - 2)) * 0.5;
      break;
    case '%':
      borderWidth = '5%';
      break;
    default:
      borderWidth = '10px';
      break;
  }

  return (
    <div
      className="Loader"
      style={{ width: size, height: size, borderWidth, display: isInline ? 'inline' : 'block' }}
    />
  );
}

Loader.defaultProps = {
  isInline: false,
};
