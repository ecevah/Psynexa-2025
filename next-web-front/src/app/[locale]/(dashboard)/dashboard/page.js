import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
 
export default function DashboardPage() {
  const t = useTranslations('DashboardPage');
  return (
    <div className='flex flex-row w-[calc(100vw-48px)] h-[calc(100vh-48px)]'>
        <div className='flex flex-col h-full py-[24px] px-[12px] rounded-[20px] bg-white mr-[32px]'>
            <div className='flex flex-row'>
                <div className='flex flex-col'>
                    <h1>{t('title')}</h1>
                    <Link href="/about">{t('about')}</Link>
                </div>
            </div>
        </div>
        <div>
            <h1>{t('title')}</h1>
            <Link href="/about">{t('about')}</Link>
        </div>
    </div>
  );
}