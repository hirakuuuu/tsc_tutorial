import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
} from "@material-ui/core";

// --- Style --- //
const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  /**
   * Max Card with for demo
   * same values used in Material-Ui Card Demos
   */
  card: {
    maxWidth: 250,
  },

  /**
   * Applied to Orginal Card demo
   * Same vale used in Material-ui Card Demos
   */
  media: {
    height: 140,
  },

  /**
   * Demo stlying to inclrease text visibility
   * May verry on implementation
   */
  fiCardContent: {
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,.24)",
  },
  fiCardContentTextSecondary: {
    color: "rgba(255,255,255,0.78)",
  },
});

type ImageProps = {
  imagePath: string;
  to: string;
  // 説明
  title: string;
  detail: string;
};

const CardButton = (props: ImageProps) => {
  const classes = useStyles();
  return (
    <Button component={Link} to={props.to}>
      <Box my={4}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={props.imagePath}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="h3">
                {props.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {props.detail}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Button>
  );
};

export default CardButton;
