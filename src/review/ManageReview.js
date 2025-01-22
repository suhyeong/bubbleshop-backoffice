import {Breadcrumb, Form, Layout, theme} from "antd";
import React, {useState} from "react";
import "../Main.css";
import dayjs from "dayjs";
import axios from "axios";
import {getResult} from "../AxiosResponse";
const { Content } = Layout;

function ManageReview() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [form] = Form.useForm();

    // Menu Crumb
    const menuBreadCrumbItem = [
        { title : "Manage Member" }, { title : "Review" },
    ]

    // 회원명 포함 여부
    const [containMemberName, setContainMemberName] = useState(false);
    // 상품명 포함 여부
    const [containProductName, setContainProductName] = useState(false);
    const [createdStartDate, setCreatedStartDate] = useState(dayjs().add(-7, 'd').format('YYYY-MM-DD'));
    const [createdEndDate, setCreatedEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    const openReviewDetailPopup = (value) => (e) => {
        // default : _blank
        const popupWindow = window.open(
            `/management/review/detail/${value}`,
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
                // TODO
                // let result:MemberResult = response.data;
                // setSearchResult(result.memberList);
                // setTotalSize(result.totalCount);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "데이터 조회시 에러가 발생했습니다.");
            });
    }

    return (
        <Content className='main-layout-content'>
            <Breadcrumb className='menu-breadcrumb' items={menuBreadCrumbItem} />
            <div className='main-layout-content-body' style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
            </div>
        </Content>
    );
}

export default ManageReview;