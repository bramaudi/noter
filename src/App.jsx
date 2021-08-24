import { NoteProvider } from './store/NoteContext'
import { onCleanup } from 'solid-js';
import ReloadPrompt from './components/ReloadPrompt';

function App({ Routes }) {
  /**
	 * Shift focus using arrow keys
	 * @param {KeyboardEvent} e 
	 */
	const handleShiftFocus = (e) => {
    const prev = e.target.previousElementSibling
    const next = e.target.nextElementSibling
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
      <NoteProvider>
        <Routes />
      </NoteProvider>
    </>
  )
}

export default App;
