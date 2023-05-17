import Link from "next/link";
import React from "react";
import Product from "../models/Product";
import mongoose from "mongoose";

const Mugs = ({ products }) => {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center">
            {Object.keys(products).length === 0 && <p>Sorry All the Mugs are currently our of scope new stock coming soon. Stay Tuned!</p>}
            {Object.keys(products).map((item) => {
              return (
                <Link key={products[item]._id} passHref className="lg:w-1/5 md:w-1/2 p-4 w-full m-5 shadow-lg" href={`/product/${products[item].slug}`}>
                  <div className="block relative rounded overflow-hidden">
                    <img alt="ecommerce" className="m-auto block h-[30vh] md:h-[36vh]" src={products[item].img} />
                  </div>
                  <div className="mt-4 text-center md:text-start">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Mugs</h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">{products[item].title}</h2>
                    <p className="mt-1">₹{products[item].price}</p>
                    <div className="mt-1">
                      {products[item].size.includes("S") && <span className="border border-gray-300 mx-1 px-1">S</span>}
                      {products[item].size.includes("M") && <span className="border border-gray-300 mx-1 px-1">M</span>}
                      {products[item].size.includes("L") && <span className="border border-gray-300 mx-1 px-1">L</span>}
                      {products[item].size.includes("XL") && <span className="border border-gray-300 mx-1 px-1">XL</span>}
                      {products[item].size.includes("XXL") && <span className="border border-gray-300 mx-1 px-1">XXL</span>}
                    </div>
                    <div className="mt-1">
                      {products[item].color.includes("RED") && <button className="border-2 border-gray-300 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("BLUE") && <button className="border-2 border-gray-300 ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("BLACK") && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("GREEN") && <button className="border-2 border-gray-300 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("YELLOW") && <button className="border-2 border-gray-300 ml-1 bg-yellow-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("PURPLE") && <button className="border-2 border-gray-300 ml-1 bg-purple-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Use IPv4, skip trying IPv6
    });
  }
  let products = await Product.find({ category: "mugs" });
  let mugs = {};
  for (let item of products) {
    if (item.title in mugs) {
      if (!mugs[item.title].color.includes(item.color) && item.availableQty > 0) {
        mugs[item.title].color.push(item.color.toUpperCase());
      }
      if (!mugs[item.title].size.includes(item.size) && item.availableQty > 0) {
        mugs[item.title].size.push(item.size.toUpperCase());
      }
    } else {
      mugs[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQty > 0) {
        mugs[item.title].color = [item.color.toUpperCase()];
        mugs[item.title].size = [item.size.toUpperCase()];
      }
    }
  }
  return {
    props: { products: JSON.parse(JSON.stringify(mugs)) }, // will be passed to the page component as props
  };
}

export default Mugs;
