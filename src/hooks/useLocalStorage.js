// 日本語コメントのみ使用する
import { useEffect, useState } from 'react'

// ローカルストレージとReactステートを同期させるフック
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    // メインスレッド混雑を避けるためアイドル時に保存
    const save = () => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // 保存失敗は無視（容量制限など）
      }
    }
    if ('requestIdleCallback' in window) {
      requestIdleCallback(save)
    } else {
      setTimeout(save, 0)
    }
  }, [key, value])

  return [value, setValue]
}