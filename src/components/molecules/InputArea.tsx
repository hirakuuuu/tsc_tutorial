import { TextField } from "@material-ui/core";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const InputArea = (props: Props) => {
  const { value, onChange, placeholder } = props;
  return (
    <div>
      <TextField
        id="outlined-basic"
        label={placeholder}
        variant="outlined"
        // placeholder=
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
