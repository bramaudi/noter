import { JSXElement } from 'solid-js'
import { NoteProvider } from '@context/note'
import { onCleanup } from 'solid-js';
import ReloadPrompt from './components/ReloadPrompt';
import { getLocalNotes } from '@models/notes';

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
        <Routes />
      </NoteProvider>
    </>
  )
}

export default App;
