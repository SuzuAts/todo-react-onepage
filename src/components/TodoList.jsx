// 日本語コメントのみ使用する
import React, { useRef } from 'react'
import TodoItem from './TodoItem.jsx'

// ドラッグ＆ドロップのためのユーティリティ
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

export default function TodoList({
  todos,
  editingId,
  startEdit,
  commitEdit,
  toggleComplete,
  deleteTodo,
  reorder,
}) {
  const dragState = useRef({ from: null })

  // ドラッグ開始時に元インデックスを記録
  const onDragStart = (index) => {
    dragState.current.from = index
  }

  // ドロップ時に並び替え実行
  const onDrop = (index) => {
    const from = dragState.current.from
    if (from == null) return
    if (from !== index) reorder(from, clamp(index, 0, todos.length - 1))
    dragState.current.from = null
  }

  return (
    <ul className="todo-list">
      {todos.map((t, idx) => (
        <TodoItem
          key={t.id}
          index={idx}
          data={t}
          editing={editingId === t.id}
          onStartEdit={() => startEdit(t.id)}
          onCommit={(title) => commitEdit(t.id, title)}
          onToggle={() => toggleComplete(t.id)}
          onDelete={() => deleteTodo(t.id)}
          onDragStart={() => onDragStart(idx)}
          onDrop={() => onDrop(idx)}
          onMoveUp={() => reorder(idx, clamp(idx - 1, 0, todos.length - 1))}
          onMoveDown={() => reorder(idx, clamp(idx + 1, 0, todos.length - 1))}
        />
      ))}
    </ul>
  )
}