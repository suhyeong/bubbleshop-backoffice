import {Button, List, Space} from "antd";
import { StarFilled, StarOutlined, PlusCircleOutlined, CheckCircleOutlined, StopOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import type {ReviewResult} from "../CommonInterface";
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
        const param = `?page=${page}&size=1&memberId=${memberId}`
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

    // 리뷰 별점
    const star = (score) => {
        let starElements = [];
        let filled = 1;
        for(let i = 1; i<=5; i++){
            if(filled <= score) {
                starElements = [...starElements, <StarFilled key={i} style={{'color': 'red'}}/>];
            } else {
                starElements = [...starElements, <StarOutlined key={i} />];
            }
            filled++;
        }
        return <Space>{starElements.map(item => item)}</Space>;
    }

    const actionItems = (review) => {
        let list = [];

        // 1. 사진 유무
        if(review.imageList) {
            list = [...list, <Space>사진 리뷰</Space>];
        }

        // 2. 포인트 지급 여부
        list = [...list, review.isPointPayed ? <Space className="member-review-list-blue-action-icon"><CheckCircleOutlined />포인트 지급 완료 리뷰</Space>
            : <Space className="member-review-list-red-action-icon" onClick={onClickReviewAction}><PlusCircleOutlined />포인트 미지급 리뷰</Space>
        ];

        // 3. 리뷰 공개 여부
        list = [...list, review.isReviewShow ? <Space onClick={onClickReviewAction}>공개 리뷰</Space>
            : <Space className="member-review-list-red-action-icon" onClick={onClickReviewAction}><StopOutlined />비공개 리뷰</Space>
        ];

        return list;
    }

    // 리뷰 리스트 클릭시 리뷰 상세 페이지 이동
    const onClickReviewAction = (e) => {
        // todo
        console.log(e);
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
                        title={<>{item.reviewNo} | {star(item.productScore)}</>}
                    description={item.productName} />
                    {item.reviewContent}
                </List.Item>
            )}
        />
    );
}

export default ShowMemberReviewInfoDetail;