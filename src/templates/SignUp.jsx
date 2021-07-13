import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { TextInput, PrimaryButton } from "../components/UIkit";
import { signUp } from "../reducks/users/opeations";
import { push } from "connected-react-router";

const SignUp = () => {
  // onClick時にdispatchするのでuseDispatch()を定数化
  const dispatch = useDispatch();

  // hooksでローカルのstateを管理
  const [username, setUsername] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirmPassword, setConfirmPassword] = useState("");

  // メモ化
  // hooksのuseCallback
  // <TextInput/>のonChange()にsetUsernameと渡してもいいがメモ化を行うことでパフォーマンスが向上する
  const inputUsername = useCallback(
    (event) => {
      setUsername(event.target.value);
    },
    [setUsername]
  );

  const inputEmail = useCallback(
    (event) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );
  const inputPassword = useCallback(
    (event) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );
  const inputConfirmpassword = useCallback(
    (event) => {
      setConfirmPassword(event.target.value);
    },
    [setConfirmPassword]
  );
  // リターン
  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">アカウント登録</h2>
      <div className="module-spacer--medium" />
      <TextInput
        fullWidth={true}
        label={"ユーザー名"}
        multiline={false}
        required={true}
        rows={1}
        value={username}
        type={"text"}
        onChange={inputUsername}
      />
      <TextInput
        fullWidth={true}
        label={"Email"}
        multiline={false}
        required={true}
        rows={1}
        value={email}
        type={"email"}
        onChange={inputEmail}
      />
      <TextInput
        fullWidth={true}
        label={"パスワード"}
        multiline={false}
        required={true}
        rows={1}
        value={password}
        type={"password"}
        onChange={inputPassword}
      />
      <TextInput
        fullWidth={true}
        label={"パスワード( 再確認)"}
        multiline={false}
        required={true}
        rows={1}
        value={confirmPassword}
        type={"password"}
        onChange={inputConfirmpassword}
      />
      <div className="module-spacer--medium" />
      <div className="center">
        <PrimaryButton
          label={"アカウント登録"}
          onClick={() =>
            dispatch(signUp(username, email, password, confirmPassword))
          }
        />
        <div className="module-spacer--medium" />
        <p onClick={() => dispatch(push("/signin"))}>
          既にアカウントをお持ちの方はこちら
        </p>
      </div>
    </div>
  );
};

export default SignUp;
