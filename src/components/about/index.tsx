import React from 'react'
import MainHeading from '../main-heading'

function About() {
  return (
    <section>
      <div className='text-center my-8'>
          <MainHeading
            subTitle="our story"
            title="About us"
          />
          <div className='flex flex-col gap-4 text-gray-500 mx-auto  max-w-md mt-4'>
            <p>Welcome to our pizzeria, where we serve the finest pizzas made with the freshest ingredients. Every slice is a masterpiece, crafted with care to deliver the perfect balance of flavors. From classic favorites to unique creations, there&lsquo;s something for every pizza lover!</p>
            <p>Our passion for pizza shines through every dish. We hand-pick the best local ingredients and bake them to perfection, ensuring that every bite is delicious and satisfying. Whether you&lsquo;re here for a quick meal or a relaxed dining experience, we’ve got you covered.</p>
            <p>Join us on a flavorful journey and experience the joy of pizza like never before. We pride ourselves on delivering great taste, quality, and service to make every meal memorable. Come and taste the difference!</p>
          </div>
      </div>
    </section>
  )
}

export default About
