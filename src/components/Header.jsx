import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-around items-center py-4 px-6">
          <h1 className="text-xl font-bold text-blue-600"><Link to="/">ImageTool</Link></h1>
          
          <ul className=" w-2/3 flex justify-around">
            <Link to="/">
              <li className="text-gray-600 hover:text-blue-500">Home</li>
            </Link>
            <Link to="/imagetopdf">
              <li className="text-gray-600 hover:text-blue-500">Image to Pdf</li>
            </Link>
            <Link to="/resize">
              <li className="text-gray-600 hover:text-blue-500">Resize Image</li>
            </Link>
            <Link to="/crop">
              <li className="text-gray-600 hover:text-blue-500">Crop Image</li>
            </Link>
            <Link to="/format-change">
              <li className="text-gray-600 hover:text-blue-500">Format Change</li>
            </Link>
          </ul>
        </div>
      </nav>
    </div>
  );
}
