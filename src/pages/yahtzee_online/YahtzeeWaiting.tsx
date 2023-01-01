import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoadingSpiner from "../../components/organisms/RoadingSpiner";

import { PlayerState } from "../../types/PlayerState";

const YahtzeeWaiting = (props: any) => {
  const socket = props.socket;
  const navigate = useNavigate();

  // 名前
  const { state } = useLocation();
  console.log(state);
  const name = state.name;
  console.log(name);

  // ルームに招待される
  socket.on(
    "JOIN_ROOM",
    (data: { roomId: string; player1: string; player2: string }) => {
      const joinRoom = (clientId: string) => {
        socket.emit("ACCEPT_JOIN_ROOM", {
          roomId: data.roomId,
          clientId: clientId,
          name: name,
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

  // ルームに入れた
  socket.on(
    "YAHTZEE_LOGIN",
    (data: {
      roomId: string;
      player1: string;
      player2: string;
      firstPlayer: string;
    }) => {
      window.alert("入室成功！");
      console.log(data.player1, data.player2);
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

  return (
    <div>
      <RoadingSpiner />
    </div>
  );
};

export default YahtzeeWaiting;
