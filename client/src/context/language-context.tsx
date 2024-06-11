/**
 * 语言选择context
 */
import React, { ReactNode, useEffect, useState } from 'react';
import http from '../utils/http'

export const LanguageContext = React.createContext<
    | {
          language: 'zh-CN' | 'en-US';
          setLanguage: (language: 'zh-CN' | 'en-US') => void;
      }
    | undefined
>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<'zh-CN' | 'en-US'>('zh-CN');
    const langMap = {
        'zh': 'zh-CN',
        'en': 'en-US'
    }
    
    useEffect(() => {
        http('/api/lang').then(({ data }) => {
            if (data) {
                // @ts-ignore
                setLanguage(langMap[data])
            }
        })
    }, [])

    return <LanguageContext.Provider children={children} value={{ language, setLanguage }} />;
};
