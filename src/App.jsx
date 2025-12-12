// 日本語コメントのみ使用する
import React, { useCallback, useMemo, useRef, useState } from 'react'
import TodoList from './components/TodoList.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

// タスクのユニークID生成（DB無しなので簡易方式）
const uid = () => Math.random().toString(36).slice(2, 10)

export default function App() {
  // ローカルストレージに保存するキー
  const STORAGE_KEY = 'todo-react-onepage:v1'

  // タスク配列をローカルストレージと同期
  const [todos, setTodos] = useLocalStorage(STORAGE_KEY, [])
  // 入力欄の制御
  const [input, setInput] = useState('')
  // 編集中IDの管理
  const [editingId, setEditingId] = useState(null)
  // フィードバック用の軽量トースト（Core Web Vitalsの干渉を避けるため最小限）
  const [toast, setToast] = useState(null)
  // 入力の参照（Enter追加時に再フォーカス）
  const inputRef = useRef(null)

  // トースト表示（短時間のみ）
  const showToast = useCallback((msg) => {
    setToast(msg)
    // requestIdleCallbackによりメインスレッドの余裕があるときに消す
    const clear = () => setToast(null)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setTimeout(clear, 1200))
    } else {
      setTimeout(clear, 1200)
    }
  }, [])

  // タスク追加
  const addTodo = useCallback(() => {
    const title = input.trim()
    if (!title) return
    const next = [
      { id: uid(), title, completed: false, createdAt: Date.now() },
      ...todos,
    ]
    setTodos(next)
    setInput('')
    // 入力欄へフォーカスを戻す
    inputRef.current?.focus()
    showToast('追加しました')
  }, [input, todos, setTodos, showToast])

  // タスク編集開始
  const startEdit = useCallback((id) => {
    setEditingId(id)
  }, [])

  // タスク編集確定
  const commitEdit = useCallback((id, nextTitle) => {
    const title = nextTitle.trim()
    if (!title) {
      // 空白なら削除扱い
      setTodos((prev) => prev.filter((t) => t.id !== id))
      showToast('削除しました')
    } else {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title } : t))
      )
      showToast('更新しました')
    }
    setEditingId(null)
  }, [setTodos, showToast])

  // 完了トグル
  const toggleComplete = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }, [setTodos])

  // タスク削除
  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    showToast('削除しました')
  }, [setTodos, showToast])

  // タスク並び替え（ドラッグ＆ドロップ／キーボード）
  const reorder = useCallback((fromIndex, toIndex) => {
    setTodos((prev) => {
      const next = prev.slice()
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [setTodos])

  // 全削除（確認付き）
  const clearAll = useCallback(() => {
    const ok = window.confirm('全てのタスクを削除します。よろしいですか？')
    if (!ok) return
    setTodos([])
    showToast('全て削除しました')
  }, [setTodos, showToast])

  // 残タスク数の算出（メモ化）
  const remaining = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  )

  // 使い心地のための小さなヒント（CLSを起こさない上部固定）
  const hint = 'Enterで追加、タスクをクリックで編集、ドラッグで並び替え'

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="brand">Sleek Todo</h1>
        <p className="subtitle">{hint}</p>
      </header>

      <section className="input-row" aria-label="タスクの追加">
        <input
          ref={inputRef}
          className="text-input"
          type="text"
          placeholder="やることを入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTodo()
          }}
          aria-label="新しいタスクを入力"
        />
        <button
          className="btn primary"
          onClick={addTodo}
          aria-label="タスクを追加"
        >
          追加
        </button>
      </section>

      <TodoList
        todos={todos}
        editingId={editingId}
        startEdit={startEdit}
        commitEdit={commitEdit}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        reorder={reorder}
      />

      <footer className="app-footer">
        <div className="status">
          <span className="pill">{remaining} 件の未完了</span>
        </div>
        <button className="btn danger outline" onClick={clearAll}>
          全削除
        </button>
      </footer>

      {/* 軽量トースト（INPに配慮した非ブロッキング） */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}