import {Space, TimeRangePickerProps} from "antd";
import dayjs from "dayjs";
import {StarFilled, StarOutlined} from "@ant-design/icons";
import React from "react";

export const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];

export const CategoryType = () => [
    {
        code: "main",
        name: "메인"
    },
    {
        code: "sub",
        name: "서브"
    }
]

export const ProductFeatures = () => [
    {
        code: "R",
        desc: "랜덤 상품"
    },
    {
        code: "F",
        desc: "고정 상품"
    },
    {
        code: "N",
        desc: "신상품"
    },
    {
        code: "S",
        desc: "재입고"
    },
]

export const ProductPointType = () => [
    {
        code: "R",
        desc: "일반 리뷰"
    },
    {
        code: "P",
        desc: "사진 리뷰"
    },
    {
        code: "C",
        desc: "구매 확정"
    },
]

// 리뷰 별점 표시
export const star = (score) => {
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

// 파일 Base64 로딩
export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });