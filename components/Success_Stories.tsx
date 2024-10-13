import React from 'react'
import { Card, CardContent } from "@/components/ui/card";


const HeartSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-full h-full transition-transform duration-700 ease-in-out hover:scale-110"
  >
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

  
function Success_Stories() {
  return (
    <div>
        <section className="py-16 bg-primaryPink text-white relative overflow-hidden">
  <div className="max-w-6xl mx-auto text-center relative z-10">
    <h2 className="text-4xl font-bold mb-8">Success Stories</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { names: "Priyanka & Somonath", story: "We found each other through this platform and it's been an incredible journey!" },
        { names: "Vijay & Vrushali", story: "Our journey to love was made possible with the help of this matrimonial service." },
        { names: "Anil & Rekha", story: "Thank you for helping us find each other and building a life of love!" }
      ].map((story, index) => (
        <div
          key={index}
          className={`flex bg-white p-10 rounded-lg shadow-xl relative overflow-hidden items-center mb-16 transform transition-transform duration-700 ${
            index % 2 === 0 ? 'flex-row translate-x-0' : 'flex-row-reverse translate-x-0'
          } hover:scale-105`}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">{story.names}</h3>
              <p className="mt-2 text-gray-600">{story.story}</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  </div>

  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute text-pink-300 opacity-50 animate-ping"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          transform: 'scale(0)',
        }}
      >
        <HeartSVG />
      </div>
    ))}
  </div>
</section>
    </div>
  )
}

export default Success_Stories