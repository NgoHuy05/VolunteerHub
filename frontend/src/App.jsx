import { RouterProvider } from "react-router-dom"
import { routers } from "./router"
import { Toaster } from "react-hot-toast";  

function App() {


  return (
    <>
    <div>
      <RouterProvider router={routers} />
      <Toaster position="top-right" reverseOrder={false} />
</div>
    </>
  )
}

export default App
