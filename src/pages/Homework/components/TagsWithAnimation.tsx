import React, { useEffect, useRef, useState } from 'react';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';
import { Tag, Input } from 'antd';
import type { InputRef } from 'antd';

interface Iprops {
  prev_data: () => API.UploadFilenameDataType[];
  addTag: (p: string, color: string) => void;
  value?: string[];
  onChange?: <T>(p: T) => void;
}

const TagsWithAnimation: React.FC<Iprops> = (props: Iprops) => {
  const { value = ['+', '-', '作业'], onChange } = props;
  const [tags, setTags] = useState<string[]>(value);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const saveInputRef = useRef<InputRef>(null);
  const onChangeRef = useRef(onChange);

  const handleClose = (removedTag: string) => {
    const _tags = tags.filter((tag) => tag !== removedTag);
    setTags(_tags);
    onChange!(_tags);
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      saveInputRef.current?.focus();
    });
  };
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let _tags = tags;
    if (inputValue && _tags.indexOf(inputValue) === -1) {
      _tags = [..._tags, inputValue];
    }
    setTags(_tags);
    onChange!(_tags);
    setInputVisible(false);
    setInputValue('');
  };

  useEffect(() => {
    onChangeRef.current!(tags);
  }, [onChangeRef, tags]);

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
        color="orange"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          props.addTag(tag, 'orange');
        }}
      >
        <span style={{ paddingRight: '5px' }}>{tag}</span>
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block', marginTop: '5px', marginBottom: '5px' }}>
        {tagElem}
      </span>
    );
  };

  const testMap = (tag: API.UploadFilenameDataType) => {
    const tagElem = (
      <Tag
        color="cyan"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          props.addTag(tag.name, 'cyan');
        }}
      >
        {tag.name}
      </Tag>
    );
    return (
      tag.name && (
        <span
          key={tag.name}
          style={{ display: 'inline-block', marginTop: '5px', marginBottom: '5px' }}
        >
          {tagElem}
        </span>
      )
    );
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <TweenOneGroup
        enter={{
          scale: 0.8,
          opacity: 0,
          type: 'from',
          duration: 100,
        }}
        onEnd={(e) => {
          if (e.type === 'appear' || e.type === 'enter') {
            (e.target as HTMLElement).style.display = 'inline-block';
          }
        }}
        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
        appear={false}
      >
        {props.prev_data()?.map(testMap)}
        {tags?.map(forMap)}
        {inputVisible && (
          <Input
            ref={saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOutlined /> 新建连接符
          </Tag>
        )}
      </TweenOneGroup>
    </div>
  );
};
export default TagsWithAnimation;
