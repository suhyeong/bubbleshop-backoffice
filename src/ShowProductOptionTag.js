import {Card, Flex, Input, InputNumber, Tag, Tooltip} from "antd";
import type {ProductOption} from "./CommonInterface";
import "./ShowProductDetail.css";
import React, {useEffect, useRef, useState} from "react";
import {CheckOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons";

const ShowProductOptionTag = ({options, setOptions}) => {
    const editInputRef = useRef(null);

    // 수정 태그 index, value
    const [editOptionIndex, setEditOptionIndex] = useState(-1);
    const [editOptionValue, setEditOptionValue] = useState('');

    const [defaultOptionSequence, setDefaultOptionSequence] = useState(1);

    useEffect(() => {
        const defaultOption = options.filter(option => option.isDefaultOption);
        if(defaultOption.length)
            setDefaultOptionSequence(options.filter(option => option.isDefaultOption)[0].sequence);
    }, [options]);

    const addNewOption = () => {
        const sequence = options.length + 1;
        const newOption: ProductOption = {
            sequence: sequence,
            name: '새옵션명은 더블클릭하여 변경해주세요!',
            stockCnt: 0,
            isDefaultOption: defaultOptionSequence === sequence,
        }
        setOptions([...options, newOption]);
    }

    const handleDoubleClick = (e, index, tag) => {
        setEditOptionIndex(index);
        setEditOptionValue(tag.name);
        e.preventDefault();
    }

    const handleDefaultOption = (e, index, tag) => {
        const beforeIndex = options.indexOf(options.filter(option => option.sequence === defaultOptionSequence)[0]);
        const newOptions = [...options];
        // 디폴트 옵션 시퀀스 변경 전 기존 디폴트 옵션을 false 로 변경
        newOptions[beforeIndex].isDefaultOption = false;
        newOptions[index].isDefaultOption = true;
        setDefaultOptionSequence(tag.sequence);
        setOptions(newOptions);
        e.preventDefault();
    }

    const handleEditInputChange = (e) => {
        setEditOptionValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...options];
        newTags[editOptionIndex].name = editOptionValue;
        setOptions(newTags);
        setEditOptionIndex(-1);
        setEditOptionValue('');
    };

    /**
     * 옵션 제거
     * 1. 기존 옵션 리스트에서 제거를 원하는 옵션을 filter 처리하여 뺀 새 옵션 리스트를 생성한다.
     * 2. 새 옵션 리스트의 길이가 0일 경우 디폴트 옵션 시퀀스를 1로 초기화한다.
     * 3. 제거한 옵션이 디폴트 옵션일 경우 디폴트 옵션 시퀀스를 1로 초기화한다.
     *  3-1. 새 옵션 리스트의 길이가 1 이상일 경우 첫번째 옵션을 디폴트 옵션으로 세팅한다.
     * 4. 리스트의 시퀀스를 순차적으로 재정렬한다.
     * @param removedOption
     */
    const deleteOption = (removedOption: ProductOption) => {
        const newOptions = options.filter((tag) => tag !== removedOption);
        if(!newOptions.length)
            setDefaultOptionSequence(1);
        if(removedOption.isDefaultOption) {
            setDefaultOptionSequence(1);
            if(newOptions.length)
                newOptions[0].isDefaultOption = true;
        }
        const finNewOptions = newOptions.map((item, index) => ({
            ...item,
            sequence: index + 1,
        }));
        setOptions(finNewOptions);
    };

    const getCardTitle = (data, index) => {
        const isLongTag = data.name.length > 20;
        const tagElem = (
            <Tag key={data.sequence} color={data.sequence === defaultOptionSequence ? 'gold' : 'default'}
                 style={{userSelect: 'none'}}>
                        <span onDoubleClick={(e) => handleDoubleClick(e, index, data)}>
                          {isLongTag ? `${data.name.slice(0, 20)}...` : data.name}
                        </span>
            </Tag>
        );
        return isLongTag ? (
            <Tooltip title={data.name} key={data.name}>
                {tagElem}
            </Tooltip>
        ) : (
            tagElem
        )
    }

    const changeOptionStockCount = (value, index) => {
        const newOptions = [...options];
        newOptions[index].stockCnt = value;
        setOptions(newOptions);
    }

    const getEditCardTitle = (option) => {
        return (
            <Input ref={editInputRef} key={option.sequence} type={'text'} size="small"
                   value={editOptionValue}
                   onChange={handleEditInputChange}
                   onBlur={handleEditInputConfirm}
                   onPressEnter={handleEditInputConfirm}
            />
        );
    }

    return (
        <Flex wrap gap={'middle'}>
            {
                options.map((option, index) => {
                    const data: ProductOption = option;

                    if (editOptionIndex === index) {
                        return (
                            <Card type='inner' className='product-detail-option-tag-card-content'
                                  key={data.sequence} title={getEditCardTitle(data)}>
                                <InputNumber type={'number'} defaultValue={data.stockCnt} onChange={(value) => changeOptionStockCount(value, index)}/>
                            </Card>
                        );
                    }

                    return <Card type='inner' className='product-detail-option-tag-card-content'
                                 key={data.sequence} title={getCardTitle(data, index)}
                                 actions={[
                                     <CheckOutlined key="editDefaultOption" onClick={(e) => handleDefaultOption(e, index, data)} />,
                                     <CloseOutlined key="delete" onClick={(e) => deleteOption(data)} />,
                                 ]}>
                        <InputNumber type={'number'} defaultValue={data.stockCnt} onChange={(value) => changeOptionStockCount(value, index)}/>
                    </Card>
                })
            }
            <Tag className='product-detail-option-add-tag' icon={<PlusOutlined />} onClick={addNewOption}>
                옵션 추가
            </Tag>
        </Flex>
    );
}

export default ShowProductOptionTag;