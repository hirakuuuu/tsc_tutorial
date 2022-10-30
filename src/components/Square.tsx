type Props = {
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Square: React.FC<Props> = ({ value, onClick }) => {
  // stateの型も指定できる
  // const [value, setValue] = useState<string>(undefined);

  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;
