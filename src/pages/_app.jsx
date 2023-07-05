import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [key, setKey] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    router.events.on("routerChangeStart", () => setProgress(40));
    router.events.on("routeChangeComplete", () => setProgress(100));
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
    let myUser = JSON.parse(localStorage.getItem("myUser"));
    if (myUser) {
      setUser({ value: myUser.token, email: myUser.email });
      setKey(Math.random());
    }
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("myUser");
    setUser(null);
    setKey(Math.random);
    toast.success("Logged Out Successfully!", {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    if (Object.keys(cart) === 0) {
      setKey(Math.random);
    }
    let myCart = cart;
    if (itemCode in cart) {
      myCart[itemCode].qty = myCart[itemCode].qty + qty;
    } else {
      myCart[itemCode] = { qty: 1, price, name, size, variant };
    }
    saveCart(myCart);
  };

  const removeFromCart = (itemCode, qty, price, name, size, variant) => {
    let myCart = { ...cart };
    if (itemCode in myCart) {
      myCart[itemCode].qty = myCart[itemCode].qty - qty;
    }
    if (myCart[itemCode].qty <= 0) {
      delete myCart[itemCode];
    }
    saveCart(myCart);
  };

  const saveCart = (myCart) => {
    setCart(myCart);
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subT = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subT += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubTotal(subT);
  };

  const clearCart = () => {
    saveCart({});
  };

  const buyNow = (itemCode, qty, price, name, size, variant) => {
    let myCart = { [itemCode]: { qty: qty, price, name, size, variant } };
    saveCart(myCart);
    router.push("/checkout");
  };

  return (
    <>
      <LoadingBar color="#ff2d55" progress={progress} onLoaderFinished={() => setProgress(0)} waitingTime={400} />
      <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Navbar logout={logout} user={user} key={key} buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />
      <Component buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
      <Footer />
    </>
  );
}
