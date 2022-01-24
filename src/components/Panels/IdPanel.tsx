import { FC, useCallback } from 'react';
import { Paper, Grid, Button } from '@mui/material';

import { usePeerContext, usePeerStatus } from "components/Providers/PeerProvider";
import { makeStyles } from "makeStyles";

const useStyles = makeStyles()(_theme => ({
  root: {
    marginTop: "0.5em",
    marginBottom: "0.5em",
    fontWeight: "bold",
  },
  paper: {
    padding: "0.2em 0.5em 0.0em 0.5em",
    border: "2px solid",
    borderColor: "gray",
  },
  button: {
  }
}));

type Props = {
};

const IdPanel: FC<Props> = () => {
  const { classes, cx } = useStyles();
  const peer = usePeerContext();
  usePeerStatus();
  const onCopy = useCallback(()=>{
    if (peer.id) {
      navigator.clipboard.writeText(peer.id);
    }
  }, []);
  return (
    <Grid container
      className={cx("IdPanel", classes.root)}
      alignItems="center"
      spacing={1}
    >
      <Grid item>
        <Paper className={classes.paper}>Peer Id</Paper>
      </Grid>
      <Grid item>{
        peer.id ?? "Peerサーバーに接続中・・・"
      }</Grid>
      <Grid item>
        <Button variant="contained" className={classes.button} onClick={onCopy}>コピー</Button>
      </Grid>
    </Grid>
  );
};

export default IdPanel;
