import type {UploadFile} from "antd";
import ProductDetailImage from "./ProductDetailImage";
import React, {useEffect, useState} from "react";
import {ProductImage} from "./CommonInterface";

const ShowProductImageInfoDetail = ({productImage, form,
                                        thumbnailImage, setThumbnailImage,
                                        detailImages, setDetailImages}) => {
    useEffect(() => {
        const prdImage: ProductImage[] = productImage;
        defaultThumbnailFile(prdImage);
        defaultDetailFile(prdImage);
    }, [productImage, thumbnailImage, detailImages]);

    const defaultThumbnailFile = (prdImage) => {
        const thumbImg: ProductImage[] = prdImage.filter(item => item.divCode === 'T');
        if(thumbImg.length > 0) {
            const file: UploadFile = {
                uid: 0,
                name: thumbImg[0].path,
                status: 'done',
                url: thumbImg[0].fullUrl
            }
            setThumbnailImage(file);
        }
    }

    const defaultDetailFile = (prdImage) => {
        const detailImg: ProductImage[] = prdImage.filter(item => item.divCode === 'F');
        if(detailImg.length > 0) {
            const newDetailImages: UploadFile[] = detailImg.map((item, index) => ({
                uid: index+1,
                name: item.path,
                status: 'done',
                url: item.fullUrl
            }));
            setDetailImages(newDetailImages);
        }
    }

    return (
        <div>
            {thumbnailImage && detailImages && <ProductDetailImage type={'detail'} thumbnailImageFile={thumbnailImage} setThumbnailImageFile={setThumbnailImage}
                                detailImageFiles={detailImages} setDetailImageFiles={setDetailImages} />}
        </div>
    );
}

export default ShowProductImageInfoDetail;