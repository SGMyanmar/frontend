import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyForm from './Form'
import Nav from './Nav'
import Footer from './Footer'
import Home from './Home'
import Success from './Success'
import Track from './Track'

function App() {

  return (
    <>
    <Nav></Nav>
    <div className="p-8 md:px-20">
      <BrowserRouter>
        <Routes>
          <Route path='/form' element={<>
            <MyForm></MyForm>
          </>}>
          </Route>

          <Route path='/' element={<>
            <Home></Home>
          </>}>
          </Route>

          <Route path='/track' element={<>
            <Track></Track>
          </>}>
          </Route>

          <Route path='/success' element={<>
            <Success></Success>
          </>}>
          </Route>
        </Routes>
      </BrowserRouter>
      </div>
      <Footer></Footer>
    </>
  )
}

export default App
