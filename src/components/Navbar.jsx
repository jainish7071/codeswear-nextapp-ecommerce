import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Navbar = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-start py-2 justify-center items-center">
      <div className="logo mx-5">
        <Image src="/codeswareLogo.png" alt="" width={200} height={40} />
      </div>
      <div className="nav">
        <ul className="flex items-center space-x-2 font-bold md:text-xl">
          <Link href={"/"}>
            <li>T-shirts</li>
          </Link>
          <Link href={"/"}>
            <li>Hoodies</li>
          </Link>
          <Link href={"/"}>
            <li>Mugs</li>
          </Link>
          <Link href={"/"}>
            <li>Stickers</li>
          </Link>
        </ul>
      </div>
      <div className="cart absolute right-0 top-4 mx-5">
        <AiOutlineShoppingCart className="text-3xl" />
      </div>
    </div>
  );
};

export default Navbar;
