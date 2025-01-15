import "./Main.css";
import {Breadcrumb, Layout, theme} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";

const { Content } = Layout;

function HealthCheck() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuBreadCrumbItem = [ { title : "Main" } ];
    const domainList = ['product', 'member'];
    const [healthCheckResult, setHealthCheckResult] = useState([]);

    // Health Check 를 위한 API 호출
    useEffect(() => {
        const fetchData = async (target: string) => {
            const healthUrl = `/${target}-proxy/actuator/health`;
            const response = await axios(healthUrl);
            setHealthCheckResult(prevInfo => [...prevInfo, {
                target: target,
                isHealth: response.ok,
                status: response.status,
                statusText: response.statusText
            }]);
        }

        domainList.forEach(domain => {
            fetchData(domain);
        });
    }, []);

    return (
        <Content className="main-layout-content">
            <Breadcrumb className="menu-breadcrumb" items={menuBreadCrumbItem}/>
            <div className="main-layout-content-body" style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                Health check test<p/>
                {
                    healthCheckResult.map((info, index) => (
                        index === healthCheckResult.length-1 ?
                            (<>{info.target} / status : {info.status}, statusText : {info.statusText}</>)
                        : (<>{info.target} / status : {info.status}, statusText : {info.statusText}<p/></>)
                        )
                    )
                }
            </div>
        </Content>
    );
}

export default HealthCheck;