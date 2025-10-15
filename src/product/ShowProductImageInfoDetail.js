import ProductDetailImage from "./ProductDetailImage";
import React, {useEffect, useState} from "react";
import {Button, Spin} from "antd";
import type {ProductImage} from "../CommonInterface";
import axios from "axios";
import {getResult} from "../AxiosResponse";

const ShowProductImageInfoDetail = ({productCode, productImage}) => {

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
                uid: thumbImg[0].sequence,
                name: thumbImg[0].path,
                status: 'done',
                url: thumbImg[0].fullUrl
            }
            setThumbnailImage([file]);
        }
    }

    const defaultDetailFile = (prdImage) => {
        const detailImg: ProductImage[] = prdImage.filter(item => item.divCode === 'F');
        if(detailImg.length > 0) {
            const newDetailImages = detailImg.map((item, index) => ({
                uid: item.sequence,
                name: item.path,
                status: 'done',
                url: item.fullUrl
            }));
            setDetailImages(newDetailImages);
        }
    }

    const onSubmit =() => {
        let requestImgList = []; // Request Image List

        if(thumbnailImage.length > 0) {
            requestImgList = getNewOrOriginImageInfo(requestImgList, thumbnailImage[0], "T");
        }

        if(detailImages.length > 0) {
            detailImages.forEach(image => {
                requestImgList = getNewOrOriginImageInfo(requestImgList, image, "F");
            });
        }
        console.log("detailImages :::", detailImages);

        const request = {
            images: requestImgList
        }

        console.log(request);

        axios.put(`/product-proxy/product/v1/products/${productCode}/image`, request)
            .then(response => {
                getResult(response, "정상적으로 수정되었습니다.");
                window.close();
            })
            .catch(error => {
                console.error("데이터 저장시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "상품 정보 저장시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
            });
    }

    const getNewOrOriginImageInfo = (request, image, divCode) => {
        if(image.response) {
            //이미지 정보가 새로 변경된 이미지일 경우
            const newImg = {
                divCode: divCode,
                fileName: image.response.fileName
            }
            return [...request, newImg];
        } else {
            //기존에 이미 존재하던 이미지 정보일 경우
            const originImg = {
                divCode: divCode,
                fileName: image.name,
                sequence: image.uid,
            }
            return [...request, originImg];
        }
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