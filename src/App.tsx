import { JSXElement, onCleanup } from "solid-js"
import { NoteProvider } from "@context/note"
import { ScrollProvider } from "@context/scroll"
import { getLocalNotes } from "@models/notes";
import ReloadPrompt from "@components/ReloadPrompt";

function App({ Routes }: { Routes: () => JSXElement }) {
  /**
	 * Shift focus using arrow keys
	 * @param {KeyboardEvent} e 
	 */
	const handleShiftFocus = (e: KeyboardEvent) => {
    const target = e.target as HTMLAnchorElement
    const prev = target.previousElementSibling as HTMLAnchorElement
    const next = target.nextElementSibling as HTMLAnchorElement
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      prev?.focus()
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next?.focus()
    }
  }

  onCleanup(() => {
		window.removeEventListener('keydown', handleShiftFocus)
  })

  return (
    <>
      <ReloadPrompt />
      <NoteProvider initial={getLocalNotes(true)}>
        <ScrollProvider>
          <Routes />
        </ScrollProvider>
      </NoteProvider>
    </>
  )
}

export default App;
