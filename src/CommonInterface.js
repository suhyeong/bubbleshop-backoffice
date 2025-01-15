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