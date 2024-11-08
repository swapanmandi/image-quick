import React from 'react';

function HeroSection() {
  return (
    <section className="bg-darkPalette-300 text-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Edit Your Images Effortlessly</h2>
        <p className="mb-8">
          Resize, crop, convert formats, and much more. All in one tool.
        </p>
        <button className="bg-white text-darkPalette-400 px-6 py-2 rounded-md shadow-md hover:bg-gray-200">
          Get Started
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
