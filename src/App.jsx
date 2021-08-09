import { NoteProvider } from './store/NoteContext'

function App({ Routes }) {
  return (
    <NoteProvider>
      <Routes />
    </NoteProvider>
  )
}

export default App;
