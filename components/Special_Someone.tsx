import React from 'react'
import { FaHandshake, FaHeart, FaUserCircle } from 'react-icons/fa';
import { Card, CardContent } from "@/components/ui/card";
function Special_Someone() {
    return (
        <div>
            <section className="py-16 bg-white relative z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-primaryPink mb-4">Find Your Special Someone</h2>
                    <p className="text-gray-600 mb-8">Join the best matrimonial platform trusted by millions.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: FaUserCircle, title: "Create Your Profile", description: "Set up your detailed profile in just a few easy steps." },
                            { icon: FaHeart, title: "Find Your Match", description: "Discover potential partners based on your preferences." },
                            { icon: FaHandshake, title: "Start Connecting", description: "Initiate meaningful conversations with your matches." }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center mb-16 transform transition-transform duration-700 ${index % 2 === 0 ? 'flex-row translate-x-0' : 'flex-row-reverse translate-x-0'
                                    } hover:scale-105`}
                            >
                                <Card className="h-full bg-white shadow-lg rounded-lg transition-all hover:shadow-xl">
                                    <CardContent className="p-6 flex flex-col items-center justify-between h-full">
                                        <item.icon className="text-primaryPink text-5xl mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                                        <p className="mt-2 text-gray-600">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Special_Someone