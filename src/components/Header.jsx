import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    {
      url: "/",
      title: "Home",
    },
    {
      url: "/imagetopdf",
      title: "Image to Pdf",
    },
    {
      url: "/resize",
      title: "Resize Image",
    },
    {
      url: "/crop",
      title: "Crop Image",
    },
    { url: "/format-change", title: "Format Change" },
  ];

  //console.log("menus", menus)
  return (
    <div>
      <nav className=" bg-slate-900 shadow-md">
        <div className="container mx-auto flex flex-col justify-around items-center py-4 px-6">
          <div className=" w-full flex justify-between">
            <h1 className="text-xl font-bold text-blue-600">
              <Link to="/">Image Quick</Link>
            </h1>

            {/* Desktop Menu */}
            <div className=" hidden md:flex">
              {menus?.map((menu) => (
                <ul className=" w-2/3 flex justify-around" key={menu.title}>
                  <Link to={menu.url}>
                    <li className="text-gray-600 hover:text-blue-500">
                      {menu.title}
                    </li>
                  </Link>
                </ul>
              ))}
            </div>
            {/* Mobile Hamburger Icon */}
            <button
              className=" md:hidden flex"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-chevrons-up"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 15l3 -3l3 3" />
                  <path d="M9 11l3 -3l3 3" />
                  <path d="M12 21a9 9 0 1 0 -.265 0l.265 0z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-chevrons-down"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 9l-3 3l-3 -3" />
                  <path d="M15 13l-3 3l-3 -3" />
                  <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18z" />
                </svg>
              )}
            </button>
          </div>

          <div className=" w-full  items-center flex justify-center">
            {/* Mobile Menu */}
            {isOpen && (
              <div className=" md:hidden">
                {menus?.map((menu) => (
                  <ul className="" key={menu.title}>
                    <Link to={menu.url}>
                      <li className="text-white  space-y-2 m-2 hover:text-blue-500">
                        {menu.title}
                      </li>
                    </Link>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
