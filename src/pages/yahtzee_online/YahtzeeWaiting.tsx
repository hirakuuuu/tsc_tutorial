import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingDice from "../../components/organisms/LoadingDice";

const YahtzeeWaiting = (props: any) => {
  const socket = props.socket;
  const navigate = useNavigate();

  // 入力した名前
  const { state } = useLocation();

  // ルームに招待される
  useEffect(() => {
    socket.on(
      "JOIN_ROOM",
      (data: { roomId: string; player1: string; player2: string }) => {
        const joinRoom = (clientId: string) => {
          socket.emit("ACCEPT_JOIN_ROOM", {
            roomId: data.roomId,
            clientId,
            name: state.name,
          });
        };
        if (socket.id === data.player1) {
          joinRoom(data.player1);
        }
        if (socket.id === data.player2) {
          setTimeout(() => joinRoom(data.player2), 1000);
        }
      }
    );

    // これをしないと2回追加する
    return () => {
      socket.off("JOIN_ROOM");
    };
  }, []);

  // ルームに入れた
  useEffect(() => {
    socket.on(
      "YAHTZEE_LOGIN",
      (data: {
        roomId: string;
        player1: string;
        player2: string;
        firstPlayer: string;
      }) => {
        window.alert("入室成功！対戦に移ります");
        // console.log(data.player1, data.player2);
        navigate("/yahtzee_online/main", {
          state: {
            roomId: data.roomId,
            player1: data.player1,
            player2: data.player2,
            firstPlayer: data.firstPlayer,
          },
        });
      }
    );

    // これをしないと2回追加する
    return () => {
      socket.off("YAHTZEE_LOGIN");
    };
  }, []);

  return (
    <div>
      <LoadingDice />
      <div style={{ textAlign: "center", fontSize: "2rem", margin: "50px" }}>
        matching...
      </div>
    </div>
  );
};

export default YahtzeeWaiting;
