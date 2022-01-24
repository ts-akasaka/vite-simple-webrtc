import { createContext, FC, ReactNode, useContext, ComponentType, useRef, useState, useReducer, ComponentProps } from 'react';
import { v1 as uuidv1 } from 'uuid';

import MessageDialog from "components/Dialogs/MessageDialog";

const DialogComponents = {
  message: MessageDialog,
};

type HandlerType<T extends { onClose: (...args: any[]) => any, onError?: (reason: any) => void }> = (
  (props: Omit<T, "onClose" | "onError">) => Promise<Parameters<T["onClose"]>>
);

type ContextType = {
  [K in keyof typeof DialogComponents]: HandlerType<ComponentProps<(typeof DialogComponents)[K]>>
};

export const DialogContext = createContext<ContextType | null>(null);
export const useDialogContext = () => {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error("No DialogContext provided.")
  }
  return ctx
};

const handler = <T extends { onClose: (...args: any[]) => any, onError?: (reason: any) => void }>(
  Component: ComponentType<T>,
  shownDialogs: ReactNode[],
  forceUpdate: () => void,
): HandlerType<T> => props => {
  return new Promise<Parameters<T["onClose"]>>((resolve, reject) => {
    const element = <Component
      key={uuidv1()}
      {...(props as any)}
      onClose={(...ret) => {
        const idx = shownDialogs.indexOf(element);
        if (idx >= 0) {
          shownDialogs.splice(idx, 1);
          forceUpdate();
          resolve(ret as Parameters<T["onClose"]>);
        } else {
          reject("Illegal dialog close.")
        }
      }}
      onError={reject}
    />;
    shownDialogs.push(element);
    forceUpdate();
  });
};

type Props = {
  children: ReactNode | ReactNode[],
};

const DialogProvider: FC<Props> = ({ children }) => {
  const showns = useRef<ReactNode[]>([]).current;
  const [, forceUpdate] = useReducer(() => [], []);
  const [ctx] = useState<ContextType>(() => Object.entries(DialogComponents).reduce(
    (prev, [k, v]) => (prev[k] = handler(v as any, showns, forceUpdate), prev),
    {} as any
  ));
  return <DialogContext.Provider value={ctx}>
    {children}
    {showns.map(item => item)}
  </DialogContext.Provider>
};

export default DialogProvider;
