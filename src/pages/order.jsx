import React, { useEffect } from "react";
import Order from "../models/Order";
import mongoose from "mongoose";
import { useRouter } from "next/router";

const MyOrder = ({ order, clearCart }) => {
  const products = order.products;
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("myUser")) {
      router.push("/");
    }
    if (router.query.clearCart) {
      clearCart();
    }
  }, []);
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">CODESWEAR.COM</h2>
            <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-4">Order Id: #{order.orderId}</h1>
            <p className="leading-relaxed mb-4">Yayy! Your Order Has been successfully placed. </p>
            <p>
              Your Payment status is : <span className="font-semibold text-slate-700">{order.status}</span>{" "}
            </p>
            <div className="flex mb-4">
              <a className="text-lg px-1">Item Description</a>
              <a className="text-lg m-auto">Quantity</a>
              <a className="text-lg m-auto">Item Total</a>
            </div>
            {Object.keys(products).map((key) => {
              let item = products[key];
              return (
                <div key={key} className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-500">
                    {item.name} ({item.size}/{item.variant})
                  </span>
                  <span className="m-auto text-gray-900">{item.qty}</span>
                  <span className="m-auto text-gray-900">₹{item.price}</span>
                </div>
              );
            })}
            <div className="flex flex-col my-6">
              <span className="title-font font-medium text-2xl text-gray-900">SubTotal - ₹{order.amount}</span>
              <button className="flex mr-auto my-3 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">Track Order</button>
            </div>
          </div>
          <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="/order.png" />
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Use IPv4, skip trying IPv6
    });
  }
  let order = await Order.findById(context.query.id);

  return {
    props: { order: JSON.parse(JSON.stringify(order)) }, // will be passed to the page component as props
  };
}

export default MyOrder;
