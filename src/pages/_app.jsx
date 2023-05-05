import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import "@/styles/globals.css";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
  }, []);

  const addToCart = (itemCode, qty, price, name, size, variant) => {
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

  return (
    <>
      <Navbar cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />
      <Component cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
      <Footer />
    </>
  );
}
