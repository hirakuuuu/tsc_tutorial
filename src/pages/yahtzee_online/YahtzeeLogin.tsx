import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card } from "@material-ui/core";
import WifiIcon from "@material-ui/icons/Wifi";
import GroupIcon from "@material-ui/icons/Group";

import BigIconButton from "../../components/molecules/BigIconButton";

import { NameInputArea } from "../../components/organisms/NameInputArea";

import "../../style/yahtzee_online/Login.css";

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
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "90vh" }}
    >
      <Card>
        <div className="yahtzee-login-form">
          <NameInputArea
            onChange={onChangeName}
            onClick={onClickJoin}
            value={name}
          />
        </div>
        <div className="yahtzee-login-form">
          <BigIconButton
            value={name}
            onClick={onClickJoin}
            buttonText={"ランダムマッチ"}
            icon={<WifiIcon style={{ fontSize: "4rem" }} />}
          />
          <BigIconButton
            value={""}
            onClick={onClickJoin}
            buttonText={"カスタムマッチ"}
            icon={<GroupIcon style={{ fontSize: "4rem" }} />}
          />
        </div>
      </Card>
    </Grid>
    // <div className="yahtzee-login-wrapper">

    // </div>
  );
};

export default YahtzeeLogin;
