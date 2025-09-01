
import './App.css'
import Header from './components/Header'
import ImageResizer from './components/ImageResizer'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react";

function App() {

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <ImageResizer />
      <Footer />
       <Analytics />
    </div>
  )
}

export default App
