import React from 'react'
import MainHeading from '../main-heading'

function Contact() {
  return (
    <section>
      <div className='text-center my-8'>
        <MainHeading
          subTitle="Don't hesitate"
          title="Contact us"
        />
        <div className='mt-8'>
          <a className='text-4xl underline text-gray-500' href='tel:+2012121212'>
            +2012121212
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact