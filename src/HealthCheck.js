import "./Main.css";
import {Breadcrumb, Layout, theme} from "antd";
import React, {useEffect, useState} from "react";
import type {HealthCheckInfo} from "./CommonInterface";
const { Content } = Layout;

function HealthCheck() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuBreadCrumbItem = [ { title : "Main" } ];
    const [healthCheckResult, setHealthCheckResult] = useState([
        {
            target: 'product',
            isHealth: false,
            status: 0,
            statusText: ''
        },
        {
            target: 'member',
            isHealth: false,
            status: 0,
            statusText: ''
        }
    ]);

    // TODO 여러 도메인 체크하도록 로직 변경
    // Health Check 를 위한 API 호출
    useEffect(()=>{
        let result: HealthCheckInfo[] = [...healthCheckResult];
        healthCheckResult.map((info, index) => {
            const healthUrl = `/${info.target}-proxy/actuator/health`;
            fetch(healthUrl)
                .then(response => {
                    // console.log(healthUrl);
                    console.log(response);
                    let newResultInfo = result;
                    newResultInfo[index] = {
                        target: info.target,
                        isHealth: response.ok,
                        status: response.status,
                        statusText: response.statusText
                    }
                    result = newResultInfo;
                })
        });
        console.log(result);
        setHealthCheckResult(result);
    }, []);

    return (
        <Content className="main-layout-content">
            <Breadcrumb className="menu-breadcrumb" items={menuBreadCrumbItem}/>
            <div className="main-layout-content-body" style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                Health check test<p/>
                {
                    healthCheckResult.map((info, index) => {
                        if(index === healthCheckResult.length-1) {
                            return (
                                <>{info.target} / status : {info.status}, statusText : {info.statusText}</>
                            )
                        }

                        return (
                            <>{info.target} / status : {info.status}, statusText : {info.statusText}<p/></>
                        )
                    })
                }
            </div>
        </Content>
    );
}

export default HealthCheck;