import MainHeading from '../main-heading';
import Image from 'next/image';
import Meunitems from './Meunitems';
//import Menu from '@/components/menu';


async function Menu() {
  return (
    <section >
      <div className="absolute left-0 right-0 w-full mt-7 justify-start hidden md:block">
        <div className="absolute left-0 -top-[70px] text-left -z-10">
          <Image src={'/sallad1.png'} width={109} height={189}  alt={'sallad'} />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
          <Image src={'/sallad2.png'} width={107} height={195} alt={'sallad'} />
        </div>
      </div>
        <div className='text-center my-8'>
          <MainHeading
            subTitle="check out"
            title="Our Best Sellers"
          />
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10'>
            <Meunitems />
          </div>
      </div>
    </section>
  );
}

export default Menu;