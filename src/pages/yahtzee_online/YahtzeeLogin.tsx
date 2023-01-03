import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { NameInputArea } from "../../components/organisms/NameInputArea";

type ClientContent = {
  readonly clientId: string;
  readonly name: string;
};

const YahtzeeLogin = (props: any) => {
  const socket = props.socket;
  // 名前
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // 名前エリアの文字が変更されたときの処理
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  // 名前が登録されたときの処理
  const onClickJoin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const client: ClientContent = {
      clientId: socket.id,
      name: name,
    };
    socket.emit("WAITING_LOGIN", client);
    // console.log(name);
    navigate("/yahtzee_online/waiting", { state: { name: name } });
  };

  return (
    <>
      <NameInputArea
        onChange={onChangeName}
        onClick={onClickJoin}
        value={name}
      />
    </>
  );
};

export default YahtzeeLogin;
