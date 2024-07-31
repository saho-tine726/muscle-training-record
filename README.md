# muscle-training-record

## 概要

Next.js14 を使用した、筋トレ記録アプリです。<br>
身体の部位別に記録を登録でき、部位別の一覧を確認することもできます。<br>
ユーザー登録をしてご利用可能です。

## デモサイト

sample.com

## テストアカウント

ユーザー ID:<br/>
aaa@gmail.com<br/>
<br/>
パスワード:<br/>
aaaaaa

## 使用言語・ライブラリ・フレームワーク・ツールなど

<p>
<img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
<img src="https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white">
<img src="https://img.shields.io/badge/Recoil-3578E5.svg?style=for-the-badge&logo=recoil&logoColor=white">
</p>
<table>
  <tr>
    <td>Next.js</td>
    <td>14.2.5</td>
  </tr>
  <tr>
    <td>React</td>
    <td>^18</td>
  </tr>
  <tr>
    <td>TypeScript</td>
    <td>^5</td>
  </tr>
  <tr>
    <td>Tailwind CSS</td>
    <td>^3.4.1</td>
  </tr>
  <tr>
    <td>React Hook Form</td>
    <td>^7.52.1</td>
  </tr>
  <tr>
    <td>Recoil</td>
    <td>^0.7.7</td>
  </tr>
</table>

## ORM

<p>
<img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white">
</p>
<table>
  <tr>
    <td>Prisma</td>
    <td>^5.16.2</td>
  </tr>
</table>

## データベース

<p>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
</p>
<table>
  <tr>
    <td>Supabase</td>
    <td>^2.44.3</td>
  </tr>
</table>

## 仕様

### 全ページ共通

- レスポンシブ対応済
- フォームには「React Hook Form」ライブラリを使用
- Prisma を使用した CRUD 処理
- 以下 ☆ の付くページは、未ログインユーザーがアクセスすると、ログインページに自動で遷移

### ☆ 本日のトレーニング追加(/)

- 種目ごとに ① 重量 ② 回数を記録
- 特定の種目だけしか記録しない場合も可能
- 特定の部位を 2 種目以上記録したい場合は、「新しい種目を追加」ボタンを押してフォームを増やせる
- ログイン済ユーザーがアクセスすると、「TODO を追加」と「TODO 一覧」の選択ボタンを表示
- 何も登録がない場合は「種目を 1 つ以上登録してください」とアラートを表示
- 本日分の登録が既にある場合には、トレーニング記録全一覧(/post)ページに自動で遷移

### ☆ トレーニング記録全一覧(/post)

- 日別ごとに集約された記録が全て見ることができる一覧ページ
- 最新の日付順に表示
- 記録が 1 件もない場合は「データがありません」と表示

### ☆ 各部位ごとの一覧(/post/[bodyPart])

- 日別ごと & 各部位ごとに集約された記録が見ることができる一覧ページ
- URL の[bodyPart]について、①「胸」→「chest」②「背中」→「back」③「脚」→「legs」④「肩」→「shoulders」⑤「腕」→「arms」と部位ごとに動的に変わる（5 部位とも同一の page.tsx を使用）
- グラフは react-chartjs-2(^5.2.0)を使用。負荷量（重量 × 回数）の数値をもとに作成され、最新 30 件分を表示
- 記録が 1 件もない場合は「データがありません」と表示

### 日別記録の詳細(/post/[id])

- 何も登録がない場合は「種目を 1 つ以上登録してください」とアラートを表示

### マイページ(/mypage)

- 登録されている個人情報が、フォームに初期セットされるように設定
- ニックネームも変更できるように設定（初期は「ゲスト」という名前）

### ログイン(/user/login)

- 認証には、Supabase の認証機能を使用（メールアドレス・パスワード）
- ログイン情報が合っていない場合、「無効なログイン認証情報です。」とのエラーメッセージを表示
- ログインすると、本日のトレーニング追加ページ(/)へ自動で遷移

### 新規登録(/user/register)

- 既に登録されているアカウントの場合、「既に登録されているアカウントです。」とのエラーメッセージを表示
- 新規登録するとその情報で自動ログインされ、本日のトレーニング追加ページ(/)へ自動で遷移

## 追加予定の機能

- 一覧ページにページネーションを追加
