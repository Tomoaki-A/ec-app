import React from 'react'

import TextField from "@material-ui/core/TextField"

const TextInput = (props) => {
  return(
    <TextField
        // falseだとTextFieldのwidth = テキストのwidthになる
        fullWidth= {props.fullWidth}
        label = {props.label}
        // dense = 密集
        margin='dense'
        // 複数行の入力を許可するかどうか
        multiline = {props.multiline}
        // 必須項目かどうか
        required={props.required}
        // maltilineを許可した際に初めから何行表示するか
        rows={props.rows}
        value={props.value}
        // textとかpasswordとかemailとか指定できる
        type ={props.type}
        onChange={props.onChange}
    />
  )
}

export default TextInput