import {Button, List, Space} from "antd";
import { PlusCircleOutlined, CheckCircleOutlined, StopOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import type {ReviewResult} from "../CommonInterface";
import {star} from "../CommonConst";
import axios from "axios";
import {getResult} from "../AxiosResponse";
import "./ShowMemberDetail.css";

function ShowMemberReviewInfoDetail({memberId}) {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = () => {
        // 회원 상세 페이지에서 회원의 리뷰 리스트 조회시 페이지 사이즈 20으로 고정
        const param = `?page=${page}&size=20&memberId=${memberId}`
        axios.get(`/review-proxy/review/v1/reviews` + param)
            .then(response => {
                const result:ReviewResult = response.data;
                setReviews([...reviews, ...result.reviewList]);
                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "회원의 리뷰 정보 조회시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setLoading(false);
                window.close();
            });
    }

    // 리뷰 리스트 더보기 버튼 클릭시 수행
    const onLoadMore = () => {
        setPage(page + 1);
    }

    // 리뷰 리스트 더보기 버튼
    const loadMore =
        !loading ? (
            <div className="member-review-list-loading-more-btn">
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;

    const actionItems = (review) => {
        let list = [];

        // 1. 사진 유무
        if(review.imageList) {
            list = [...list, <Space>사진 리뷰</Space>];
        }

        // 2. 포인트 지급 여부
        list = [...list, review.isPayedPoint ? <Space className="member-review-list-blue-action-icon"><CheckCircleOutlined />포인트 지급 완료 리뷰</Space>
            : <Space className="member-review-list-red-action-icon"><PlusCircleOutlined />포인트 미지급 리뷰</Space>
        ];

        // 3. 리뷰 공개 여부
        list = [...list, review.isReviewShow ? <Space>공개 리뷰</Space>
            : <Space className="member-review-list-red-action-icon"><StopOutlined />비공개 리뷰</Space>
        ];

        return list;
    }

    // 리뷰 리스트에서 리뷰 번호 클릭시 리뷰 상세 페이지 이동
    const onClickReviewAction = (e) => {
        const popupWindow = window.open(
            `/management/review/detail/${e.target.innerText}`,
        );

        if (popupWindow) {
            popupWindow.focus(); // 팝업 창이 이미 열려 있으면 해당 창에 포커스를 맞춥니다.
        } else {
            alert("팝업 창이 차단되었습니다. 팝업 차단을 해제해주세요.");
        }
    }

    return (
        <List
            size="large"
            pagination={{ 'position': 'bottom', 'align': 'end' }}
            loading={loading}
            loadMore={loadMore}
            dataSource={reviews}
            renderItem={(item) => (
                <List.Item
                    key={item.reviewNo}
                    actions={actionItems(item)}
                >
                    <List.Item.Meta
                        title={<Space onClick={onClickReviewAction}>{item.reviewNo} | {star(item.productScore)}</Space>}
                    description={item.productName} />
                    {item.reviewContent}
                </List.Item>
            )}
        />
    );
}

export default ShowMemberReviewInfoDetail;