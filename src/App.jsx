import { AuthProvider } from "./context"
import { AppRouter } from "./routes/AppRouter"

function App() {

  return (
    <AuthProvider>
      <AppRouter/>
    </AuthProvider>
  )
}

export default App
