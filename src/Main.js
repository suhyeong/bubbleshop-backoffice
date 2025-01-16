import React, {useState} from "react";
import "./Main.css";

import {
    AppstoreOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import {MenuInfo} from "rc-menu/lib/interface";
import ManageProduct from "./ManageProduct";
import HealthCheck from "./HealthCheck";
import ManageCategory from "./ManageCategory";
import ManageMember from "./member/ManageMember";

const { Header, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    component?: React.Component,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        component,
        children,
        label,
    }
}

const items: MenuItem[] = [
    getItem('Main', '1', <HealthCheck />, <AppstoreOutlined />),
    getItem('Manage Member', '2', null, <AppstoreOutlined />, [
        getItem('Member', '2-1', <ManageMember />, ''),
    ]),
    getItem('Manage Product', '3', null, <AppstoreOutlined />, [
        getItem('Product', '3-1', <ManageProduct />, ''),
        getItem('Category', '3-2', <ManageCategory />, '')
    ]),
    getItem('Manage Payment', '4', null, <AppstoreOutlined />, [
        getItem('Order', '4-1', null, ''),
        getItem('Payment', '4-2',null, '')
    ])
];

const getSelectedLabel = (key: MenuInfo) => {
    let selectedMenuItem = items[0];
    const itemKey = key.key;

    const getLabelFunc = (items2: MenuItem[]) => {
        items2.forEach((menuItem) => {
            if(menuItem.key === itemKey) {
                selectedMenuItem = menuItem;
                return true;
            }

            if(menuItem.children) {
                return getLabelFunc(menuItem.children)
            }
        })
    }

    getLabelFunc(items);
    return selectedMenuItem;
}

function Main() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(items[0]);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleClick = (menuInfo: MenuInfo) => {
        const menuItem = getSelectedLabel(menuInfo);
        setSelectedMenu(menuItem);
    };

    return (
        <Layout className="main-layout">
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="menu-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" inlineIndent={20} items={items}
                      onClick={(item) => handleClick(item)}
                      openKeys={['2', '3', '4']}
                />
            </Sider>
            <Layout>
                <Header style={{background: colorBgContainer}} />
                {
                    selectedMenu.component ? selectedMenu.component : ''
                }
                <Footer className="main-footer">
                    ©{new Date().getFullYear()} Created by Su Hyeong
                </Footer>
            </Layout>
        </Layout>
    );
}

export default Main;