import {useTranslations} from 'next-intl';

const Footer =() => {
  const t = useTranslations();
  return (
    <footer className='border-t p-8 text-center text-accent'>
      <div className='container'>
        <p>{t('copyRight')}</p>
      </div>
    </footer>
  );
};

export default Footer;
