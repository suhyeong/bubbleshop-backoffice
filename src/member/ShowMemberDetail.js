import {Card, Layout, Spin, Tabs, theme, Typography} from "antd";
import axios from "axios";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import type {Member} from "../CommonInterface";
import {getResult} from "../AxiosResponse";
import "./ShowMemberDetail.css";
import ShowMemberEssentialInfoDetail from "./ShowMemberEssentialInfoDetail";
const { Content } = Layout;

function ShowMemberDetail() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 파라미터 memberId
    const { memId } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.get(`/member-proxy/member/v1/members/${memId}`)
            .then(response => {
                const result:Member = response.data;
                setResult(result);
                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "회원 정보 조회시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setLoading(false);
                window.close();
            });
    }, [memId]);

    return (
        <Layout className='member-management-detail'>
            <Content className='member-management-detail-content'>
                <div style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Card className='member-detail-card'
                          title={<Typography.Title level={2} style={{ margin: 3 }}>회원 상세 정보 🔍</Typography.Title>}>
                        <Spin spinning={loading} tip="Loading" size="middle">
                            <Tabs
                                type='card'
                                size='large'
                                items={[
                                    {
                                        key: 'essentialInfo',
                                        label: '기본 정보',
                                        children: result && <ShowMemberEssentialInfoDetail member={result} />
                                    }
                                ]}>
                            </Tabs>
                        </Spin>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
}

export default ShowMemberDetail;