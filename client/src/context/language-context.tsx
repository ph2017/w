/**
 * 语言选择context
 */
import React, { ReactNode, useState } from 'react';

export const LanguageContext = React.createContext<
    | {
          language: 'zh-CN' | 'en-US';
          setLanguage: (language: 'zh-CN' | 'en-US') => void;
      }
    | undefined
>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<'zh-CN' | 'en-US'>('zh-CN');

    return <LanguageContext.Provider children={children} value={{ language, setLanguage }} />;
};
