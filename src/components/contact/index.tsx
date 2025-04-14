import MainHeading from '@/components/main-heading';
import { Routes } from '@/constants/enums';
import { useTranslations } from 'next-intl';

const Contact =  () => {
  const t = useTranslations('home.contact');
  return (
    <section className='section-gap' id={Routes.CONTACT}>
      <div className='container text-center'>
        <MainHeading
          subTitle= {t("Don'tHesitate")} 
          title={t("contactUs")}
        />
        <div className='mt-8'>
          <a className='text-4xl underline text-accent' href='tel:+2012121212'>
            +2012121212
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
