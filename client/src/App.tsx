import React, { useState, useEffect } from 'react'
import './App.css'
import Layout from './components/layout'
import { ConfigProviderProps, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { LanguageContext } from './context/language-context.tsx';
import i18n from './locales';

type Locale = ConfigProviderProps['locale'];

function App() {
  const languageContext = React.useContext(LanguageContext);
  const [locale, setLocal] = useState<Locale>(languageContext?.language === 'zh-CN' ? zhCN : enUS);
  
  useEffect(() => {
    i18n.changeLanguage(languageContext?.language)
    setLocal(languageContext?.language === 'zh-CN' ? zhCN : enUS)
  }, [languageContext?.language])

  return (
    <ConfigProvider locale={locale}>
      <Layout></Layout>
    </ConfigProvider>
  )
}

export default App
