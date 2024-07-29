import React, {useEffect, useState} from "react";
import type {UploadProps} from "antd";
import {Button, Descriptions, Image, message, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";


const ProductDetailImage = ({type,
                                thumbnailImageFile, setThumbnailImageFile,
                                detailImageFiles, setDetailImageFiles}) => {

    const thumbnailImageProp: UploadProps = {
        action: '/product-proxy/product/v1/products/temp-image',
        listType: 'picture',
        maxCount: 1,
        defaultFileList: thumbnailImageFile !== '' ? [thumbnailImageFile] : thumbnailImageFile,
        onRemove: (file) => {
            setThumbnailImageFile('');
        },
        beforeUpload: (file) => {
            if(thumbnailImageFile !== '') {
                message.error('썸네일 이미지는 1개만 올릴 수 있습니다. 이미지 삭제 후 재시도해주세요!');
                return Upload.LIST_IGNORE;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            setThumbnailImageFile(file);
            return true;
        },
        thumbnailImageFile,
    };

    const detailImageProp: UploadProps = {
        action: '/product-proxy/product/v1/products/temp-image',
        listType: 'picture',
        maxCount: 10,
        defaultFileList: detailImageFiles,
        onRemove: (file) => {
            const index = detailImageFiles.indexOf(file);
            const newFileList = detailImageFiles.slice();
            newFileList.splice(index, 1);
            setDetailImageFiles(newFileList);
        },
        beforeUpload: (file) => {
            if(detailImageFiles.length >= 10) {
                message.error('상세 이미지는 10개만 올릴 수 있습니다. 이미지 삭제 후 재시도해주세요!');
                return Upload.LIST_IGNORE;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            setDetailImageFiles([...detailImageFiles, file]);
            return true;
        },
        detailImageFiles,
    };

    return (
        <Descriptions layout={"vertical"} title={type === 'add' ? '이미지 정보' : ''} bordered>
            <Descriptions.Item span={3} label='썸네일 이미지'>
                <Upload {...thumbnailImageProp} >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Descriptions.Item>
            <Descriptions.Item span={3} label='상세 이미지'>
                <Upload {...detailImageProp} >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Descriptions.Item>
        </Descriptions>
    );
}

export default ProductDetailImage;