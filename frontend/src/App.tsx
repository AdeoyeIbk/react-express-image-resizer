
import './App.css'
import Header from './components/Header'
import ImageResizer from './components/ImageResizer'
import Footer from './components/Footer'

function App() {

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <ImageResizer />
      <Footer />
    </div>
  )
}

export default App
