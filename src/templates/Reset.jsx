import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { TextInput, PrimaryButton } from "../components/UIkit";
import {push} from 'connected-react-router'
import {resetPassword} from '../reducks/users/opeations'

const Reset = () => {
  const dispatch = useDispatch();
  // リセットに必要なのはメールのみ
  const [email, setEmail] = useState("");

  // メモ化

  const inputEmail = useCallback(
    (event) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );


  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">Reset Password</h2>
      <div className="module-spacer--medium" />

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
     

      <div className="module-spacer--medium" />
      <div className="center">
                <PrimaryButton label={"パスワードをリセットする"} onClick={() => dispatch(resetPassword(email))} />
                <div className="module-spacer--small" />
                <div className="module-spacer--medium" />
                <p className="u-text-small"onClick={() => dispatch(push('/signin'))}>ログイン画面に戻る</p>
            </div>
    </div>
  );
};

export default Reset;
