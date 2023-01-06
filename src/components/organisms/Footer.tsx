import React from "react";
import { Typography, Link } from "@material-ui/core";

const Footer = () => {
  return (
    <Typography
      variant="body1"
      color="textSecondary"
      align="center"
      style={{ marginTop: "20px" }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/hirakuuuu">
        hirakuuuu
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Footer;
