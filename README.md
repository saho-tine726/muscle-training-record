# muscle-training-record

## 概要

Next.js14 を使用した筋トレ記録アプリです。各ユーザーごとにご利用可能です。

## デモサイト URL

## ログインテストアカウント

### テストアカウント ①

<b>ユーザー ID:</b><br/>
aaa@gmail.com<br/>
<br/>
<b>パスワード:</b><br/>
aaaaaa

## 使用言語・ライブラリ・フレームワーク・ツールなど

<p>
<img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
<img src="https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white">
</p>
<table>
  <tr>
    <td>Next.js</td>
    <td>(14.2.4)</td>
  </tr>
  <tr>
    <td>React</td>
    <td>(^18)</td>
  </tr>
  <tr>
    <td>TypeScript</td>
    <td>(^5)</td>
  </tr>
  <tr>
    <td>Tailwind CSS</td>
    <td>(^3.4.1)</td>
  </tr>
  <tr>
    <td>React Hook Form</td>
    <td>(^7.52.1)</td>
  </tr>
</table>

## ORM

<p>
<img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white">
</p>
<table>
  <tr>
    <td>Prisma</td>
    <td>(^5.16.2)</td>
  </tr>
</table>

## データベース

<p>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
</p>
<table>
  <tr>
    <td>Supabase</td>
    <td>(^2.44.3)</td>
  </tr>
</table>

## 各ページの仕様

### 全ページ共通

- フォームには「React Hook Form」ライブラリを使用
- Prisma を使用した CRUD 処理

### トップ(/)

- 未ログインユーザーがアクセスすると、ログインページに自動で遷移
- ログイン済ユーザーがアクセスすると、「TODO を追加」と「TODO 一覧」の選択ボタンを表示

### ログイン(/user/login)

- 認証には、Supabase の認証機能を使用（メールアドレス・パスワード）
- ログイン情報が合っていない場合、「無効なログイン認証情報です。」とのエラーメッセージを表示
- ログインすると、トップページへ自動で遷移

### 新規登録(/user/register)

- 既に登録されているアカウントの場合、「既に登録されているアカウントです。」とのエラーメッセージを表示
- 新規登録するとその情報で自動ログインされ、トップページへ自動で遷移

### todo 一覧(/post)

- 未ログインユーザーがアクセスすると、ログインページに自動で遷移
- Todo が一件もない場合、「TODO がありません」とのメッセージを表示

### todo 追加(/post/add)

- 未ログインユーザーがアクセスすると、ログインページに自動で遷移
- todo を追加すると、todo 一覧ページへ自動で遷移

### todo 詳細(/post/[uuid])

- 未ログインユーザーがアクセスすると、ログインページに自動で遷移
- todo の削除・編集機能を搭載（編集は編集ページへ遷移）

### todo 編集(/post/[uuid]/edit)

- 未ログインユーザーがアクセスすると、ログインページに自動で遷移
- 編集したいデータがデフォルトでセットされるように設定

### ユーザーページ(/mypage)

- 未ログインユーザーがアクセスすると、ログインページに自動で遷移
- 編集したいデータがデフォルトでセットされるように設定
- ニックネームも変更できるように設定（デフォルトでは「ゲスト」という名前）
