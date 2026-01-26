import {Button, Card, Layout, Modal, Spin, theme, Typography, Tabs} from "antd";
import "./ShowProductDetail.css";

import ShowProductEssentialInfoDetail from "./ShowProductEssentialInfoDetail";
import ShowProductImageInfoDetail from "./ShowProductImageInfoDetail";
import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import {getResult} from "../AxiosResponse";
import axios from "axios";
import type {Product} from "../CommonInterface";

const { Content } = Layout;

function ShowProductDetail() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 파라미터 productCode
    const { prdCode } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [enableDelete, setEnableDelete] = useState(true);
    // 화면 노출 여부
    const [isShowProduct, setIsShowProduct] = useState(false);

    useEffect(() => {
        axios.get(`/product-proxy/product/v1/products/${prdCode}`)
            .then(response => {
                const result:Product = response.data;
                setResult(result);

                // 상품 판매중 (FO 노출중)
                const now = Date.now();
                const startDate = new Date(result.displayStartDate);
                const endDate = new Date(result.displayEndDate);
                const isShow = result.isSale && now >= startDate && now <= endDate;
                setIsShowProduct(isShow);

                // TODO 상품 판매중이거나 주문 내역이 1개 이상 존재할 경우 삭제 불가능 처리
                if (isShow) { setEnableDelete(false); }

                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "상품 정보 조회시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setLoading(false);
                // window.close();
            });
    }, [prdCode]);

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

    return (
        <Layout className='product-management-detail'>
            <Content className='product-management-detail-content'>
                <div style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Card className='product-detail-card'
                          title={<Typography.Title level={2} style={{ margin: 3 }}>상품 상세 정보 🔍</Typography.Title>}>
                        <Spin spinning={loading} tip="Loading" size="middle">
                            <Tabs
                                type='card'
                                size='large'
                                items={[
                                    {
                                        key: 'essentialInfo',
                                        label: '기본 정보',
                                        children: result && <ShowProductEssentialInfoDetail product={result} isShowProduct={isShowProduct} />
                                    },
                                    {
                                        key: 'imageInfo',
                                        label: '이미지 정보',
                                        children: result && <ShowProductImageInfoDetail productCode={result.productCode} productImage={result.imageList} isShowProduct={isShowProduct} />
                                    }
                                ]}>
                            </Tabs>
                        </Spin>
                    </Card>
                    <div className="product-detail-bottom-parent">
                        <Button className='product-detail-delete-button' disabled={!enableDelete} onClick={onDelete}>삭제</Button>
                        <Button className='product-detail-cancel-button' onClick={onCancel}>취소</Button>
                    </div>
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