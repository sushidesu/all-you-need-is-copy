import React, { useState, useCallback } from "react"
import ReactDOM from "react-dom/client"

const Options = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button
        onClick={useCallback(() => {
          setCount((prev) => prev + 1)
        }, [])}
      >
        {count}
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
