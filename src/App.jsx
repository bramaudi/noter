import { NoteProvider } from './store/NoteContext'
import { registerSW } from 'virtual:pwa-register'
import { onMount } from 'solid-js';

function App({ Routes }) {
  onMount(() => {
    if (typeof window !== 'undefined') {
      registerSW({
        onOfflineReady() {
          console.log('App ready to use offline');
        }
      })
    }
  })
  return (
    <NoteProvider>
      <Routes />
    </NoteProvider>
  )
}

export default App;
