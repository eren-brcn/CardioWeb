import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard' // 1. Import it
import './App.css'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, backgroundColor: '#131313', color: 'white' }}>
          <Dashboard /> {/* 2. Call it here */}
        </main>
      </div>
    </div>
  )
}

export default App