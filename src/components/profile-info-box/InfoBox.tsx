import './Info-box.css';

interface InfoBoxProps {
  className?: string;
  spanText: string;
  infoText?: string;
}

export const InfoBox = ({ className, spanText, infoText }: InfoBoxProps) => (
  <>
    <div className={`${className ? className : ''} info-box`}>
      <span>{spanText}</span>
      {infoText}
    </div>
  </>
);
