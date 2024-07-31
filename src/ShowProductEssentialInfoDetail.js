import {Form, Input, Descriptions, Select, Tag, InputNumber} from "antd";
import {ProductFeatures} from "./CommonInterface";
import React, {useEffect, useState} from "react";
import ShowProductOptionTag from "./ShowProductOptionTag";

function ShowProductEssentialInfoDetail({product, form}) {
    const productFeatures = ProductFeatures();

    // 옵션
    const [options, setOptions] = useState(product.options);
    // 태그(특징)
    const features = product.features.map(item => item.code);
    // 할인율 적용 최종 금액
    const [finalPrice, setFinalPrice] = useState(0);

    useEffect(() => {
        // 초기값으로 할인율 적용 금액 계산
        calculateFinalPrice();
    }, [product]);

    const calculateFinalPrice = () => {
        const price = form.getFieldValue('prd_price');
        const discountRate = form.getFieldValue('prd_discount_rate');
        if (price != null && discountRate != null) {
            const discount = (price * (discountRate / 100));
            const final = price - discount;
            setFinalPrice(final);
        }
    };

    return (
        <div>
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
                <Descriptions.Item label='가격'>
                    <Form.Item className='product-detail-form-item' id='prd_price_id' name='prd_price' initialValue={product.price}>
                        <InputNumber addonAfter="₩" min="0" stringMode onChange={calculateFinalPrice}/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label='할인율'>
                    <Form.Item className='product-detail-form-item' id='prd_discount_rate_id' name='prd_discount_rate' initialValue={product.discountRate}>
                        <InputNumber addonAfter="%" min={0} max={100} parser={(value) => value?.replace('%', '')} onChange={calculateFinalPrice}/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label='할인율 적용 금액'>
                    {finalPrice}₩
                </Descriptions.Item>
                <Descriptions.Item label='태그(특징)' span={3}>
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
        </div>
    );
}

export default ShowProductEssentialInfoDetail;