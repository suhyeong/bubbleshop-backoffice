import {theme, Layout, Typography, Card, Spin, Form, Descriptions, Image, Space, List, Divider, Button} from "antd";
import { WarningOutlined, CommentOutlined, MessageOutlined, PictureOutlined } from '@ant-design/icons';
import axios from "axios";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import type {Review} from "../CommonInterface";
import {star} from "../CommonConst";
import "./ShowReviewDetail.css";
import {getResult} from "../AxiosResponse";

const { Content } = Layout;
const { Text } = Typography;

function ShowReviewDetail() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 파라미터 reviewNo
    const { reviewNo } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.get(`/review-proxy/review/v1/reviews/${reviewNo}`)
            .then(response => {
                console.log(response);
                const result:Review = response.data;
                setResult(result);
                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "리뷰 정보 조회시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setLoading(false);
                window.close();
            });
    }, [reviewNo]);

    // 포인트 지급하기 버튼 클릭
    const onClickPayPoint = (e) => {
        console.log(e);
        // todo
    }

    // 리뷰 공개 여부 전환 버튼 클릭
    const onClickReviewShowYn = (e) => {
        console.log(e);
        // todo
    }

    // 댓글 리스트 Action
    const onActions = (comment) => {
        let actions = [<Typography.Text>작성일시 {comment.createdDate}</Typography.Text>, <Typography.Text>수정일시 {comment.modifiedDate}</Typography.Text>];

        if(comment.createdBy === 'admin') {
            actions = [...actions, <Typography.Link key="comment-update-btn" onClick={onClickUpdateComment}>댓글 수정하기</Typography.Link>]
        }

        return actions;
    };

    // 댓글 수정하기 버튼 클릭시 수행
    const onClickUpdateComment = (e) => {
        console.log(e);
        // todo
    }

    return !loading && result && (
        <Layout className='review-management-detail'>
            <Content className='review-management-detail-content'>
                <div style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Card className='review-detail-card'
                          title={<Typography.Title level={2} style={{ margin: 3 }}>리뷰 상세 정보 🔍</Typography.Title>}>
                        <Spin spinning={loading} tip="Loading" size="middle">
                            <Form id={'review-detail-form'}>
                                <Descriptions style={{marginBottom: 20}} bordered>
                                    <Descriptions.Item label='리뷰 번호' span={3}>
                                        <>{result.reviewNo}</>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='회원 아이디' span={1.5}>
                                        <>{result.memberId}</>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='회원명' span={1.5}>
                                        <>{result.memberName}</>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='리뷰 포인트 지급 여부' span={1.5}>
                                        <Space split={<Divider type="vertical"/>}>
                                            <Typography.Text>{result.isPayedPoint ? '지급 완료' : '미지급'}</Typography.Text>
                                            <Button danger type={'primary'} size={'small'} onClick={onClickPayPoint}>포인트 지급하기</Button>
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='리뷰 공개 여부' span={1.5}>
                                        <Space split={<Divider type="vertical"/>}>
                                            <Typography.Text>{result.isReviewShow ? '공개' : '미공개'}</Typography.Text>
                                            <Button type={'primary'} size={'small'} onClick={onClickReviewShowYn}>공개여부 전환하기</Button>
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='별점'>
                                        <>{star(result.productScore)}</>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='상품코드'>
                                        <>{result.productCode}</>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='상품명'>
                                        <>{result.productName}</>
                                    </Descriptions.Item>
                                </Descriptions>
                                <Descriptions layout={"vertical"} style={{marginBottom: 20}} bordered>
                                    <Descriptions.Item span={3} label={<><PictureOutlined /> 리뷰 이미지</>}>
                                        {
                                            result.images && result.images.length > 0 ? (
                                                <Space size={'middle'}>
                                                    {
                                                        result.images.map((image, index) => (
                                                            <Image id={index} width={200} src={image.fullPath}/>
                                                        ))
                                                    }
                                                </Space>
                                            ) : (<><WarningOutlined /> 사진이 없는 리뷰입니다.</>)
                                        }
                                    </Descriptions.Item>
                                    <Descriptions.Item span={3} label={<><MessageOutlined /> 리뷰 내용</>}>
                                        <>{result.reviewContent}</>
                                    </Descriptions.Item>
                                    <Descriptions.Item span={3} label={<><CommentOutlined /> 댓글 리뷰</>}>
                                        {
                                            result.comments && result.comments.length > 0 ?
                                                (<List
                                                    itemLayout={'horizontal'}
                                                    dataSource={result.comments}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.commentNo}
                                                            actions={onActions(item)}
                                                        >
                                                            <Space split={<Divider type="vertical"/>}>
                                                                <Text>작성자 {item.createdBy === 'admin' ? '관리자' : item.createdBy}</Text>
                                                                <Text>{item.content}</Text>
                                                            </Space>
                                                        </List.Item>
                                                    )}
                                                />)
                                                :
                                                (<><WarningOutlined /> 댓글이 없는 리뷰입니다.</>)
                                        }
                                    </Descriptions.Item>
                                </Descriptions>
                            </Form>
                        </Spin>
                    </Card>
                </div>
            </Content>
        </Layout>
    )
}

export default ShowReviewDetail;