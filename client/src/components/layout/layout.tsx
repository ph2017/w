import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BarChartOutlined,
    TagsOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, Dropdown, MenuProps, Space } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales';
import { LanguageContext } from '../../context/language-context';
import http from '../../utils/http';
import './layout.css';

const { Header, Sider, Content } = Layout;

const LanguageSwitch = () => {
    const { t } = useTranslation();
    const languageContext = React.useContext(LanguageContext);
    const language = languageContext?.language;
    const setLanguage = languageContext?.setLanguage;

    const onClick: MenuProps['onClick'] = ({ key }) => {
        i18n.changeLanguage(key);
        setLanguage && setLanguage(key as 'zh-CN' | 'en-US');
        http({
            url: '/api/lang',
            method: 'post',
            data: {
                lang: key === 'zh-CN' ? 'zh' : 'en'
            }
        })
        // message.info(`Click on item ${key}`);
    };

    const configOptions = [
        {
            label: '中文',
            key: 'zh-CN',
            disabled: language === 'zh-CN',
        },
        {
            label: 'English',
            key: 'en-US',
            disabled: language === 'en-US',
        },
    ];

    const items: MenuProps['items'] = [...configOptions];

    // const currentLanguage = configOptions.find(item => item && item.key === language)?.label;

    return (
        <Dropdown menu={{ items, onClick }}>
            <Space className='language-item'>
              {/* <GlobalOutlined className='language-switch-icon' /> */}
              <SettingOutlined className='language-switch-icon'/>
              <Space></Space>
              {/* <span>{currentLanguage}</span> */}
              <span>{t('setting')}</span>
            </Space>
        </Dropdown>
    );
};

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    // const {
    //     token: { colorBgContainer, borderRadiusLG },
    // } = theme.useToken();

    const navigate = useNavigate();

    const location = useLocation();

    const { t } = useTranslation()

    const onMenuClick = (e: any) => {
        navigate(e.key);
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    color: '#fff',
                }}
            >
                <>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type='text'
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                                color: '#fff',
                            }}
                        />
                        <h1>{t('platform')}</h1>
                    </div>
                    <LanguageSwitch></LanguageSwitch>
                </>
            </Header>

            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className='demo-logo-vertical' />
                    <Menu
                        theme='dark'
                        mode='inline'
                        defaultSelectedKeys={[location.pathname]}
                        onClick={onMenuClick}
                        items={[
                            {
                                key: '/datas',
                                icon: <BarChartOutlined />,
                                label: t('datas') // '数据管理'
                            },
                            {
                                key: '/tags',
                                icon: <TagsOutlined />,
                                label: t('tags') // '标签管理',
                            },
                        ]}
                    />
                </Sider>
                <Content
                    style={{
                        // margin: '16px',
                        padding: 24,
                        minHeight: 280,
                        // background: colorBgContainer,
                        // borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
