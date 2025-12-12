// 日本語コメントのみ使用する
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // 開発時にダブルレンダリングされる StrictMode は一旦外す（INPの干渉を避ける）
  <App />
)