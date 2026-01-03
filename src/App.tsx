
import { BrowserRouter,  } from 'react-router'
import './App.css'
import { AppRouter } from './route/AppRouter'
import { AuthProvider } from './auth/context/AuthContext'

function App() {


  return (
    <AuthProvider>
     <BrowserRouter>
     <AppRouter />
     </BrowserRouter>
    </AuthProvider>
  )
}

export default App
