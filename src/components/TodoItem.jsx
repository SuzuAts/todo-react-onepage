// 日本語コメントのみ使用する
import React, { useEffect, useRef, useState } from 'react'

export default function TodoItem({
  index,
  data,
  editing,
  onStartEdit,
  onCommit,
  onToggle,
  onDelete,
  onDragStart,
  onDrop,
  onMoveUp,
  onMoveDown,
}) {
  // 編集用のローカルステート
  const [draft, setDraft] = useState(data.title)
  const editRef = useRef(null)
  const liRef = useRef(null)

  // 編集開始時に入力へフォーカス
  useEffect(() => {
    if (editing) {
      setDraft(data.title)
      editRef.current?.focus()
      // アニメーション用のクラス付与
      liRef.current?.classList.add('editing')
    } else {
      liRef.current?.classList.remove('editing')
    }
  }, [editing, data.title])

  // Enterで編集確定、Escでキャンセル
  const onKeyDownEdit = (e) => {
    if (e.key === 'Enter') onCommit(draft)
    if (e.key === 'Escape') onCommit(data.title) // 元に戻す
  }

  return (
    <li
      ref={liRef}
      className={`todo-item ${data.completed ? 'done' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <button
        className="drag-handle"
        aria-label={`タスクを並び替え: ${data.title}`}
        title="ドラッグで並び替え"
      >
        ☰
      </button>

      <button
        className="check"
        onClick={onToggle}
        aria-pressed={data.completed}
        aria-label="完了を切り替え"
        title="完了を切り替え"
      >
        {data.completed ? '✔' : '○'}
      </button>

      {!editing ? (
        <button
          className="title"
          onClick={onStartEdit}
          title="クリックして編集"
        >
          {data.title}
        </button>
      ) : (
        <input
          ref={editRef}
          className="edit-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDownEdit}
          onBlur={() => onCommit(draft)}
          aria-label="タスクを編集"
        />
      )}

      <div className="actions">
        <button
          className="icon-btn"
          onClick={onMoveUp}
          aria-label="上へ移動"
          title="上へ移動"
        >
          ↑
        </button>
        <button
          className="icon-btn"
          onClick={onMoveDown}
          aria-label="下へ移動"
          title="下へ移動"
        >
          ↓
        </button>
        <button
          className="icon-btn danger"
          onClick={onDelete}
          aria-label="削除"
          title="削除"
        >
          ✕
        </button>
      </div>
    </li>
  )
}