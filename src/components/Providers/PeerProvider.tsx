import Peer, { MediaConnection } from 'peerjs';
import { createContext, FC, ReactNode, useContext, useEffect, useReducer, useState } from 'react';

const PEER_OPTIONS = {};

type PeerStatusCallback = ()=>void;

class PeerContextValue {
  private peer: Peer;
  public conn: MediaConnection | null = null;
  public id: string | null = null;
  private callbacks: PeerStatusCallback[] = [];
  status: "initial" | "disconnected" | "calling" | "ring" | "connected" | "error" = "initial";
  constructor() {
    const peer = new Peer(PEER_OPTIONS);
    const onOpen = ()=>{
      peer.off("open", onOpen);
      peer.off("error", onError);
      this.id = peer.id;
      this.status = "disconnected",
      this.notify();
    };
    const onError = (e: any)=>{
      peer.off("open", onOpen);
      peer.off("error", onError);
      this.status = "error";
      this.notify();
    }
    peer.on("open", onOpen);
    peer.on("error", onError);
    peer.on("call", this.onRing);

    this.peer = peer;
  }
  subscribe = (fn: PeerStatusCallback)=>{
    const cbs = this.callbacks;
    cbs.push(fn);
    return () => { cbs.splice(cbs.indexOf(fn), 1) }; // 登録解除関数を返す
  }
  unsubcribe = (fn: PeerStatusCallback) => {
    const cbs = this.callbacks;
    cbs.splice(cbs.indexOf(fn), cbs.includes(fn) ? 1 : 0);
  }
  private notify = () => {
    this.callbacks.forEach(cb=>cb());
  }
  private onRing = (conn: MediaConnection) => {
    if (this.status !== "disconnected") {
      conn.close();
    }
    this.conn = conn;
    this.status = "ring";
    this.notify();
  }
  call = async (id: string): Promise<MediaStream> => {
    try {
      if (this.status !== "disconnected" || !!this.conn) {
        throw new Error("Illegal status for call")
      }
      this.status = "calling";
      this.notify();
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const conn = this.peer.call(id, ms);
      return await this.getConnStream(conn);
    } catch (e) {
      throw e;
    }
  }
  answer = async (): Promise<MediaStream> => {
    try {
      if (this.status !== "ring" || !this.conn) {
        throw new Error("Illegal status for answer")
      }
      const conn = this.conn;
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      conn.answer(ms);
      return await this.getConnStream(conn);
    } catch (e) {
      throw e;
    }
  }
  disconnect = () => {
    if ((this.status !== "connected" && this.status !== "ring") || !this.conn) {
      throw new Error("Illegal status to disconnect")
    }
    this.conn.close();
  }
  private getConnStream = async (conn: MediaConnection) => {
    try {
      const stream = await new Promise<MediaStream>((resolve, reject) => {
        const onClose = () => {
          clean();
          this.conn = null;
          this.status = "disconnected";
          this.notify();
        };
        const onError = (e: any) => {
          clean();
          reject(e);
        };
        const onStream = (ms: MediaStream) => {
          clean();
          this.conn = conn;
          this.status = "connected";
          this.notify();
          resolve(ms)
        };
        const clean = ()=>{
          conn.off("close", onClose);
          conn.off("error", onError);
          conn.off("stream", onStream);
        };
        conn.on("close", onClose);
        conn.on("error", onError);
        conn.on("stream", onStream);
      });
      // IMPROVMEME: 相手側の切断に対して反応がない。
      // API Referenceによれば、反応するはずだが・・・
      conn.on("close", this.onStreamClose);
      return stream;
    } catch (e) {
      throw e;
    }
  }
  private onStreamClose = () => {
    this.conn?.off("close", this.onStreamClose);
    this.conn = null;
    this.status = "disconnected";
    this.notify();
  }
};

export const PeerContext = createContext<PeerContextValue | null>(null);
export const usePeerContext = () => {
  const ctx = useContext(PeerContext);
  if (!ctx) {
    throw new Error("No PeerContext provided.");
  }
  return ctx;
}

export const usePeerStatus = ()=>{
  const [, forceUpdate] = useReducer(()=>[], []);
  const ctx = usePeerContext();
  useEffect(()=>ctx.subscribe(forceUpdate));
  return ctx.status;
};

type Props = {
  children: ReactNode | ReactNode[],
};

const PeerProvider: FC<Props> = ({ children }) => {
  const [ctx] = useState(()=> new PeerContextValue());
  return <PeerContext.Provider value={ctx}>
    {children}
  </PeerContext.Provider>
};

export default PeerProvider;
