import {
    Breadcrumb,
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Layout,
    Row,
    Space,
    theme,
    DatePicker,
    Typography,
    Tooltip, Table
} from "antd";
import "./ManageMember.css";
import "../Main.css";
import React, {useState} from "react";
import axios from "axios";
import dayjs from 'dayjs';
import {TimeRangePickerProps} from "antd";
import type {TableProps} from "antd";
import {getResult} from "../AxiosResponse";
import {Member} from "../CommonInterface";
const { Content } = Layout;
const { RangePicker } = DatePicker;

interface MemberResult {
    totalCount: number,
    memberList: Member[]
}

const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];

function ManagementMember() {
    const searchResultTableColumns: TableProps<Member>['columns'] = [
        {
            title: '회원 아이디',
            dataIndex: 'id',
            key: 'memberId',
            render: (text) => (<Typography.Link onClick={openMemberDetailPopup(text)}>{text}</Typography.Link>),
            align: "center",
            ellipsis: true,
        },
        {
            title: '회원명',
            dataIndex: 'name',
            key: 'memberName',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text}</Tooltip>)
        },
        {
            title: '회원 닉네임',
            dataIndex: 'nickname',
            key: 'memberNickname',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text}</Tooltip>)
        },
        {
            title: '전화번호',
            dataIndex: 'phoneNum',
            key: 'memberPhoneNumber',
            align: "center",
            ellipsis: true,
            render: (text) => (<Tooltip placement="left" title={text}>{text}</Tooltip>)
        },
        {
            title: '가입일시',
            dataIndex: 'joinDate',
            key: 'joinAt',
            align: "center",
            showSorterTooltip: { target: 'full-header' },
            sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        },
        {
            title: '탈퇴일시',
            dataIndex: 'withdrawalDate',
            key: 'withdrawalAt',
            align: "center",
            showSorterTooltip: { target: 'full-header' },
            sorter: (a, b) => new Date(a.withdrawalDate).getTime() - new Date(b.withdrawalDate).getTime()
        }
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [form] = Form.useForm();

    // Menu Crumb
    const menuBreadCrumbItem = [
        { title : "Manage Member" }, { title : "Member" },
    ]

    const [containName, setContainName] = useState(false);
    const [joinStartDate, setJoinStartDate] = useState(dayjs().add(-7, 'd').format('YYYY-MM-DD'));
    const [joinEndDate, setJoinEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    const openMemberDetailPopup = (value) => (e) => {
        // default : _blank
        const popupWindow = window.open(
            `/management/member/detail/${value}`,
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

    // 회원 리스트 조회 API 호출
    const getMemberList = (requestParam) => {
        axios.get(`/member-proxy/member/v1/members` + requestParam)
            .then(response => {
                let result:MemberResult = response.data;
                setSearchResult(result.memberList);
                setTotalSize(result.totalCount);
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
        if(values['mem_nickname'] !== undefined) {
            param +=`&memberNickname=${values['mem_nickname']}&isMemberNicknameContains=${containName}`;
        }

        param += `&joinStartDate=${joinStartDate}&joinEndDate=${joinEndDate}`

        return param;
    }

    const onChangePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
        getMemberList(getRequestParam(page, pageSize));
    };

    const onChangeCheckBoxProductName = () => {
        setContainName(!containName);
    }

    const onJoinDateChange = (date:dayjs, dateString: string) => {
        // dateString 형식 ['시작일자','종료일자'] ex) ['2024-12-31', '2025-01-14']
        setJoinStartDate(dateString[0]);
        setJoinEndDate(dateString[1]);
    }

    const handleSubmit = () => {
        getMemberList(getRequestParam(page, pageSize));
    };

    return (
        <Content className='main-layout-content'>
            <Breadcrumb className='menu-breadcrumb' items={menuBreadCrumbItem} />
            <div className='main-layout-content-body' style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                <div className='manage-member-search-body'>
                    <Form id="search-form" form={form} onFinish={handleSubmit}>
                        <Row className='form-row-class' gutter={10}>
                            <Col span={6} key="1"><Form.Item id="member-id-form" label="회원 아이디" name="member_id"><Input allowClear/></Form.Item></Col>
                            <Col span={6} key="2">
                                <Form.Item id="mem-nickname-form" label="회원 닉네임" name="mem_nickname">
                                    <Input allowClear addonAfter={<Checkbox name="mem-nickname-contains" onClick={onChangeCheckBoxProductName}>포함</Checkbox>}/>
                                </Form.Item>
                            </Col>
                            <Col span={6} key="3"><Form.Item id="mem-join-form" label="가입일시" name="mem_join_date">
                                <RangePicker defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
                                             presets={rangePresets}
                                             maxDate={dayjs()}
                                             onChange={onJoinDateChange}/>
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
                </div>
                <div className='manage-member-search-result-body'>
                    <Table
                        columns={searchResultTableColumns}
                        rowKey={(resultItem) => resultItem.id}
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
    )
}

export default ManagementMember;