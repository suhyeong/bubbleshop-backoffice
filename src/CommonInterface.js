import {TimeRangePickerProps} from "antd";
import dayjs from "dayjs";

export interface HealthCheckInfo {
    target: string,
    isHealth: boolean,
    status: number,
    statusText: string
}

export const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];

export interface Category {
    categoryCode: string,
    categoryName: string,
    categoryEngName: string,
    isShow: boolean
}

export interface Product {
    productCode: string,
    productName: string,
    productEngName: string,
    mainCategoryCode: string,
    mainCategoryName: string,
    subCategoryCode: string,
    subCategoryName: string,
    createdAt: string,
    price: number,
    discountRate: number,
    isSale: boolean,
    imageList: ProductImage[],
    features: ProductFeature[],
    options: ProductOption[]
}

export interface ProductImage {
    sequence: number,
    divCode: string,
    path: string,
    fullUrl: string,
    type: string
}

export interface ProductFeature {
    code: string,
    desc: string
}

export interface ProductOption {
    sequence: number,
    name: string,
    stockCnt: number,
    isDefaultOption: boolean
}

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
        code: 'R',
        desc: '랜덤 상품'
    },
    {
        code: 'F',
        desc: '고정 상품'
    },
    {
        code: 'N',
        desc: '신상품'
    },
    {
        code: 'S',
        desc: '재입고'
    },
]

export interface Member {
    id: string,
    name: string,
    nickname: string,
    phoneNum: string,
    joinDate: string,
    point?: number,
    withdrawalDate?: string,
    leftDateToDiscardMemberInfo? : string,
    birthDate?: string,
    email?: string,
    isEmailReceiveAgree?: boolean,
}

export interface ReviewResult {
    count: number,
    reviewList: Review[]
}

export interface Review {
    reviewNo: string,
    memberId: string,
    memberName?: string,
    productCode: string,
    productName?: string,
    productScore?: number,
    reviewContent: string,
    isReviewShow?: boolean,
    isPointPayed?: boolean,
    createdAt: string,
    imageList?: ReviewImage[]
}

export interface ReviewImage {
    sequence: number,
    path: string,
    fullUrl: string,
}