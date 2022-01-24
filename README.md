# WebRTCのサンプル

## これは何？
WebRTCを使って、ビデオ通話を行うサンプル。

## 概要
- PC上で、ブラウザを利用して、ビデオ通話を行う。
- WebRTCのライブラリとしてPeerJSを使用する。
  - Broker(Peer)/STUN/TRUNサーバーはデフォルトの無料サーバーを利用する。
- ブラウザを立ち上げて該当画面を開くと、自分自身のPeer IDが表示される。
  - PeerIDは、Peerサーバーに接続して取得したものを表示する。
- 相手のPeer IDを指定して「呼出」ボタンを押すと、WebRTC通信を開始する。
  - 接続先となるブラウザーの画面上には、「応答」ボタンを表示する。
  - 「応答」 すると、ビデオ通話を開始する。
- 通話を開始すると、「切断」ボタンを表示する。
  - 「切断」すると、ビデオ通話を終了する。

## 技術方針
- PeerJSを使用し、サーバーもPeerJSデフォルトのものを使用する。
- Vite + React + Typescriptで構成する。
- 映像・音声のみ送受信し、１つの接続のみ対応する。
- PeerオブジェクトはProvider上で保持する。
- 画面上の映像の表示・音声はVideo要素による。
- 規模が小さく、ステートストアを利用する意味は薄いため、使用しない。

## ディレクトリ構成
- src
  - components
    - Providers: Reactコンテキストに情報を提供するプロバイダ
      - DialogProvider.tsx: ダイアログを提供する（現状未使用）
      - PeerProvider.tsx: PeerJSをラップしたクラスのインスタンスを提供する
    - Panels: 表示用の矩形
    - Dialogs: ダイアログ
    - Boundaries: エラーバウンダリ
  - App.tsx
  - main.tsx
  - makeStyles.ts: Material-UI(tss-react)の設定
  - theme.ts: Material-UIの設定
- test: テスト用（未使用）
- dist: yarn buildでの生成結果を格納する。

## 依存ライブラリ
- PeerJS: WebRTCをラップする。デフォルトのサーバー（ブローカー、STUN等）を持つ。
- React: 仮想DOM。
- Material-UI (v5): 画面のベースライブラリ。現時点最新のV5の適用を行っている。
- Emotion: MUI V5で推薦されているCSS-in-JS。TSの恩恵を受けるため、オブジェクトスタイルを中心とする。
- uuid: React Keyの生成等に使用。

## テスト
自動化テストは未実装

## デモページ

[GitHub Pages](https://ts-akasaka.github.io/vite-simple-webrtc/)

## ライセンス
MIT
