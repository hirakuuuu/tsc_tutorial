import { InputArea } from "../molecules/InputArea";

type Props = {
  value: string; // インプットに表示されているテキスト
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export const NameInputArea = (props: Props) => {
  const { value, onChange } = props;
  return (
    <InputArea
      value={value}
      onChange={onChange}
      placeholder="名前を入力してください"
    />
  );
};
