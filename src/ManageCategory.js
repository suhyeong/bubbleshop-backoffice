import {Breadcrumb, Checkbox, Col, Row, Form, Input, Layout, theme, Select, Space, Button, Table, Typography, Popconfirm, Tooltip} from "antd";
import "./Main.css";
import "./ManageProduct.css";
import "./ManageCategory.css";
import React, {useState} from "react";
import type {TableProps} from "antd";
import axios from "axios";
import { getResult } from "./AxiosResponse";
import type {Category} from "./CommonInterface";
import {CategoryType} from "./CommonConst";

const { Content } = Layout;

interface CategoryResult {
    totalCount: number,
    categoryList: Category[]
}

const EditableContext = React.createContext(null);
const categoryType = CategoryType();

const EditableCell = ({editing, isNew, title, dataIndex, inputType, record, index, children, ...restProps}) => {
    let inputNode = <Input placeholder="값을 입력하세요."/>;
    if (dataIndex === 'isShow') {
        inputNode = (
            <Select placeholder="값을 선택하세요.">
                <Select.Option key='cate_show' value={true}>노출</Select.Option>
                <Select.Option key= 'cate_hidden' value={false}>미노출</Select.Option>
            </Select>
        );
    } else if (dataIndex === 'categoryType') {
        inputNode = (
            <Select placeholder="값을 선택하세요.">
                {
                    categoryType.map((item) =>
                        (<Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>))
                }
            </Select>
        );
    } else if (dataIndex === 'categoryCode' && !isNew) { // 새로운 데이터가 아닐 경우 카테고리 코드 수정 불가능하도록 Disable 처리
        inputNode = (
            <Input disabled />
        )
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    rules={[
                        { required: true, message: `${title}은(는) 필수값입니다!` },
                        {
                            validator: (_, value) => {
                                if (dataIndex === 'categoryCode' && value.includes('NEW')) {
                                    return Promise.reject(new Error('`NEW`를 포함할 수 없습니다.'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

function ManageCategory() {
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (category) => category.categoryCode === editingKey;

    const searchResultTableColumns: TableProps<Category>['columns'] = [
        {
            title: '카테고리 코드',
            dataIndex: 'categoryCode',
            key: 'categoryCode',
            align: "center",
            ellipsis: true,
            editable: true,
        },
        {
            title: '카테고리명',
            dataIndex: 'categoryName',
            key: 'categoryName',
            align: "center",
            ellipsis: true,
            editable: true,
            render: (text) => (
                <Tooltip placement="left" title={text}>
                    {text}
                </Tooltip>
            )
        },
        {
            title: '카테고리 영문명',
            dataIndex: 'categoryEngName',
            key: 'categoryEngName',
            align: "center",
            ellipsis: true,
            editable: true,
            render: (text) => (
                <Tooltip placement="left" title={text}>
                    {text}
                </Tooltip>
            )
        },
        {
            title: '카테고리 타입',
            dataIndex: 'categoryType',
            key: 'categoryType',
            render: (text) => {
                const type = categoryType.find(item => item.code === text);
                return type ? type.name : text;
            },
            align: "center",
            ellipsis: true,
            editable: true,
        },
        {
            title: '카테고리 노출 여부',
            dataIndex: 'isShow',
            key: 'isShow',
            align: "center",
            ellipsis: true,
            render: (text) => {
                return text ? '노출' : '미노출';
            },
            editable: true,
        },
        {
            title: '수행 작업',
            dataIndex: 'operation',
            align: "center",
            render: (_, category) => {
                const editable = isEditing(category);
                return editable ? (
                    <span>
                        <Typography.Link style={{marginRight: 8}} onClick={() => saveRow(category.categoryCode)}>Save</Typography.Link>
                        <Popconfirm title="수정/저장을 취소하시겠습니까?" onConfirm={() => cancelRow(category.categoryCode)}><Typography.Link>Cancel</Typography.Link></Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link style={{marginRight: 8}} disabled={editingKey !== ''} onClick={() => editRow(category)}>Edit</Typography.Link>
                        <Popconfirm title="정말로 삭제하시겠습니까?" onConfirm={() => deleteRow(category)}><Typography.Link>Delete</Typography.Link></Popconfirm>
                    </span>
                );
            },
        },
    ];

    // form 세팅 데이터 초기화
    const initFormData = () => {
        form.setFieldsValue({
            categoryCode: '',
            categoryName: '',
            categoryEngName: '',
            categoryType: undefined,
            isShow: undefined,
        });
    }

    const cancelRow = (categoryCode) => {
        // 새로운 데이터일 경우 ROW 전체 삭제
        if(categoryCode.includes('NEW')) {
            setSearchResult(searchResult.filter(item => !item.categoryCode.includes('NEW')));
            setTotalSize(totalSize - 1);
        }
        initFormData();
        setEditingKey('');
    };

    const deleteRow = (category) => {
        let cateCode = category.categoryCode;
        axios.delete(`/category-proxy/category/v1/categories/${cateCode}`)
            .then(response => {
                setSearchResult(searchResult.filter(item => item.categoryCode !== cateCode));
                setTotalSize(totalSize - 1);
                getResult(response, "정상적으로 삭제되었습니다.");
            })
            .catch(error => {
                console.error("카테고리 데이터 삭제시 에러가 발생했습니다. Error : ", error);
            });
    }

    const editRow = (category) => {
        form.setFieldsValue({
            categoryCode: '',
            categoryName: '',
            categoryEngName: '',
            categoryType: '',
            isShow: '',
            ...category,
        });
        setEditingKey(category.categoryCode);
    };

    const saveRow = async (categoryCode) => {
        const isNewRow = categoryCode.includes('NEW');
        try {
            const row = await form.validateFields(); //유효성 검증
            const originResult = [...searchResult]; // 에러 발생시 데이터 원복을 위해서 오리지널 데이터 임시 저장
            const newResult = [...searchResult];
            const index = newResult.findIndex((item) => categoryCode === item.categoryCode);
            if(index > -1) {
                const item = newResult[index];
                newResult.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setSearchResult(newResult);
            } else {
                //error
                getResult(undefined, "데이터 세팅시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }

            // 유효성 검증이 완료된 후 axios.post 호출
            if(isNewRow) {
                await axios.post('/category-proxy/category/v1/categories', row)
                    .then(response => {
                        getResult(response, "정상적으로 추가되었습니다.");
                        initFormData();
                    })
                    .catch(error => {
                        console.error("카테고리 데이터 저장시 에러가 발생했습니다. Error : ", error);
                        getResult(error.response, "카테고리 데이터 저장시 에러가 발생했습니다.");
                        cancelRow(categoryCode);
                    });
            } else {
                const putData = {
                    categoryName: row.categoryName,
                    categoryEngName: row.categoryEngName,
                    categoryType: row.categoryType,
                    isShow: row.isShow
                }
                await axios.put(`/category-proxy/category/v1/categories/${row.categoryCode}`, putData)
                    .then(response => {
                        getResult(response, "정상적으로 수정되었습니다.");
                        initFormData();
                    })
                    .catch(error => {
                        console.error("카테고리 데이터 저장시 에러가 발생했습니다. Error : ", error);
                        getResult(error.response, "카테고리 데이터 저장시 에러가 발생했습니다.");
                        setSearchResult(originResult);
                        cancelRow(categoryCode);
                    });
            }
        } catch (errorInfo) {
            if(errorInfo.errorFields) {
                alert(errorInfo.errorFields[0].errors[0]);
            }
            console.error("데이터 세팅시 에러가 발생했습니다. Error : ", errorInfo);
        }
        setEditingKey('');
    }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [form] = Form.useForm();

    // Menu Crumb
    const menuBreadCrumbItem = [
        { title : "Manage Product" }, { title : "Category" }
    ]

    // Checkbox 카테고리명 포함 체크 여부
    const [containName, setContainName] = useState(false);

    const onChangeCheckBoxProductName = () => {
        setContainName(!containName);
    }

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalSize, setTotalSize] = useState(0);
    const [searchResult, setSearchResult] = useState([]);

    // category list 조회 API 호출
    const getCategoryList = (requestParam) => {
        axios.get(`/category-proxy/category/v1/categories` + requestParam)
            .then(response => {
                let result:CategoryResult = response.data;
                setSearchResult(result.categoryList);
                setTotalSize(result.totalCount);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "데이터 조회시 에러가 발생했습니다.");
            });
    };

    const onChangePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
        getCategoryList(getRequestParam(page, pageSize));
    };

    const handleSubmit = () => {
        getCategoryList(getRequestParam(page, pageSize));
    }

    const getRequestParam = (page, pageSize) => {
        let param = `?pagingYn=Y&page=${page}&size=${pageSize}`;

        const values = form.getFieldsValue();

        if(values['cate_code'] !== undefined) {
            param += `&categoryCode=${values['cate_code']}`;
        }
        if(values['cate_name'] !== undefined) {
            param +=`&categoryName=${values['cate_name']}&isCategoryNameContains=${containName}`;
        }
        if(values['cate_type'] !== undefined) {
            param += `&categoryType=${values['cate_type']}`;
        }

        return param;
    }

    // 카테고리 추가 버튼 클릭
    const handleAdd = () => {
        const newCateCode = `NEW_${searchResult.length + 1}`;
        const newCategory = {
            categoryCode: newCateCode, // 유니크한 키 생성. 새로 추가되는 ROW 에 임시 카테고리 코드 'NEW_날짜' 로 설정
            categoryName: '',
            categoryEngName: '',
            categoryType: '',
            isShow: '',
        };
        setEditingKey(newCateCode);
        setSearchResult([...searchResult, newCategory]);
        setTotalSize(totalSize + 1);
    };

    const mergedColumns = searchResultTableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (category) => ({
                record: category,
                inputType: col.dataIndex === 'isShow' || col.dataIndex === 'categoryType' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(category),
                isNew: category.categoryCode.includes('NEW')
            }),
        };
    });

    // Table EditableCell 을 사용하기 위해서는 <Form> 컴포넌트를 사용해야하는데,
    // 기존에 이미 조회를 위해 조건 설정 Input 들이 Form 컴포넌트 안에 존재하므로, 결과 Table 컴포넌트를 Form 안으로 동일하게 넣어줌
    return(
        <Content className='main-layout-content'>
            <Breadcrumb className='menu-breadcrumb' items={menuBreadCrumbItem} />
            <div className='main-layout-content-body' style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                <div className='manage-category-search-body'>
                    <Form id="search-form" form={form} onFinish={handleSubmit}>
                        <Row className='form-row-class' gutter={10}>
                            <Col span={8} key="1"><Form.Item id="cate-code-form" label="카테고리 코드" name="cate_code"><Input allowClear/></Form.Item></Col>
                            <Col span={10} key="2">
                                <Form.Item id="cate-name-form" label="카테고리명" name="cate_name">
                                    <Input allowClear addonAfter={<Checkbox name="cate-name-contain-checkbox-form" onClick={onChangeCheckBoxProductName}>포함</Checkbox>}/>
                                </Form.Item>
                            </Col>
                            <Col span={6} key="3">
                                <Form.Item id="cate-type-form" label="카테고리타입" name="cate_type">
                                    <Select allowClear>
                                        {
                                            categoryType.map(category => {
                                                return <Select.Option key={category.code} value={category.code}>{category.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className='manage-cate-btn-class'>
                            <Space size="small">
                                <Button type="primary" onClick={handleAdd}>카테고리 추가</Button>
                            </Space>
                            <Space className='manage-cate-search-and-clear-btn' size="small">
                                <Button type="primary" htmlType={"submit"}>Search</Button>
                                <Button onClick={() => {form.resetFields();}}>Clear</Button>
                            </Space>
                        </div>
                        <div className='manage-category-search-result-body'>
                            <EditableContext.Provider value={form}>
                                <Table
                                    rowClassName="editable-row"
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    columns={mergedColumns}
                                    rowKey={(resultItem) => resultItem.categoryCode}
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
                            </EditableContext.Provider>
                        </div>
                    </Form>
                </div>
            </div>
        </Content>
    );
}

export default ManageCategory;