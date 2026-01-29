import React, {useState} from "react";
import type {UploadProps} from "antd";
import {Button, Descriptions, Image, message, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {getBase64} from "../CommonConst";

const ProductDetailImage = ({type,
                                thumbnailImageFile, setThumbnailImageFile,
                                detailImageFiles, setDetailImageFiles}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const thumbnailImageProp: UploadProps = {
        action: '/product-proxy/product/v1/products/temp-image',
        listType: 'picture',
        maxCount: 1,
        fileList: thumbnailImageFile,
        onRemove: (file) => {
            setThumbnailImageFile([]);
        },
        onChange: ({ file , fileList}) => {
            const updatedFileList = fileList.map(item => {
                // 새로 업로드 완료된 파일만 수정
                if (item.response && item.status === 'done') {
                    return {
                        ...item,
                        name: item.response.fileName,
                    };
                }
                // 기존 파일은 그대로 반환
                return item;
            });
            setThumbnailImageFile(updatedFileList);
        },
        beforeUpload: (file) => {
            if(thumbnailImageFile.length >= 1) {
                message.error('썸네일 이미지는 1개만 올릴 수 있습니다. 이미지 삭제 후 재시도해주세요!');
                return Upload.LIST_IGNORE;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return true;
        },
    };

    const detailImageProp: UploadProps = {
        action: '/product-proxy/product/v1/products/temp-image',
        listType: 'picture',
        maxCount: 10,
        fileList: detailImageFiles,
        onRemove: (file) => {
            const index = detailImageFiles.indexOf(file);
            const newFileList = detailImageFiles.slice();
            newFileList.splice(index, 1);
            setDetailImageFiles(newFileList);
        },
        onChange: ({ file , fileList}) => {
            const updatedFileList = fileList.map(item => {
                // 새로 업로드 완료된 파일만 수정
                if (item.response && item.status === 'done') {
                    return {
                        ...item,
                        name: item.response.fileName,
                    };
                }
                // 기존 파일은 그대로 반환
                return item;
            });
            setDetailImageFiles(updatedFileList);
        },
        beforeUpload: (file) => {
            if(detailImageFiles.length >= 10) {
                message.error('상세 이미지는 10개만 올릴 수 있습니다. 이미지 삭제 후 재시도해주세요!');
                return Upload.LIST_IGNORE;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return true;
        },
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    return (
        <>
        <Descriptions layout={"vertical"} title={type === 'add' ? '이미지 정보' : ''} bordered>
            <Descriptions.Item span={3} label='썸네일 이미지'>
                <Upload {...thumbnailImageProp} onPreview={handlePreview} >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Descriptions.Item>
            <Descriptions.Item span={3} label='상세 이미지'>
                <Upload {...detailImageProp} onPreview={handlePreview}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Descriptions.Item>
        </Descriptions>
        {previewImage && (
            <Image wrapperStyle={{display: 'none'}}
                   preview={{
                       visible: previewOpen,
                       onVisibleChange: (visible) => setPreviewOpen(visible),
                       afterOpenChange: (visible) => !visible && setPreviewImage('')}}
                   src={previewImage} />
        )}
        </>
    );
}

export default ProductDetailImage;