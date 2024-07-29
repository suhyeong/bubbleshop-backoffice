import "./Main.css";
import {Breadcrumb, Layout, theme} from "antd";
import React, {useEffect, useState} from "react";
const { Content } = Layout;

function HealthCheck() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuBreadCrumbItem = [ { title : "Main" } ];

    const [productHealthCheck, setProductHealthCheck] = useState('');

    // TODO 여러 도메인 체크하도록 로직 변경
    // Health Check 를 위한 API 호출
    useEffect(()=>{
        fetch("/product-proxy/actuator/health")
            .then(response => response.text())
            .then(message => setProductHealthCheck(message))
    }, [productHealthCheck])

    return (
        <Content className="main-layout-content">
            <Breadcrumb className="menu-breadcrumb" items={menuBreadCrumbItem}/>
            <div className="main-layout-content-body" style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                Health check test<p/>
                product : {productHealthCheck}
            </div>
        </Content>
    );
}

export default HealthCheck;