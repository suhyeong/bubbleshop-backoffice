import {Button, Card, Form, Layout, Modal, Spin, theme, Typography} from "antd";
import "./ShowProductDetail.css";

import ShowProductEssentialInfoDetail from "./ShowProductEssentialInfoDetail";
import ShowProductImageInfoDetail from "./ShowProductImageInfoDetail";
import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import {getResult} from "./AxiosResponse";
import axios from "axios";
import type {Product, ProductImage} from "./CommonInterface";
import type {UploadFile} from "antd";

const { Content } = Layout;

const tabList = [
    {
        'key': 'essentialInfo',
        'tab': '기본정보'
    },
    {
        'key': 'imageInfo',
        'tab': '이미지정보'
    }
];

function ShowProductDetail() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 파라미터 productCode
    const { prdCode } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    const [thumbnailImage, setThumbnailImage] = useState([]);
    const [detailImages, setDetailImages] = useState([]);

    useEffect(() => {
        axios.get(`/product-proxy/product/v1/products/${prdCode}`)
            .then(response => {
                const result:Product = response.data;
                console.log(result);
                setResult(result);
                const prdImage: ProductImage[] = result.imageList;
                defaultThumbnailFile(prdImage);
                defaultDetailFile(prdImage);
                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "상품 정보 조회시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setLoading(false);
                window.close();
            });
    }, [prdCode]);

    const defaultThumbnailFile = (prdImage) => {
        const thumbImg: ProductImage[] = prdImage.filter(item => item.divCode === 'T');
        if(thumbImg.length > 0) {
            const file: UploadFile = {
                uid: 0,
                name: thumbImg[0].path,
                status: 'done',
                url: thumbImg[0].fullUrl
            }
            console.log(file);
            setThumbnailImage([file]);
        }
    }

    const defaultDetailFile = (prdImage) => {
        const detailImg: ProductImage[] = prdImage.filter(item => item.divCode === 'F');
        if(detailImg.length > 0) {
            const newDetailImages: UploadFile[] = detailImg.map((item, index) => ({
                uid: index+1,
                name: item.path,
                status: 'done',
                url: item.fullUrl
            }));
            console.log(newDetailImages);
            setDetailImages(newDetailImages);
        }
    }

    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('essentialInfo');

    // 탭 변경시 수행 작업
    const onTabChange = (key: string) => {
        setActiveTab(key);
    }

    // [저장] 버튼 클릭시 수행 작업
    const onSubmit = () => {
        console.log(form.getFieldsValue());
        console.log(thumbnailImage);
        console.log(detailImages);
    }

    // [삭제] 버튼 클릭시 모달 오픈 여부
    const [deleteModal, setDeleteModal] = useState(false);

    const onDelete = () => {
        setDeleteModal(true);
    }

    const onDeleteModalOK = () => {
        axios.delete(`/product-proxy/product/v1/products/${prdCode}`)
            .then(response => {
                getResult(response, "상품을 정상적으로 삭제했습니다.");
                window.close();
            })
            .catch(error => {
                console.error("데이터 삭제시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "상품 삭제시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
            });
    }

    const onDeleteModalCancel = () => {
        setDeleteModal(false);
    }

    // [취소] 버튼 클릭시 수행 작업
    const onCancel = () => {
        window.close();
    }

    const getSaveButtonName = () => {
        return tabList.find(item => item.key === activeTab).tab;
    }

    return (
        <Layout className='product-management-detail'>
            <Content className='product-management-detail-content'>
                <div style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Form id={'prd-detail-form'} form={form} onFinish={onSubmit} encType={"multipart/form-data"}>
                        <Card className='product-detail-card'
                              title={<Typography.Title level={2} style={{ margin: 3 }}>상품 상세 정보 🔍</Typography.Title>}
                              tabList={tabList}
                              activeTabKey={activeTab}
                              onTabChange={onTabChange}>
                            {<Spin spinning={loading} tip="Loading" size="middle">
                                {
                                    activeTab === 'essentialInfo' && result && (
                                        <ShowProductEssentialInfoDetail product={result} form={form} />
                                    )
                                }
                                {
                                    activeTab === 'imageInfo' && result && (
                                        <ShowProductImageInfoDetail thumbnailImage={thumbnailImage} setThumbnailImage={setThumbnailImage}
                                                                    detailImages={detailImages} setDetailImages={setDetailImages} />
                                    )
                                }
                            </Spin>}
                        </Card>
                        <div>
                            <div className="product-detail-bottom-parent">
                                <Button className='product-detail-modify-button' type="primary" htmlType={"submit"}>{getSaveButtonName()} 수정</Button>
                                <Button className='product-detail-delete-button' onClick={onDelete}>삭제</Button>
                                <Button className='product-detail-cancel-button' onClick={onCancel}>취소</Button>
                            </div>
                        </div>
                    </Form>
                    <Modal
                        title="상품을 삭제하시겠습니까?" open={deleteModal}
                        onOk={onDeleteModalOK} onCancel={onDeleteModalCancel}
                        okText="네" cancelText="아니요" >
                        상품을 삭제하면 기존에 저장되어있던 이미지 정보 및 재고 정보가 전부 삭제됩니다.
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
}

export default ShowProductDetail;