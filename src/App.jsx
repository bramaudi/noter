import { NoteProvider } from './store/NoteContext'
import { registerSW } from 'virtual:pwa-register'
import { onMount, onCleanup } from 'solid-js';

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

  onMount(() => {
		window.addEventListener('keydown', handleShiftFocus)
  
    if (typeof window !== 'undefined') {
      registerSW({
        onOfflineReady() {
          console.log('App ready to use offline');
        }
      })
    }
  })
  onCleanup(() => {
		window.removeEventListener('keydown', handleShiftFocus)
  })

  return (
    <NoteProvider>
      <Routes />
    </NoteProvider>
  )
}

export default App;
