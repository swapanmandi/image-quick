import React from 'react';
import { Link } from 'react-router-dom';

function FeaturesSection() {
  const features = [
    { title: "Resize Images", description: "Easily resize images to your preferred dimensions.", url: "/resize" },
    { title: "Crop Images", description: "Crop images to focus on the essential parts.", url: "/crop"},
    { title: "Format Conversion", description: "Convert images to different formats such as PNG, JPG, or GIF.", url: "/format-change"},
    { title: "Image to PDF", description: "Transform images into PDF files quickly and easily.", url:"/imagetopdf" },
  ];

  return (
    <section className="py-20 bg">
      <div className="container mx-auto text-center">
        <h3 className="text-3xl text-black font-bold mb-10">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className=" bg-darkPalette-300 p-6 rounded-lg shadow-md">
              <Link to={feature.url}>
              <h4 className=" text-darkPalette-100 text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="">{feature.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
