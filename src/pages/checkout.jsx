import Link from "next/link";
import React from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Checkout = ({ cart, addToCart, clearCart, removeFromCart, subTotal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("myUser"));
    if (user && user.token) {
      setUser(user);
      setEmail(user.email);
    }
  }, []);

  useEffect(() => {
    const validateFormData = () => {
      if (name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 10 && pincode.length === 6) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    };
    validateFormData();
  }, [name, email, phone, address, pincode]);

  const handleChange = async (e) => {
    let value = e.target.value;
    switch (e.target.name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "pincode":
        if (value.length === 6) {
          let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
          let pinJson = await pins.json();
          if (Object.keys(pinJson).includes(value)) {
            setDistrict(pinJson[value][0]);
            setState(pinJson[value][1]);
          } else {
            setDistrict("");
            setState("");
          }
        } else {
          setDistrict("");
          setState("");
        }
        setPincode(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "phone":
        setPhone(value);
        break;
      default:
        break;
    }
  };

  const initiatePayment = async () => {
    let orderId = Math.floor(Math.random() * Date.now());
    let data = {
      cart,
      subTotal,
      orderId,
      email,
      name,
      address,
      pincode,
      phone,
    };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/preTransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let txnResponse = await a.json();

    if (txnResponse.success) {
      let txnToken = txnResponse.txnToken;
      let config = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId: orderId,
          token: txnToken,
          tokenType: "TXN_TOKEN",
          amount: subTotal,
        },
        handler: {
          notifyMerchant: function (eventName, data) {
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          },
        },
      };
      // initialze configuration using init method
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          // after successfully updating configuration, invoke JS Checkout
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("error => ", error);
        });
    } else {
      localStorage.removeItem("cart");
      if (txnResponse.cartClear) {
        clearCart();
      }
      toast.error(txnResponse.error, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="container px-4 sm:m-auto">
      <Head>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Script type="application/javascript" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} crossorigin="anonymous"></Script>

      <h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>
      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      <div className="mx-auto flex-wrap flex my-2">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Name
            </label>
            <input type="text" id="name" name="name" value={name} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            {user ? <input type="email" id="email" name="email" value={user.email} readOnly className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" /> : <input type="email" id="email" name="email" value={email} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}
          </div>
        </div>
      </div>
      <div className="px-2 w-full">
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">
            Address
          </label>
          <textarea id="address" name="address" value={address} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" cols="30" rows="2"></textarea>
        </div>
      </div>
      <div className="mx-auto flex-wrap flex my-2">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
              Phone Number
            </label>
            <input type="text" id="phone" name="phone" placeholder="Your 10-Digit Phone Number" value={phone} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">
              Pin Code
            </label>
            <input type="text" id="pincode" name="pincode" value={pincode} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>
      <div className="mx-auto flex-wrap flex my-2">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">
              State
            </label>
            <input type="text" value={state} id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="district" className="leading-7 text-sm text-gray-600">
              District
            </label>
            <input type="text" value={district} id="district" name="district" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly />
          </div>
        </div>
      </div>

      <h2 className="font-semibold text-xl">2. Review Cart Item</h2>
      <div className="sideCart bg-pink-100 m-2 p-6">
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && <div className="my-4 font-semibold">Your Cart is Empty!</div>}
          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-3">
                  <div className="font-semibold">
                    {cart[k].name} ({cart[k].size}/{cart[k].variant})
                  </div>
                  <div className=" flex items-center justify-center w-1/3 font-semibold text-sm">
                    <AiFillMinusCircle
                      onClick={() => {
                        removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant);
                      }}
                      className="cursor-pointer text-pink-500"
                    />
                    <span className="mx-2">{cart[k].qty}</span>
                    <AiFillPlusCircle
                      onClick={() => {
                        addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant);
                      }}
                      className="cursor-pointer text-pink-500"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <span className="total font-bold">Subtotal: {subTotal}</span>
      </div>
      <div className="mx-4">
        <Link href="/checkout">
          <button onClick={initiatePayment} disabled={disabled} className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-1 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm">
            <BsFillBagCheckFill className="m-1" />
            Pay ₹{subTotal}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
