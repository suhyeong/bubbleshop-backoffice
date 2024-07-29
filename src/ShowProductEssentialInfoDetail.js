import {Form, Input, Badge, Descriptions, Select, Tag, InputNumber} from "antd";
import type {DescriptionsProps} from "antd";
import type {Category, Product, ProductFeature, ProductOption} from "./CommonInterface";
import {ProductFeatures} from "./CommonInterface";
import React, {useEffect, useState} from "react";
import AddProductOptionTag from "./AddProductOptionTag";


function ShowProductEssentialInfoDetail({product, form}) {
    const productFeatures = ProductFeatures();

    const [options, setOptions] = useState(product.options.map(item => item.name));
    const [features, setFeatures] = useState(product.features.map(item => item.code));

    useEffect(() => {
        // todo
        // setOptions(product.options);
    }, [product]);

    return (
        <div>
            <Descriptions style={{marginBottom: 20}} bordered>
                <Descriptions.Item label='상품 코드' span={3}>
                    <Input key='prd_code' id='prd_code' disabled defaultValue={product.productCode}/>
                </Descriptions.Item>
                <Descriptions.Item label='상품명'>
                    <Form.Item className='product-detail-form-item' id='prd_name_id' name='prd_name' initialValue={product.productName}
                               rules={[ { required: true, message: `상품명은(는) 필수값입니다!` } ]}>
                        <Input allowClear key='prd_name' placeholder='상품명을 입력해주세요.' />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label='상품 영문명' span={2}>
                    <Form.Item className='product-detail-form-item' id='prd_eng_name_id' name='prd_eng_name' initialValue={product.productEngName}
                               rules={[ { required: true, message: `상품 영문명은(는) 필수값입니다!` } ]}>
                        <Input allowClear key='prd_eng_name' placeholder='상품 영문명을 입력해주세요.' />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label={(<span>메인 카테고리<br />*메인 카테고리는 수정 불가합니다.</span>)}>
                    <Select className='product-detail-form-select' defaultValue={product.mainCategoryCode} disabled options={[{value: product.mainCategoryCode, label: product.mainCategoryName}]} />
                </Descriptions.Item>
                <Descriptions.Item label={(<span>서브 카테고리<br />*서브 카테고리는 수정 불가합니다.</span>)} span={2}>
                    <Select className='product-detail-form-select' defaultValue={product.subCategoryCode} disabled options={[{value: product.subCategoryCode, label: product.subCategoryName}]} />
                </Descriptions.Item>
                <Descriptions.Item label='가격'>
                    <Form.Item className='product-detail-form-item' id='prd_price_id' name='prd_price' initialValue={product.price}>
                        <InputNumber addonAfter="₩" min="0" stringMode/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label='태그(특징)' span={2}>
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
                        <AddProductOptionTag type='add' options={options} setOptions={setOptions} />
                    </Form.Item>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
}

export default ShowProductEssentialInfoDetail;