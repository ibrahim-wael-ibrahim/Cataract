import Link from 'next/link';
import Image from 'next/image';
import { Search, Camera, TrendingUp } from 'lucide-react';
export default function Home() {
  // Define your four feature items
  const features = [
    {
      id: 1,
      image: "/images/HOME_1.jpeg",
      title: "Fast Diagnosis",
      description: "Quickly analyze your eye images.",
    },
    {
      id: 2,
      image: "/images/HOME_2.jpeg",
      title: "Expert Doctors",
      description: "Access certified ophthalmologists.",
    },
    {
      id: 3,
      image: "/images/HOME_3.jpeg",
      title: "Secure Platform",
      description: "Your data is protected.",
    },
    {
      id: 4,
      image: "/images/HOME_4.jpeg",
      title: "User Friendly",
      description: "Easy and intuitive experience.",
    },
  ];

  return (
      <>
        <section className="flex justify-start items-center px-8 bg-fixed min-h-dvh w-full .hero-container bg-[url(../../public/images/HERO.jpeg)] bg-center bg-no-repeat bg-cover hero-container">
          <div className="flex flex-col items-start justify-center min-h-screen px-8 container">
            <h1 className="text-5xl text-boston-blue-300 uppercase font-extrabold">Hi, Cataract Site</h1>
            <p className="text-lg opacity-60">
              Early detection using advanced AI technology.
            </p>
          </div>
        </section>
        <section className="min-h-[60dvh] w-full flex flex-col items-center justify-center container mx-auto gap-4 pt-24">
          <h1 className="text-5xl text-boston-blue-300 uppercase font-extrabold">Features</h1>
          <hr className="h-px w-full bg-white my-8" />
          <div className="flex flex-wrap items-center justify-center mt-12">
            {features.map((feature) => (
                <div
                    key={feature.id}
                    className="flex flex-col justify-start items-start gap-4 bg-boston-blue-900/40 p-4 rounded-2xl backdrop-blur-lg m-4"
                >
                  <Image
                      src={feature.image}
                      alt={feature.title}
                      width={300}
                      height={350}
                      className="rounded-2xl object-cover"
                  />
                  <h1 className="text-3xl font-extrabold">{feature.title}</h1>
                  <p className="opacity-60">{feature.description}</p>
                </div>
            ))}
          </div>
        </section>
        <section className="py-16 my-24 bg-boston-blue-900/20 min-h-[60dvh] w-full">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-12">What We Offer</h2>
            <div className="flex flex-wrap justify-center gap-8 mt-28">
              <div className="flex flex-col items-center bg-boston-blue-900/40 rounded-2xl p-12">
                <Search size={48} className="text-boston-blue-700" />
                <h3 className="mt-4 text-2xl font-semibold">Search Doctors</h3>
                <p className="mt-2 text-sm">Find top specialists in your area.</p>
              </div>
              <div className="flex flex-col items-center bg-boston-blue-900/40 rounded-2xl p-12">

              <Camera size={48} className="text-boston-blue-700" />
                <h3 className="mt-4 text-2xl font-semibold">Scan Image</h3>
                <p className="mt-2 text-sm">Upload and get quick diagnosis.</p>
              </div>
              <div className="flex flex-col items-center bg-boston-blue-900/40 rounded-2xl p-12">

              <TrendingUp size={48} className="text-boston-blue-700" />
                <h3 className="mt-4 text-2xl font-semibold">Performance</h3>
                <p className="mt-2 text-sm">Fast and reliable results every time.</p>
              </div>
            </div>
          </div>
        </section>
      </>
  );
}
