import {
    theme,
    Layout,
    Typography,
    Card,
    Spin,
    Form,
    Descriptions,
    Image,
    Space,
    List,
    Divider,
    Button,
    Modal
} from "antd";
import { WarningOutlined, CommentOutlined, MessageOutlined, PictureOutlined } from '@ant-design/icons';
import axios from "axios";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import type {Review} from "../CommonInterface";
import {star} from "../CommonConst";
import "./ShowReviewDetail.css";
import {getResult} from "../AxiosResponse";
import TextArea from "antd/es/input/TextArea";

const { Content } = Layout;

function ShowReviewDetail() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 파라미터 reviewNo
    const { reviewNo } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    // 댓글 수정
    const [modifyingCommentNo, setModifyingCommentNo] = useState('');
    const [modifyingContent, setModifyingContent] = useState('');

    // 모달
    const [modalType, setModalType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        axios.get(`/review-proxy/review/v1/reviews/${reviewNo}`)
            .then(response => {
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
        const before = result.isReviewShow ? '공개' : '비공개';
        const after = result.isReviewShow ? '비공개' : '공개';
        setModalTitle(`리뷰를 ${before}에서 ${after}로 변경하겠습니까?`);
        setModalType('reviewShow');
        setModalOpen(true);
    }

    // 댓글 리스트 Action
    const onActions = (comment) => {
        let actions = [
            <Typography.Text>작성자 {comment.createdBy === 'admin' ? '관리자' : comment.createdBy}</Typography.Text>,
            <Typography.Text>작성일시 {comment.createdDate}</Typography.Text>,
            <Typography.Text>수정일시 {comment.modifiedDate}</Typography.Text>
        ];

        if(comment.createdBy === 'admin') {
            if(modifyingCommentNo === comment.commentNo) {
                actions = [...actions, <Typography.Link key="comment-upd-cmplt-btn" onClick={onClickUpdateCompleteComment}>취소/완료</Typography.Link>]
            } else {
                actions = [...actions, <Typography.Link key="comment-upd-btn" onClick={e => onClickUpdateComment(comment)}>댓글 수정하기</Typography.Link>]
            }
        }

        return actions;
    };

    // 댓글 수정하기 버튼 클릭시 수행
    const onClickUpdateComment = (comment) => {
        setModifyingContent(comment.content);
        setModifyingCommentNo(comment.commentNo);
    }

    // 댓글 취소/완료 버튼 클릭시 모달 팝업 노출
    const onClickUpdateCompleteComment = (e) => {
        setModalTitle('댓글을 수정하시겠습니까?');
        setModalType('comment');
        setModalOpen(true);
    }

    // 모달 'OK' 버튼 클릭
    const handleOK = (e) => {
        setModalLoading(true);
        switch (modalType) {
            case 'comment':
                handleOKUpdateComment();
                break;
            case 'reviewShow':
                handleOKUpdateReviewShow();
                break;
            default:
                break;
        }
    }

    const handleOKUpdateComment = () => {
        axios.patch(`/comment-proxy/comment/v1/comments/${modifyingCommentNo}`, {
            content: modifyingContent
        })
            .then(response => {
                let newComments = [...result.comments];
                result.comments = newComments.map(item => {
                    if(item.commentNo === modifyingCommentNo) {
                        item.content = response.data.content;
                        item.modifiedDate = response.data.modifiedDate;
                    }
                    return item;
                });
                setResult(result);
                setModalLoading(false);
            })
            .catch(error => {
                console.error("데이터 수정시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "댓글 수정시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setModalLoading(false);
            });
        setModifyingContent('');
        setModifyingCommentNo('');
        setModalOpen(false);
    }

    const handleOKUpdateReviewShow = () => {
        axios.patch(`/review-proxy/review/v1/reviews/${result.reviewNo}`, {
            isShowYn: !result.isReviewShow
        })
            .then(response => {
                setResult(prev => ({...prev, isReviewShow: response.isReviewShow}));
                setModalLoading(false);
            })
            .catch(error => {
                console.error("데이터 수정시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "리뷰 수정시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setModalLoading(false);
            });
        setModalOpen(false);
    }

    // 모달 'Cancel' 클릭
    const handleCancel = (e) => {
        setModalOpen(false);

        if(modalType === 'comment') {
            setModifyingContent('');
            setModifyingCommentNo('');
        }
    }

    // 댓글 내용 \n 노출되도록 세팅
    const setContent = (content) => {
        const splitStr = content.split('\n');
        return splitStr.map((text, index) => {
            return index === splitStr.length-1 ? <>{text}</> : <>{text}<br/></>
        });
    }

    // 댓글 내용 수정
    const onChangeContent = (e) => {
        setModifyingContent(e.currentTarget.value);
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
                                            {
                                                !result.isPayedPoint &&
                                                <Button danger type={'primary'} size={'small'} onClick={onClickPayPoint}>포인트 지급하기</Button>
                                            }
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label='리뷰 공개 여부' span={1.5}>
                                        <Space split={<Divider type="vertical"/>}>
                                            <Typography.Text>{result.isReviewShow ? '공개' : '비공개'}</Typography.Text>
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
                                                            <Image key={index} id={index} width={200} src={image.fullPath}/>
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
                                                            {modifyingCommentNo && modifyingCommentNo === item.commentNo ?
                                                                <TextArea defaultValue={modifyingContent} autoSize onChange={onChangeContent} />
                                                                : setContent(item.content)}
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
            <Modal
                open={modalOpen}
                title={modalTitle}
                onOk={handleOK}
                onCancel={handleCancel}
                confirmLoading={modalLoading}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )}
            />
        </Layout>
    )
}

export default ShowReviewDetail;