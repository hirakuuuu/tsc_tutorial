type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonText: string;
};

export const InputArea = (props: Props) => {
  const { value, onChange, placeholder, onClick, buttonText } = props;
  return (
    <div style={{ textAlign: "center", justifyContent: "center" }}>
      <input placeholder={placeholder} value={value} onChange={onChange} />
      <button onClick={onClick} disabled={!value}>
        {buttonText}
      </button>
    </div>
  );
};
