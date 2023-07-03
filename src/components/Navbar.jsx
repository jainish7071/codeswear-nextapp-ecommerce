import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { AiOutlineShoppingCart, AiFillCloseCircle, AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";

const Navbar = ({ logout, user, cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const ref = useRef(null);
  const [dropdown, setDropdown] = useState(false);

  const toggleCart = () => {
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    } else if (ref.current.classList.contains("translate-x-0")) {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }
  };

  return (
    <div className="flex sticky top-0 bg-white z-10 flex-col md:flex-row md:justify-start py-2 justify-center items-center shadow-md">
      <div className="logo mr-auto md:mx-5">
        <Link href={"/"}>
          <Image src="/codeswareLogo.png" alt="" width={200} height={40} />
        </Link>
      </div>
      <div className="nav">
        <ul className="flex items-center space-x-6 font-bold md:text-md">
          <Link href={"/tshirts"} className="hover:text-pink-600">
            <li>T-shirts</li>
          </Link>
          <Link href={"/hoodies"} className="hover:text-pink-600">
            <li>Hoodies</li>
          </Link>
          <Link href={"/mugs"} className="hover:text-pink-600">
            <li>Mugs</li>
          </Link>
          <Link href={"/stickers"} className="hover:text-pink-600">
            <li>Stickers</li>
          </Link>
        </ul>
      </div>
      <div className="cart absolute flex right-0 top-4 mx-5 cursor-pointer items-center">
        <span onMouseOver={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
          {user && user.value && <MdAccountCircle className="text-xl md:text-2xl mx-2" />}
          {dropdown && (
            <div className="absolute right-9 top-6 rounded-md px-5 w-36 bg-white shadow-lg border">
              <ul>
                <Link href={"/myaccount"}>
                  <li className="py-1 hover:text-pink-700 text-sm font-bold">My Account</li>
                </Link>
                <Link href={"/orders"}>
                  <li className="py-1 hover:text-pink-700 text-sm font-bold">Orders</li>
                </Link>
                <li onClick={logout} className="py-1 hover:text-pink-700 text-sm font-bold">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </span>
        {!user && (
          <Link href={"/login"}>
            <button className="bg-pink-600 px-2 py-1 rounded-md text-sm text-white mx-2">Login</button>
          </Link>
        )}
        <AiOutlineShoppingCart onClick={toggleCart} className="text-xl md:text-2xl" />
      </div>
      <div ref={ref} className={`sideCart overflow-y-auto h-[100vh] w-72 fixed top-0 right-0 bg-pink-100 py-10 px-8 transition-transform ${Object.keys(cart).length !== 0 ? "translate-x-0" : "translate-x-full"}  transform`}>
        <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
        <span onClick={toggleCart} className="absolute top-5 right-2 cursor-pointer text-2xl text-pink-500">
          <AiFillCloseCircle />
        </span>
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && <div className="my-4 font-semibold">Your Cart is Empty!</div>}
          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-3">
                  <div className="w-2/3 font-semibold">
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
        <div className="total my-3 font-bold">Subtotal: {subTotal}</div>
        <div className="flex">
          <Link href="/checkout">
            <button disabled={Object.keys(cart).length === 0} className="flex mx-auto disabled:bg-pink-300 text-white bg-pink-500 border-0 py-1 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm">
              <BsFillBagCheckFill className="m-1" />
              Checkout
            </button>
          </Link>
          <button onClick={clearCart} disabled={Object.keys(cart).length === 0} className="flex mx-auto disabled:bg-pink-300 text-white bg-pink-500 border-0 py-1 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
