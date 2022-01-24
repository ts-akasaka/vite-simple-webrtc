import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import SuccessIcon from '@mui/icons-material/Check';

import { makeStyles } from "makeStyles";

const nameInClasses = (name: keyof ReturnType<typeof useStyles>["classes"]) => name;
const iconTypes = {
  error: {
    icon: ErrorIcon,
    iconStyle: nameInClasses("errorIcon"),
  },
  warning: {
    icon: WarningIcon,
    iconStyle: nameInClasses("warningIcon"),
  },
  info: {
    icon: InfoIcon,
    iconStyle: nameInClasses("infoIcon"),
  },
  success: {
    icon: SuccessIcon,
    iconStyle: nameInClasses("successIcon"),
  },
};

const useStyles = makeStyles()(theme => ({
  root: {
  },
  content: {
    padding: "1.5rem 1.5rem 0rem 1.5rem",
    minHeight: "6rem",
    display: "flex",
    alignItems: "center",
  },
  actions: {
    padding: "0.5rem 1.5rem 1rem 1.5rem",
    justifyContent: "center",
    "& > .MuiButton-root": {
      minWidth: "8rem",
    },
  },
  icon: {
    flex: "0 0 auto",
    width: "3rem",
    height: "3rem",
  },
  message: {
    flex: "1 1",
    fontSize: "1rem",
    paddingLeft: "1.5rem",
    whiteSpace: "pre-wrap",
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  infoIcon: {
    color: theme.palette.info.main,
  },
  successIcon: {
    color: theme.palette.success.main,
  },
}));

type Props = {
  iconType?: keyof typeof iconTypes,
  message: ReactNode,
  okButtonText?: ReactNode,
  onClose: () => void,
};

const MessageDialog: FC<Props> = ({ iconType, message, onClose, okButtonText }) => {
  const { classes, cx } = useStyles();
  const { icon: Icon, iconStyle } = iconTypes[iconType ?? "info"];
  return (
    <Dialog
      className={cx(
        "MessageDialog",
        classes.root,
      )}
      open
      maxWidth="sm"
      fullWidth
      onClose={undefined} // Not close by ESC or clicking backdrop.
    >
      <DialogContent className={classes.content}>
        <Icon className={cx(classes.icon, classes[iconStyle])} />
        <Typography className={cx(classes.message)} >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          ref={elem => elem?.focus()}
          variant="outlined"
          onClick={onClose}
        >
          {okButtonText ?? "OK"}
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default MessageDialog;
