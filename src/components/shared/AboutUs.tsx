import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className="bg-gray-100 py-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
          <p className="mt-4 text-gray-600">
            Discover the world with our travel tips and destination guides. Our platform is designed to connect travel enthusiasts and inspire new adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className="relative h-80 w-full md:h-full">
            <Image
              src="/images/about-us.jpg"
              alt="Travel illustration"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Content Section */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Our mission is to empower travelers with the best tips, stories, and recommendations to make their trips more enjoyable and memorable.
              Whether you are a seasoned traveler or planning your first adventure, our platform offers valuable insights from fellow travelers around the world.
            </p>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-2">Comprehensive destination guides curated by travelers.</li>
              <li className="mb-2">Travel tips from a vibrant community of explorers.</li>
              <li className="mb-2">Access to exclusive premium content for verified users.</li>
              <li>Interactive features to follow and connect with fellow travelers.</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to start your next adventure?
          </h2>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition">
            Join Us Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
