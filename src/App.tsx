import { MouseEventHandler, useCallback, useEffect, useRef } from 'react'
import { Button, Card, CardMedia, Container, Grid, Paper, TextField } from '@mui/material';

import IdPanel from "components/Panels/IdPanel";
import { usePeerContext, usePeerStatus } from "components/Providers/PeerProvider";
import { makeStyles } from "makeStyles";

const useStyles = makeStyles()(_theme => ({
  headPaper: {
    padding: "0.2em 0.5em 0.0em 0.5em",
    border: "2px solid",
    borderColor: "gray",
    fontWeight: "bold",
  },
  messagePaper: {
    padding: "0.2em 0.5em 0.0em 0.5em",
    border: "2px solid",
    borderColor: "gray",
  },
  idInput: {
    width: "20rem",
  },
  card: {
    marginTop: "1rem",
    width: "30rem",
    height: "30rem",
    border: "solid 4px grey"
  },
  video: {
    width: "100%",
    height: "100%",
  }
}));

function App() {
  // const [, forceError] = useReducer((_: any, e: Error) => { throw e }, null as never);
  const { classes, cx } = useStyles();
  const peer = usePeerContext();
  const status = usePeerStatus()
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const toRef = useRef<HTMLInputElement>(null);

  useEffect(() => peer.subscribe(() => {
    if (peer.status !== "connected" && videoRef.current?.srcObject) {
      videoRef.current.srcObject = null;
    }
  }));

  const onCall = useCallback<MouseEventHandler>(async ev => {
    try {
      if (!toRef.current?.value || !videoRef.current) { return };
      const to = toRef.current.value;
      const ms = await peer.call(to);
      videoRef.current.srcObject = ms;
    } catch (e) {
      console.log("Call error.", e);
    }
  }, []);

  const onAnswer = useCallback<MouseEventHandler>(async ev => {
    try {
      if (!videoRef.current) { return };
      const ms = await peer.answer();
      videoRef.current.srcObject = ms;
    } catch (e) {
      console.log("Answer error.", e);
    }
  }, []);

  const onDisconnect = useCallback<MouseEventHandler>(async ev => {
    peer.disconnect();
  }, []);

  return (
    <Container className="root">
      <IdPanel />
      {(status === "disconnected") ? (
        <Grid container
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Paper className={classes.headPaper}>?????????</Paper>
          </Grid>
          <Grid item>
            <TextField className={classes.idInput} inputRef={toRef} />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={onCall}>??????</Button>
          </Grid>
        </Grid>
      ) : (status === "calling") ? (
        <Grid container
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Paper className={classes.messagePaper}>
              ????????????????????????...
            </Paper>
          </Grid>
        </Grid>
      ) : (status === "ring") ? (
        <Grid container
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Paper className={classes.messagePaper}>????????????????????????????????????</Paper>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={onAnswer}>??????</Button>
          </Grid>
        </Grid>
      ) : (status === "connected") ? (
        <Grid container
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Paper className={classes.messagePaper}>?????????</Paper>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={onDisconnect}>??????</Button>
          </Grid>
        </Grid>
      ) : null}
      <Card className={classes.card}>
        <CardMedia component="video" className={classes.video} ref={videoRef} autoPlay />
      </Card>
    </Container>
  )
}

export default App
