import React, {useEffect, useState} from "react";
import "./ManageProduct.css";
import "./Main.css";
import type {Category, Product} from "./CommonInterface";
import axios from "axios";
import {Breadcrumb, Button, Form, Layout, theme, Input, Row, Col, Space, Select, Checkbox, Table, Tooltip, Typography} from "antd";
import type { TableProps } from 'antd';
import {getResult} from "./AxiosResponse";

const { Content } = Layout;

interface ProductResult {
    totalCount: number,
    productList: Product[]
}

function ManagementProduct() {
    const searchResultTableColumns: TableProps<Product>['columns'] = [
        {
            title: '상품 코드',
            dataIndex: 'productCode',
            key: 'productCode',
            render: (text) => (<Typography.Link onClick={openProductDetailPopup(text)}>{text}</Typography.Link>),
            align: "center",
            ellipsis: true,
        },
        {
            title: '상품명',
            dataIndex: 'productName',
            key: 'productName',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text}</Tooltip>)
        },
        {
            title: '상품 영문명',
            dataIndex: 'productEngName',
            key: 'productEngName',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text}</Tooltip>)
        },
        {
            title: '메인 카테고리',
            dataIndex: 'mainCategoryName',
            key: 'mainCategoryName',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text}</Tooltip>)
        },
        {
            title: '서브 카테고리',
            dataIndex: 'subCategoryName',
            key: 'subCategoryName',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text}</Tooltip>)
        },
        {
            title: '가격',
            dataIndex: 'price',
            key: 'price',
            align: "center",
            ellipsis: true,
        },
        {
            title: '생성일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: "center",
            showSorterTooltip: { target: 'full-header' },
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [form] = Form.useForm();

    // Menu Crumb
    const menuBreadCrumbItem = [
        { title : "Manage Product" }, { title : "Product" }
    ]

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

    // Checkbox 상품명 포함 체크 여부
    const [containName, setContainName] = useState(false);

    const openAddProductPopup = () => {
        // 팝업 창을 열기 위해 window.open() 메서드를 사용합니다.
        const popupWindow = window.open(
            "/management/product/add",
            "_blank"
        );

        if (popupWindow) {
            popupWindow.focus(); // 팝업 창이 이미 열려 있으면 해당 창에 포커스를 맞춥니다.
        } else {
            alert("팝업 창이 차단되었습니다. 팝업 차단을 해제해주세요.");
        }
    };

    const openProductDetailPopup = (value) => (e) => {
        // default : _blank
        const popupWindow = window.open(
            `/management/product/detail/${value}`,
        );

        if (popupWindow) {
            popupWindow.focus(); // 팝업 창이 이미 열려 있으면 해당 창에 포커스를 맞춥니다.
        } else {
            alert("팝업 창이 차단되었습니다. 팝업 차단을 해제해주세요.");
        }
    };

    const onChangeCheckBoxProductName = () => {
        setContainName(!containName);
    }

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalSize, setTotalSize] = useState(0);
    const [searchResult, setSearchResult] = useState([]);

    // product list 조회 API 호출
    const getProductList = (requestParam) => {
        axios.get(`/product-proxy/product/v1/products` + requestParam)
            .then(response => {
                let result:ProductResult = response.data;
                setSearchResult(result.productList);
                setTotalSize(result.totalCount);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "데이터 조회시 에러가 발생했습니다.");
            });
    };

    const getRequestParam = (page, pageSize) => {
        let param = `?page=${page}&size=${pageSize}`;

        const values = form.getFieldsValue();

        if(values['product_code'] !== undefined) {
            param += `&productCode=${values['product_code']}`;
        }
        if(values['product_name'] !== undefined) {
            param +=`&productName=${values['product_name']}&isProductNameContains=${containName}`;
        }
        if(values['main_cate'] !== undefined) {
            param += `&mainCategoryCode=${values['main_cate']}`;
        }
        if(values['sub_cate'] !== undefined) {
            param += `&subCategoryCode=${values['sub_cate']}`;
        }

        return param;
    }

    const onChangePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
        getProductList(getRequestParam(page, pageSize));
    };

    const handleSubmit = () => {
        getProductList(getRequestParam(page, pageSize));
    };

    return (
        <Content className='main-layout-content'>
            <Breadcrumb className='menu-breadcrumb' items={menuBreadCrumbItem} />
            <div className='main-layout-content-body' style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                <div className='manage-product-search-body'>
                    <Form id="search-form" form={form} onFinish={handleSubmit}>
                        <Row className='form-row-class' gutter={10}>
                            <Col span={10} key="1"><Form.Item id="prd-code-form" label="상품코드" name="product_code"><Input allowClear/></Form.Item></Col>
                            <Col span={10} key="2">
                                <Form.Item id="prd-name-form" label="상품명" name="product_name">
                                    <Input allowClear addonAfter={<Checkbox name="prd-name-contains" onClick={onChangeCheckBoxProductName}>포함</Checkbox>}/>
                                </Form.Item></Col>
                        </Row>
                        <Row className='form-row-class' gutter={10}>
                            <Col span={10}>
                                <Form.Item id="main-cate-form" label="메인카테고리" name="main_cate">
                                    <Select allowClear>
                                        {
                                            mainCategory.map((category: Category) => {
                                                return <Select.Option key={category.categoryCode} value={category.categoryCode}>{category.categoryName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item id="sub-cate-form" label="서브카테고리" name="sub_cate">
                                    <Select allowClear>
                                        {
                                            subCategory.map((category: Category) => {
                                                return <Select.Option key={category.categoryCode} value={category.categoryCode}>{category.categoryName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className='search-and-clear-btn-class'>
                            <Space size="small">
                                <Button type="primary" htmlType={"submit"}>Search</Button>
                                <Button onClick={() => {form.resetFields();}}>Clear</Button>
                            </Space>
                        </div>
                    </Form>
                    <div className='prd-add-btn-class'>
                        <Button type="primary" onClick={openAddProductPopup}>상품 추가</Button>
                    </div>
                </div>
                <div className='manage-product-search-result-body'>
                    <Table
                           columns={searchResultTableColumns}
                           rowKey={(resultItem) => resultItem.productCode}
                           dataSource={searchResult}
                           pagination={{position: ['bottomCenter'],
                               current: page,
                               pageSize: pageSize,
                               total: totalSize,
                               showTotal: (total) => `Total ${total} items`,
                               showSizeChanger: true,
                               onChange: onChangePage
                           }}
                    />
                </div>
            </div>
        </Content>
    );
}

export default ManagementProduct;