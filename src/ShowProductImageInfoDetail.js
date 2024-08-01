import ProductDetailImage from "./ProductDetailImage";
import React, {useEffect, useState} from "react";
import {Button, Spin} from "antd";
import type {ProductImage} from "./CommonInterface";

const ShowProductImageInfoDetail = ({productImage}) => {

    // 썸네일 이미지
    const [thumbnailImage, setThumbnailImage] = useState([]);
    // 상세 이미지
    const [detailImages, setDetailImages] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        defaultThumbnailFile(productImage);
        defaultDetailFile(productImage);
        setLoading(false);
    }, [productImage]);

    const defaultThumbnailFile = (prdImage) => {
        const thumbImg: ProductImage[] = prdImage.filter(item => item.divCode === 'T');
        if(thumbImg.length > 0) {
            const file = {
                uid: 0,
                name: thumbImg[0].path,
                status: 'done',
                url: thumbImg[0].fullUrl
            }
            console.log(file);
            setThumbnailImage([file]);
        }
    }

    const defaultDetailFile = (prdImage) => {
        const detailImg: ProductImage[] = prdImage.filter(item => item.divCode === 'F');
        if(detailImg.length > 0) {
            const newDetailImages = detailImg.map((item, index) => ({
                uid: index+1,
                name: item.path,
                status: 'done',
                url: item.fullUrl
            }));
            console.log(newDetailImages);
            setDetailImages(newDetailImages);
        }
    }

    const onSubmit =() => {
        console.log(thumbnailImage);
        console.log(detailImages);
    }

    return (
        <div>
            <Spin spinning={loading} tip="Loading" size="middle">
                {
                    !loading &&
                        <>
                            <ProductDetailImage type={'detail'} thumbnailImageFile={thumbnailImage} setThumbnailImageFile={setThumbnailImage}
                                                detailImageFiles={detailImages} setDetailImageFiles={setDetailImages} />
                            <div className="product-detail-save-button">
                            <Button type="primary" onClick={onSubmit}>이미지정보 수정</Button>
                            </div>
                        </>
                }
            </Spin>
        </div>
    );
}

export default ShowProductImageInfoDetail;