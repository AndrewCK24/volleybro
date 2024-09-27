import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useOnLeavePage = (callback) => {
  const pathname = usePathname();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      callback();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, callback]);
}
