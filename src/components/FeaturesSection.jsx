import React from 'react';

function FeaturesSection() {
  const features = [
    { title: "Resize Images", description: "Easily resize images to your preferred dimensions." },
    { title: "Crop Images", description: "Crop images to focus on the essential parts." },
    { title: "Format Conversion", description: "Convert images to different formats such as PNG, JPG, or GIF." },
    { title: "Image to PDF", description: "Transform images into PDF files quickly and easily." },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h3 className="text-3xl text-black font-bold mb-10">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
