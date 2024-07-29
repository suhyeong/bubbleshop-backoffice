import {Flex, Input, Tag, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";

const tagInputStyle = {
    width: '40%',
    marginInlineEnd: 8,
    verticalAlign: 'top',
};

const AddProductOptionTag = ({type, options, setOptions}) => {
    const inputRef = useRef(null);
    const editInputRef = useRef(null);

    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // 수정 태그 index, value
    const [editOptionIndex, setEditOptionIndex] = useState(-1);
    const [editOptionValue, setEditOptionValue] = useState('');

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        editInputRef.current?.focus();
    }, [editOptionValue]);

    const deleteOption = (removedOption: string) => {
        const newOptions = options.filter((tag) => tag !== removedOption);
        setOptions(newOptions);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue && !options.includes(inputValue)) {
            setOptions([...options, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };
    const handleEditInputChange = (e) => {
        setEditOptionValue(e.target.value);
    };

    const handleDoubleClick = (e, index, tag) => {
        setEditOptionIndex(index);
        setEditOptionValue(tag);
        e.preventDefault();
    }

    const handleEditInputConfirm = () => {
        const newTags = [...options];
        newTags[editOptionIndex] = editOptionValue;
        setOptions(newTags);
        setEditOptionIndex(-1);
        setEditOptionValue('');
    };

    return (
        type === 'add' ? (
        <Flex wrap>
            {options.map((tag, index) => {
                if (editOptionIndex === index) {
                    return (
                        <Input
                            ref={editInputRef}
                            key={tag}
                            size="small"
                            style={tagInputStyle}
                            value={editOptionValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }
                const isLongTag = tag.length > 20;
                const tagElem = (
                    <Tag
                        key={tag}
                        color={index !== 0 ? 'default' : 'gold'}
                        closable={true}
                        style={{
                            userSelect: 'none',
                        }}
                        onClose={() => deleteOption(tag)}
                    >
            <span onDoubleClick={(e) => handleDoubleClick(e, index, tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <Tag icon={<PlusOutlined />} onClick={showInput}>
                    옵션 추가
                </Tag>
            )}
        </Flex>)
            : (<div />)
    );
}

export default AddProductOptionTag;