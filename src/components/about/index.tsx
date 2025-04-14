import { Routes } from '@/constants/enums';
import MainHeading from '../main-heading';
import {useTranslations} from 'next-intl';
function About() {
  const t = useTranslations('home.about');
  return (
    <section className='section-gap' id={Routes.ABOUT}>
      <div className='container text-center'>
        <MainHeading subTitle={t('ourStory')} title={t('aboutUs')}/>
        <div className='text-accent max-w-md mx-auto mt-4 flex flex-col gap-4'>
          <p>{t('descriptions.one')}</p>
          <p>{t('descriptions.two')}</p>
          <p>{t('descriptions.three')}</p>
        </div>
      </div>
    </section>
  );
}

export default About;
