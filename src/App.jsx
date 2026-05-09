import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LayOut from './Components/LayOut/LayOut';
import Home from './Components/Home/Home';
import Categories from './Components/Categories/Categories';
import Products from './Components/Products/Products';
import Brands from './Components/Brands/Brands';
import Cart from './Components/Cart/Cart';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import NotFound from './Components/NotFound/NotFound';
import TockenContextProvider, { TockenContext } from './Context/Token';
import { useContext, useEffect } from 'react';
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes';
import AdminRoute from './ProtectedRoutes/AdminRoute';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Details from './Components/Details/Details';
import Checkout from './Components/Checkout/Checkout';
import PaymentFrame from './Components/Checkout/PaymentFrame';
import Allorders from './Components/Allorders/Allorders';
import AdminPanel from './Components/Admin/AdminPanel';


const queryClient = new QueryClient();



function App() {

let {setToken} = useContext(TockenContext)

  const routes = createBrowserRouter([
    {path :"/", element: <LayOut/>, children :[
      {path :"home", element: <ProtectedRoutes> <Home/></ProtectedRoutes>},
      {path :"Products", element: <ProtectedRoutes><Products/> </ProtectedRoutes>},
      {path :"categories", element: <ProtectedRoutes><Categories/></ProtectedRoutes> },
      {path :"brands", element: <ProtectedRoutes><Brands/> </ProtectedRoutes> },
      {path :"cart", element: <ProtectedRoutes><Cart/></ProtectedRoutes> },
      {path :'details/:id', element: <ProtectedRoutes><Details/></ProtectedRoutes> },
      {path :'checkout', element: <ProtectedRoutes><Checkout/></ProtectedRoutes> },
      {path :'payment-frame/:orderId', element: <ProtectedRoutes><PaymentFrame/></ProtectedRoutes> },
      {path :"allorders", element: <ProtectedRoutes><Allorders/></ProtectedRoutes> },

      {path :"register", element: <Register/> },
      {path :"login", element: <Login/> },
      {path :"admin", element: <AdminRoute><AdminPanel/></AdminRoute> },


      {path :"*", element: <NotFound />}
     
    ]}
  ])
  useEffect (()=> {
    if (localStorage.getItem("userToken")!= null) {
         setToken (localStorage.getItem("userToken"))

      }

  },[])
  return <QueryClientProvider client={queryClient}>
  <RouterProvider router={routes}></RouterProvider>
</QueryClientProvider>

}

export default App;
