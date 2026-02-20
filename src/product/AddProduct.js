import React, {useEffect, useState} from "react";
import type {UploadFile} from "antd";
import {
    Button,
    Card,
    DatePicker,
    Descriptions,
    Form,
    Input,
    InputNumber,
    Layout,
    Modal,
    Select,
    Tag,
    theme,
    Typography
} from "antd";
import axios from "axios";
import type {Category, ProductPoint} from "../CommonInterface";
import {DateTimeRangeFormat, ProductFeatures} from "../CommonConst";
import "./AddProduct.css";
import "../Main.css";
import {getResult} from "../AxiosResponse";
import AddProductOptionTag from "./AddProductOptionTag";
import ProductDetailImage from "./ProductDetailImage";
import ManageProductPointTag from "./ManageProductPointTag";
import dayjs from "dayjs";

const { Content } = Layout;
const { RangePicker } = DatePicker;

function AddProduct() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [form] = Form.useForm();

    // Form 메인 카테고리 Select
    const [mainCategory, setMainCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);

    useEffect(() => {
        axios.get('/category-proxy/category/v1/categories?pagingYn=N&categoryType=main')
            .then(response => {
                setMainCategory(response.data);
            });
        axios.get('/category-proxy/category/v1/categories?pagingYn=N&categoryType=sub')
            .then(response => {
                setSubCategory(response.data);
            });
    }, []);

    // 썸네일 이미지 파일
    const [thumbnailImageFile, setThumbnailImageFile] = useState([]);
    // 상세 이미지 파일 리스트
    const [detailImageFiles, setDetailImageFiles] :UploadFile[] = useState([]);

    // 태그(특징)
    const productFeatures = ProductFeatures();

    // 옵션
    const [options, setOptions] = useState([]);

    // 포인트
    const [points, setPoints] = useState([]);

    // [저장] 버튼 클릭시 상품 정보 저장 API 호출
    const onSubmit = async () => {
        try {
            const row = await form.validateFields();
            const request = {
                mainCategoryCode: row['prd_main_cate'],
                subCategoryCode: row['prd_sub_cate'],
                name: row['prd_name'],
                engName: row['prd_eng_name'],
                price: row['prd_price'],
                features: row['prd_features'],
                options: options,
                defaultOption: options[0],
                points: points,
                thumbnailImageName: thumbnailImageFile[0]?.response.fileName,
                detailImageName: detailImageFiles?.map(file => file.response.fileName),
                displayStartDate: row['prd_dsp_dt'][0].format(DateTimeRangeFormat),
                displayEndDate: row['prd_dsp_dt'][1].format(DateTimeRangeFormat),
                orderDeadlineDate: row['prd_ord_dead_dt'].format(DateTimeRangeFormat)
            }

            // console.log(request);
            await axios.post('/product-proxy/product/v1/products', request)
                .then(response => {
                    getResult(response, "정상적으로 추가되었습니다.");
                    window.close();
                })
                .catch(error => {
                    console.error("상품 데이터 저장시 에러가 발생했습니다. Error : ", error);
                    getResult(error.response, "상품 데이터 저장시 에러가 발생했습니다.");
                });
        } catch (errorInfo) {
            console.error("데이터 세팅시 에러가 발생했습니다. Error : ", errorInfo);
        }
    }

    // [취소] 버튼 클릭시 모달 오픈 여부
    const [cancelModal, setCancelModal] = useState(false);

    // [취소] 버튼 클릭시 취소 모달 오픈
    const onCancel = () => {
        setCancelModal(true);
    }

    // [취소] 버튼 클릭시 취소 모달에서 [네] 버튼 클릭시 화면 닫힘
    const onOKModal = () => {
        window.close();
        setCancelModal(false);
    }

    // [취소] 버튼 클릭시 취소 모달에서 [아니요] 버튼 클릭시 화면 유지
    const onCancelModal = () => {
        setCancelModal(false);
    }

    return (
        <Layout className='product-add-layout'>
            <Content className='product-add-layout-content'>
                <div style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Form id={'add-prd-form'} form={form} onFinish={onSubmit} encType={"multipart/form-data"}>
                        <Card className='product-add-card'
                              title={<Typography.Title level={2} style={{ margin: 3 }}>상품 정보 추가 🧺</Typography.Title>}>
                            <Descriptions style={{marginBottom: 20}} title="기본 정보" bordered>
                                <Descriptions.Item label='상품 코드' span={3}>
                                    <Input key='prd_code' id='prd_code' disabled placeholder='상품 코드는 자동으로 저장시 생성됩니다.' />
                                </Descriptions.Item>
                                <Descriptions.Item label='상품명'>
                                    <Form.Item className='product-add-form-item' id='prd_name_id' name='prd_name'
                                    rules={[ { required: true, message: `상품명은(는) 필수값입니다!` } ]}>
                                        <Input allowClear key='prd_name' placeholder='상품명을 입력해주세요.' />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label='상품 영문명' span={2}>
                                    <Form.Item className='product-add-form-item' id='prd_eng_name_id' name='prd_eng_name'
                                               rules={[ { required: true, message: `상품 영문명은(는) 필수값입니다!` } ]}>
                                        <Input allowClear key='prd_eng_name' placeholder='상품 영문명을 입력해주세요.' />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label='메인 카테고리'>
                                    <Form.Item className='product-add-form-item' id='prd_main_cate_id' name='prd_main_cate'
                                               rules={[ { required: true, message: `메인 카테고리 선택은 필수입니다!` } ]}>
                                        <Select className='product-add-form-select' allowClear>
                                            {
                                                mainCategory.map((category: Category) => (
                                                    <Select.Option key={category.categoryCode} value={category.categoryCode}>
                                                        {category.categoryName}
                                                    </Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label='서브 카테고리' span={2}>
                                    <Form.Item className='product-add-form-item' id='prd_sub_cate_id' name='prd_sub_cate'
                                               rules={[ { required: true, message: `서브 카테고리 선택은 필수입니다!` } ]}>
                                        <Select className='product-add-form-select' allowClear>
                                            {
                                                subCategory.map((category: Category) => (
                                                    <Select.Option key={category.categoryCode} value={category.categoryCode}>
                                                        {category.categoryName}
                                                    </Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label='상품 전시일'>
                                    <Form.Item id='prd_dsp_dt_id' name='prd_dsp_dt'
                                               rules={[{ type: 'array', required: true, message: '상품 전시일은 필수입니다!' }]}>
                                        <RangePicker showTime
                                                     format={DateTimeRangeFormat}
                                                     presets={[
                                                         {
                                                             label: <span aria-label="tomorrow to end of this year">내일~올해마지막날</span>,
                                                             value: () => [dayjs().add(+1, 'd').startOf('day'), dayjs().endOf('year')], // 5.8.0+ support function
                                                         },
                                                     ]}
                                            minDate={dayjs().add(+1, 'd').startOf('day')}
                                        />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label='예약 마감일' span={2}>
                                    <Form.Item id='prd_ord_dead_dt_id' name='prd_ord_dead_dt'>
                                        <DatePicker minDate={dayjs().add(+2, 'd')} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label='가격'>
                                    <Form.Item className='product-add-form-item' id='prd_price_id' name='prd_price' initialValue="0">
                                        <InputNumber addonAfter="₩" min="0" stringMode/>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label='태그(특징)' span={2}>
                                    <Form.Item className='product-add-form-item' id='prd_features_id' name='prd_features'>
                                        <Select className='product-add-form-select' mode='multiple' allowClear>
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
                                <Descriptions.Item label='포인트 지급 유형' span={3}>
                                    <Form.Item className='product-add-form-item' id='prd_point_id' name='prd_point'
                                               rules={[
                                                   {
                                                       validator: (_, value) => {
                                                           if (points && points.length > 0) {
                                                               for (const point: ProductPoint of points) {
                                                                   if(!point.pointTypeCode) {
                                                                       return Promise.reject(new Error('포인트 지급 유형을 선택해주세요!'));
                                                                   }
                                                                   if(point.savePoint <= 0) {
                                                                       return Promise.reject(new Error('지급할 포인트를 입력해주세요!'));
                                                                   }
                                                               }
                                                           }
                                                           return Promise.resolve();
                                                       },
                                                   },
                                               ]}>
                                        <ManageProductPointTag points={points} setPoints={setPoints} />
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label={(<span>옵션<br /><Tag color={'gold'}>*대표 옵션</Tag></span>)} span={3}>
                                    <Form.Item className='product-add-form-item' id='prd_option_id' name='prd_option'
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
                                        <AddProductOptionTag options={options} setOptions={setOptions} />
                                    </Form.Item>
                                </Descriptions.Item>
                            </Descriptions>
                            <ProductDetailImage type={'add'} thumbnailImageFile={thumbnailImageFile} setThumbnailImageFile={setThumbnailImageFile}
                                                detailImageFiles={detailImageFiles} setDetailImageFiles={setDetailImageFiles}/>
                        </Card>
                        <div className="product-management-add">
                            <div className="product-add-bottom-parent">
                                <Button className='product-save-button' type="primary" htmlType={"submit"}>저장</Button>
                                <Button className='product-cancel-button' onClick={onCancel}>취소</Button>
                                <Modal
                                    title="상품 추가를 취소하시겠습니까?" open={cancelModal}
                                    onOk={onOKModal} onCancel={onCancelModal}
                                    okText="네" cancelText="아니요" >
                                    저장하지 않고 취소시 입력한 데이터는 사라집니다.
                                </Modal>
                            </div>
                        </div>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
}

export default AddProduct;