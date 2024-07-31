import ProductDetailImage from "./ProductDetailImage";
import React, {useEffect} from "react";

const ShowProductImageInfoDetail = ({thumbnailImage, setThumbnailImage,
                                        detailImages, setDetailImages}) => {
    useEffect(() => {
        console.log(thumbnailImage);
        console.log(detailImages);
    }, [thumbnailImage, detailImages]);

    return (
        <div>
            {
                <ProductDetailImage type={'detail'} thumbnailImageFile={thumbnailImage} setThumbnailImageFile={setThumbnailImage}
                                    detailImageFiles={detailImages} setDetailImageFiles={setDetailImages} />
            }
        </div>
    );
}

export default ShowProductImageInfoDetail;