# 筋トレ記録アプリ

## 概要
<img src="https://github.com/user-attachments/assets/3b9944ed-3cce-4c36-abe5-76c54f3df1fd">
Next.js14 を使用した、筋トレ記録アプリです。<br>
身体の部位別に筋トレ結果を記録することが可能で、部位別の記録一覧をグラフとともに確認することもできます。<br>
ユーザー登録をしてからご利用可能です。

## 制作動機
趣味でキックボクシングジムに通っているのですが、最近キックボクシングよりも、ジムに置いてある筋トレマシンで身体を鍛えることに夢中になっています。<br>
各マシンの重量と回数の増加を数字で実感できた方がやる気が出るということが最近分かり、さらにグラフで記録の増減を分かりやすく確認できる筋トレ記録アプリを作ってみたい、と思ったことが制作動機です。

## デモサイト

https://muscle-training-record.vercel.app/

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
## ER 図  

<img src="https://private-user-images.githubusercontent.com/169561547/354113421-6c5d24dc-2d57-41dd-857f-a54eaf845934.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjQ0MDU1MDMsIm5iZiI6MTcyNDQwNTIwMywicGF0aCI6Ii8xNjk1NjE1NDcvMzU0MTEzNDIxLTZjNWQyNGRjLTJkNTctNDFkZC04NTdmLWE1NGVhZjg0NTkzNC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODIzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgyM1QwOTI2NDNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lZDFmZDMwMTczMjVjNTlhYTdjNGE1MjUyMzJjNTQ2MmVjYWExZWEzMmRjODQzMDI4NmE1NWUzYjJhYzIwNDUwJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.OMy9Cf1RyG-qi4WlasdINkR_jPaYmPtRgvhodGmFEcs">

## 仕様

### 全ページ共通

- レスポンシブ対応済
- フォームには「React Hook Form」ライブラリを使用
- Prisma を使用した CRUD 処理
- 以下 ★ の付くページは、未ログインユーザーがアクセスすると、ログインページに自動で遷移

### ★ 本日のトレーニング追加(/)

<img src="https://github.com/user-attachments/assets/8a256c58-e9e2-4747-ad32-c5bd6922f760">

- 種目ごとに ① 重量 ② 回数を記録
- 特定の種目だけしか記録しない場合も可能
- 特定の部位を 2 種目以上記録したい場合は、「新しい種目を追加」ボタンを押してフォームを増やせる
- 何も登録がない場合は「種目を 1 つ以上登録してください」とアラートを表示
- 本日分の登録が既にある場合には、トレーニング記録全一覧(/post)ページに自動で遷移

### ★ トレーニング記録全一覧(/post)

<img src="https://github.com/user-attachments/assets/6c843c6d-3b1b-495d-8bb0-a57dc070ef07">

- 日別ごとに集約された記録を全て見ることができる一覧ページ
- 最新の日付順に表示
- 記録が 1 件もない場合は「データがありません」と表示

### ★ 各部位ごとの一覧(/post/[bodyPart])

<img src="https://github.com/user-attachments/assets/a7dd2d23-732f-4100-9883-cf3eebc19804">

- 日別ごと & 各部位ごとに集約された記録が見ることができる一覧ページ
- URL の[bodyPart]について、①「胸」→「chest」②「背中」→「back」③「脚」→「legs」④「肩」→「shoulders」⑤「腕」→「arms」と部位ごとに動的に変わる（5 部位とも同一の page.tsx を使用）
- グラフは react-chartjs-2(^5.2.0)を使用。負荷量（重量 × 回数）の数値をもとに作成され、最新 30 件分を表示
- 記録が 1 件もない場合は「データがありません」と表示

### ★ 日別記録の詳細(/post/[id])

<img src="https://github.com/user-attachments/assets/2d18a131-d578-4474-9794-b2e232248258">

- 既に記録されているデータが、フォームに初期セットされるように設定
- 種目ごとに削除する機能を設定
- 表示中の日付のデータを丸ごと削除する機能を設定
- 特定の部位を 2 種目以上記録したい場合は、「新しい種目を追加」ボタンを押してフォームを増やせる
- 何も登録がない場合は「種目を 1 つ以上登録してください」とアラートを表示
- 更新したら、トレーニング記録全一覧(/post)ページに自動で遷移

### ★ マイページ(/mypage)

<img src="https://github.com/user-attachments/assets/ea2742f8-228d-41d8-adf2-c8fadba76e9f">

- 登録されている個人情報が、フォームに初期セットされるように設定
- ニックネームも変更できるように設定（初期は「ゲスト」という名前）

### ログイン(/user/login)

<img src="https://github.com/user-attachments/assets/f912b6a1-d97e-4e0e-abf6-9aa1bf7897bb">

- 認証には、Supabase の認証機能を使用（メールアドレス・パスワード）
- ログイン情報が合っていない場合、「無効なログイン認証情報です。」とのエラーメッセージを表示
- ログインすると、本日のトレーニング追加ページ(/)へ自動で遷移

### 新規登録(/user/register)

<img src="https://github.com/user-attachments/assets/84ad87a9-4f4b-4b92-aad4-a8af80125c6f">

- 既に登録されているアカウントの場合、「既に登録されているアカウントです。」とのエラーメッセージを表示
- 新規登録するとその情報で自動ログインされ、本日のトレーニング追加ページ(/)へ自動で遷移

## 今後追加予定の機能

- 一覧ページにページネーションを追加
- ユーザーアイコンを追加（マイページで画像の編集可能）
