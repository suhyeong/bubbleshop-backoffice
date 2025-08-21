import {Card, Flex, InputNumber, Select, Tag} from "antd";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import type {ProductPoint} from "../CommonInterface";
import {ProductPointType} from "../CommonConst";

const ShowProductPointTag = ({points, setPoints}) => {
    const productPointType = ProductPointType();

    // 추가 가능한 포인트 타입 리스트
    const [availableAddPointType, setAvailableAddPointType] = useState([]);

    // 포인트 지급 유형 정보가 변경될때 마다 추가 가능한 포인트 타입 리스트 변경
    useEffect(() => {
        setAvailableAddPointType(productPointType.filter((item) =>
            points && !points.some(point => point.pointTypeCode === item.code)));
    }, [productPointType, points]);

    const addNewPoint = () => {
        const sequence = points.length + 1;
        const newOption: ProductPoint = {
            sequence: sequence,
            pointTypeCode: '',
            savePoint: 0,
        }
        setPoints([...points, newOption]);
    }

    const deleteOption = (index) => {
        const newPoints = points.filter((item, itemIndex) => itemIndex !== index);
        setPoints(newPoints);
    };

    const changeSavePoint = (value, index) => {
        const newPoints = [...points];
        newPoints[index].savePoint = value;
        setPoints(newPoints);
    }

    const changePointType = (value, index) => {
        const newPoints = [...points];
        newPoints[index].pointTypeCode = value;
        setPoints(newPoints);
    }

    const getCardTitle = (data, index) => {
        const type = productPointType.find((type) => type.code === data.pointTypeCode);
        console.log(type);
        return (
            <Select
                placeholder={"포인트 유형을 선택해주세요"}
                optionFilterProp="label"
                options={availableAddPointType.map((type) => ({ label: type.desc, value: type.code }))}
                value={type && type.code}
                labelRender={props => cardTitleLabelRender(props, type)}
                onChange={value => changePointType(value, index)}
            />
        )
    }

    const cardTitleLabelRender = (props, value) => {
        return value ? value.desc : '';
    };

    return (
        <Flex wrap gap={'middle'}>
            {
                points &&
                (points.map((point, index) => {
                    const data: ProductPoint = point;

                    return <Card type='inner' className='product-detail-point-type-tag-card-content'
                          key={data.pointTypeCode} title={getCardTitle(data, index)}
                          actions={[
                              <CloseOutlined key="delete" onClick={(e) => deleteOption(index)} />,
                          ]}>
                        <InputNumber type={'number'} defaultValue={data.savePoint} min={0} onChange={(value) => changeSavePoint(value, index)}/>
                    </Card>
                }))
            }
            {
                points && points.length < productPointType.length ?
                    (<Tag className='product-detail-point-type-add-tag' icon={<PlusOutlined />} onClick={addNewPoint}>
                        포인트 지급 유형 추가
                    </Tag>) : (<></>)
            }
        </Flex>
    )
}

export default ShowProductPointTag;