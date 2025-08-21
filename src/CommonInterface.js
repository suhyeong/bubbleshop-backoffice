export interface HealthCheckInfo {
    target: string,
    isHealth: boolean,
    status: number,
    statusText: string
}

export interface Category {
    categoryCode: string,
    categoryName: string,
    categoryEngName: string,
    isShow: boolean
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

export interface ProductPoint {
    pointTypeCode: string,
    savePoint: number
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
    options: ProductOption[],
    points: ProductPoint[]
}

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

export interface Comment {
    commentNo: string,
    content: string,
    createdDate: string,
    modifiedDate: string,
    createdBy: string
}

export interface ReviewImage {
    sequence: number,
    path: string,
    fullPath: string,
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
    isPayedPoint?: boolean,
    createdAt: string,
    images?: ReviewImage[],
    comments?: Comment[]
}

export interface ReviewResult {
    count: number,
    reviewList: Review[]
}