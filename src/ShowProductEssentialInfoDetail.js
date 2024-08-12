import {Button, Descriptions, Form, Input, InputNumber, Select, Switch, Tag} from "antd";
import {ProductFeatures} from "./CommonInterface";
import React, {useEffect, useState} from "react";
import ShowProductOptionTag from "./ShowProductOptionTag";
import axios from "axios";
import {getResult} from "./AxiosResponse";

function ShowProductEssentialInfoDetail({product}) {
    const [form] = Form.useForm();
    const productFeatures = ProductFeatures();

    // 옵션
    const [options, setOptions] = useState(product.options);
    // 태그(특징)
    const features = product.features.map(item => item.code);

    const [originPrice, setOriginPrice] = useState(product.price);
    const [discountRate, setDiscountRate] = useState(product.discountRate);

    // 할인율 적용 최종 금액
    const [finalPrice, setFinalPrice] = useState(0);

    useEffect(() => {
        // 금액, 할인율 달라질때마다 할인율 적용 금액 계산
        calculateFinalPrice(originPrice, discountRate);
    }, [originPrice, discountRate]);

    const calculateFinalPrice = (price, discountRate) => {
        if (price != null && discountRate != null) {
            const discount = (price * (discountRate / 100));
            const final = price - discount;
            setFinalPrice(final);
        }
    };

    const changePrice = (value) => {
        setOriginPrice(value);
    }

    const changeDiscountRate = (value) => {
        setDiscountRate(value);
    }

    // [저장] 버튼 클릭시 수행 작업
    const onSubmit = async () => {
        const row = await form.validateFields();
        const request = {
            features: row['prd_features'],
            name: row['prd_name'],
            engName: row['prd_eng_name'],
            price: originPrice,
            discount: discountRate,
            isSale: row['prd_sale_yn'],
            options: options
        }

        axios.put(`/product-proxy/product/v1/products/${product.productCode}`, request)
            .then(response => {
                getResult(response, "정상적으로 수정되었습니다.");
                window.close();
            })
            .catch(error => {
                console.error("데이터 저장시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "상품 정보 저장시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
            });
    }

    return (
        <Form id={'prd-detail-form'} form={form} onFinish={onSubmit}>
            <Descriptions style={{marginBottom: 20}} bordered>
                <Descriptions.Item label='상품 코드' span={3}>
                    <Input key='prd_code' id='prd_code' disabled defaultValue={product.productCode}/>
                </Descriptions.Item>
                <Descriptions.Item label='상품명' span={1.5}>
                    <Form.Item className='product-detail-form-item' id='prd_name_id' name='prd_name' initialValue={product.productName}
                               rules={[ { required: true, message: `상품명은(는) 필수값입니다!` } ]}>
                        <Input allowClear key='prd_name' placeholder='상품명을 입력해주세요.' />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label='상품 영문명' span={1.5}>
                    <Form.Item className='product-detail-form-item' id='prd_eng_name_id' name='prd_eng_name' initialValue={product.productEngName}
                               rules={[ { required: true, message: `상품 영문명은(는) 필수값입니다!` } ]}>
                        <Input allowClear key='prd_eng_name' placeholder='상품 영문명을 입력해주세요.' />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label={(<span>메인 카테고리<br />*메인 카테고리는 수정 불가합니다.</span>)} span={1.5}>
                    <Select className='product-detail-form-select' defaultValue={product.mainCategoryCode} disabled options={[{value: product.mainCategoryCode, label: product.mainCategoryName}]} />
                </Descriptions.Item>
                <Descriptions.Item label={(<span>서브 카테고리<br />*서브 카테고리는 수정 불가합니다.</span>)} span={1.5}>
                    <Select className='product-detail-form-select' defaultValue={product.subCategoryCode} disabled options={[{value: product.subCategoryCode, label: product.subCategoryName}]} />
                </Descriptions.Item>
                <Descriptions.Item label='태그(특징)' span={1.5}>
                    <Form.Item className='product-detail-form-item' id='prd_features_id' name='prd_features' initialValue={features}>
                        <Select className='product-detail-form-select' mode='multiple' allowClear>
                            {
                                productFeatures.map((feature) => (
                                    <Select.Option key={feature.code} value={feature.code}>
                                        {feature.desc}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label='판매 여부(화면 노출 여부)' span={1.5}>
                    <Form.Item className='product-detail-form-item' id='prd_sale_yn_id' name='prd_sale_yn' initialValue={product.isSale}>
                        <Switch checkedChildren={<span>판매</span>} unCheckedChildren={<span>미판매</span>}/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label='가격'>
                    <InputNumber addonAfter="₩" min="0" stringMode defaultValue={product.price} onChange={changePrice}/>
                </Descriptions.Item>
                <Descriptions.Item label='할인율'>
                    <InputNumber addonAfter="%" min={0} max={100} parser={(value) => value?.replace('%', '')} defaultValue={product.discountRate} onChange={changeDiscountRate}/>
                </Descriptions.Item>
                <Descriptions.Item label='할인율 적용 금액'>
                    {finalPrice}₩
                </Descriptions.Item>
                <Descriptions.Item label={(<span>옵션<br /><Tag color={'gold'}>*대표 옵션</Tag></span>)} span={3}>
                    <Form.Item className='product-detail-form-item' id='prd_option_id' name='prd_option'
                               rules={[
                                   {
                                       validator: (_, value) => {
                                           if (options.length === 0) {
                                               return Promise.reject(new Error('최소 하나 이상의 옵션이 필요합니다!'));
                                           }
                                           return Promise.resolve();
                                       },
                                   },
                               ]}>
                        <ShowProductOptionTag options={options} setOptions={setOptions}/>
                    </Form.Item>
                </Descriptions.Item>
            </Descriptions>
            <div className="product-detail-save-button">
                <Button type="primary" htmlType={"submit"}>기본정보 수정</Button>
            </div>
        </Form>
    );
}

export default ShowProductEssentialInfoDetail;