import React from "react"

type PopupProps = {
  message: string
  onClose: () => void
}

const Popup = ({ message, onClose }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <p className="mb-6 text-foreground text-lg leading-8 tracking-wide">{message}</p>
        <button
          onClick={onClose}
          className="w-[100px] mx-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition-colors duration-200"
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default Popup
