import type {TableProps} from "antd";
import {
    Breadcrumb,
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Layout,
    Row,
    Space,
    Table,
    theme,
    Tooltip,
    Typography
} from "antd";
import React, {useState} from "react";
import "../Main.css";
import "./ManageReview.css";
import dayjs from "dayjs";
import axios from "axios";
import {getResult} from "../AxiosResponse";
import type {Review, ReviewResult} from "../CommonInterface";
import {rangePresets} from "../CommonInterface";

const { Content } = Layout;
const { RangePicker } = DatePicker;

function ManageReview() {
    const searchResultTableColumns: TableProps<Review>['columns'] = [
        {
            title: '리뷰 번호',
            dataIndex: 'reviewNo',
            key: 'reviewNo',
            render: (text) => (<Typography.Link onClick={openDetailPopup(text, 'review')}>{text}</Typography.Link>),
            align: "center",
            ellipsis: true,
        },
        {
            title: '회원 아이디',
            dataIndex: 'memberId',
            key: 'memberId',
            render: (text) => (<Typography.Link onClick={openDetailPopup(text, 'member')}>{text}</Typography.Link>),
            align: "center",
            ellipsis: true,
        },
        {
            title: '상품코드',
            dataIndex: 'productCode',
            key: 'productCode',
            align: "center",
            ellipsis: true,
            render: (text) => (<Typography.Link onClick={openDetailPopup(text, 'product')}>{text}</Typography.Link>)
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
            title: '리뷰 공개 여부',
            dataIndex: 'isReviewShow',
            key: 'reviewShowYn',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text ? '공개' : '미공개'}</Tooltip>)
        },
        {
            title: '포인트 지급 여부',
            dataIndex: 'isPayedPoint',
            key: 'payedPointYn',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text ? '지급 완료' : '미지급'}</Tooltip>)
        },
        {
            title: '작성일시',
            dataIndex: 'createdDate',
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
        { title : "Manage Member" }, { title : "Review" },
    ];

    const [createdStartDate, setCreatedStartDate] = useState(dayjs().add(-7, 'd').format('YYYY-MM-DD'));
    const [createdEndDate, setCreatedEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    const openDetailPopup = (value, type) => (e) => {
        // default : _blank
        const popupWindow = window.open(
            `/management/${type}/detail/${value}`,
        );

        if (popupWindow) {
            popupWindow.focus(); // 팝업 창이 이미 열려 있으면 해당 창에 포커스를 맞춥니다.
        } else {
            alert("팝업 창이 차단되었습니다. 팝업 차단을 해제해주세요.");
        }
    };

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalSize, setTotalSize] = useState(0);
    const [searchResult, setSearchResult] = useState([]);

    // 리뷰 리스트 조회 API 호출
    const getReviewList = (requestParam) => {
        axios.get(`/review-proxy/review/v1/reviews` + requestParam)
            .then(response => {
                let result:ReviewResult = response.data;
                setSearchResult(result.reviewList);
                setTotalSize(result.count);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "데이터 조회시 에러가 발생했습니다.");
            });
    }

    const getRequestParam = (page, pageSize) => {
        let param = `?page=${page}&size=${pageSize}`;

        const values = form.getFieldsValue();

        if(values['member_id'] !== undefined) {
            param += `&memberId=${values['member_id']}`;
        }
        if(values['prd_code'] !== undefined) {
            param +=`&productCode=${values['prd_code']}`;
        }
        if(createdStartDate && createdEndDate) {
            param +=`&createdStartDate=${createdStartDate}&createdEndDate=${createdEndDate}`;
        }

        return param;
    }

    const handleSubmit = () => {
        getReviewList(getRequestParam(page, pageSize));
    };

    const onChangePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
        getReviewList(getRequestParam(page, pageSize));
    };

    const onCreatedDateChange = (date:dayjs, dateString: string) => {
        // dateString 형식 ['시작일자','종료일자'] ex) ['2024-12-31', '2025-01-14']
        setCreatedStartDate(dateString[0]);
        setCreatedEndDate(dateString[1]);
    };

    return (
        <Content className='main-layout-content'>
            <Breadcrumb className='menu-breadcrumb' items={menuBreadCrumbItem} />
            <div className='main-layout-content-body' style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                <div className='manage-review-search-body'>
                    <Form id="search-form" form={form} onFinish={handleSubmit}>
                        <Row className='form-row-class' gutter={10}>
                            <Col span={6} key="1"><Form.Item id="member-id-form" label="회원 아이디" name="member_id"><Input allowClear/></Form.Item></Col>
                            <Col span={6} key="2"><Form.Item id="prd-code-form" label="상품 코드" name="prd_code"><Input allowClear/></Form.Item></Col>
                            <Col span={6} key="3"><Form.Item id="mem-join-form" label="작성일시" name="mem_join_date">
                                <RangePicker defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
                                             presets={rangePresets}
                                             maxDate={dayjs()}
                                             onChange={onCreatedDateChange}/>
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
                    <div className='manage-review-search-result-body'>
                        <Table
                            columns={searchResultTableColumns}
                            rowKey={(resultItem) => resultItem.reviewNo}
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
            </div>
        </Content>
    );
}

export default ManageReview;