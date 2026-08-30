import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XIcon, SparkleIcon } from "../../lib/icons"
import { useStudioStore, type PinNote } from "../../store/useStudioStore"

const PIN_COLORS = [
  { bg: "#eef2ff", pin: "#6366f1", label: "Indigo" },
  { bg: "#ecfdf5", pin: "#10b981", label: "Emerald" },
  { bg: "#fffbeb", pin: "#f59e0b", label: "Amber" },
  { bg: "#fdf2f8", pin: "#ec4899", label: "Rose" },
  { bg: "#f5f3ff", pin: "#8b5cf6", label: "Purple" },
]

export default function NotesBoard() {
  const { pinnedNotes, addPinnedNote, removePinnedNote } = useStudioStore()

  const [isAdding, setIsAdding] = useState(false)
  const [newText, setNewText] = useState("")
  const [newTag, setNewTag] = useState("Directives")
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newText.trim()) return

    const colorConfig = PIN_COLORS[selectedColorIdx]
    const newNote: PinNote = {
      id: `note_${Date.now()}`,
      text: newText.trim(),
      tag: newTag.trim() || "Note",
      color: colorConfig.bg,
      pin: colorConfig.pin,
      date: "Just now",
    }

    addPinnedNote(newNote)
    setNewText("")
    setIsAdding(false)
  }

  const handleDeleteNote = (id: string) => {
    removePinnedNote(id)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-tertiary">
          {pinnedNotes.length} {pinnedNotes.length === 1 ? "Directive Pinned" : "Directives Pinned"}
        </span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1 rounded-lg bg-primary-pale text-primary text-xs font-bold hover:brightness-105 transition cursor-pointer flex items-center gap-1 shadow-2xs"
        >
          <span>{isAdding ? "Cancel" : "+ Pin New Note"}</span>
        </button>
      </div>

      {/* Inline Add Note Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddNote}
            className="p-3.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-2.5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tag (e.g. Deal, Script, Rule)"
                className="w-36 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
              />

              <div className="flex items-center gap-1.5">
                {PIN_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColorIdx(i)}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      selectedColorIdx === i ? "scale-125 ring-2 ring-primary" : ""
                    }`}
                    style={{ background: c.pin, borderColor: "white" }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Write your personal creator directive or pinned reminder..."
              className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 rounded-lg text-xs text-text-tertiary hover:text-text-primary transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newText.trim()}
                className="px-4 py-1 rounded-lg bg-primary text-white text-xs font-bold hover:brightness-110 disabled:opacity-50 transition cursor-pointer"
              >
                Pin Directive
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <div
        className="clay-inset rounded-2xl p-3 max-h-[290px] overflow-y-auto"
        style={{ background: "var(--bg-secondary)", borderRadius: "var(--r-lg)" }}
      >
        {pinnedNotes.length === 0 ? (
          <div className="text-center py-8 text-xs text-text-tertiary">
            No pinned directives yet. Click "+ Pin New Note" above to add your first directive!
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <AnimatePresence>
              {pinnedNotes.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    delay: i * 0.04,
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                  }}
                  className="relative p-3 rounded-2xl border border-black/5 shadow-2xs group flex flex-col justify-between"
                  style={{
                    background: n.color,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: n.pin }}
                        />
                        {n.tag && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary opacity-75">
                            {n.tag}
                          </span>
                        )}
                      </div>

                      {/* Delete button on hover */}
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-black/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-text-tertiary transition cursor-pointer"
                        title="Unpin Note"
                      >
                        <XIcon size={12} />
                      </button>
                    </div>

                    <p className="text-xs leading-relaxed text-text-primary font-medium">
                      {n.text}
                    </p>
                  </div>

                  {n.date && (
                    <span className="text-[9px] text-text-tertiary font-mono self-end mt-2 opacity-60">
                      {n.date}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

