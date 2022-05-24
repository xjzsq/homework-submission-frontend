import React, { useRef } from 'react';
import { Form } from 'antd';
import {
  ProFormGroup,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import TagsWithAnimation from '../components/TagsWithAnimation';
import DragDropFilename from '../components/DragDropFilename';
import type { FormListFieldData } from 'antd/lib/form/FormList';

interface IDragDropFilenameRef {
  addTag: (id: string, content: string, color?: string) => void;
  divRef: HTMLDivElement;
}

interface Iprops {
  fieldData: FormListFieldData;
  index: number;
  data: API.StepDataType[];
}

const StepUpload: React.FC<Iprops> = (props: Iprops) => {
  const dragDropFilenameRef = useRef<IDragDropFilenameRef>(null);
  return (
    <>
      <ProFormText
        name="text"
        label="上传说明"
        tooltip="显示在上传按钮中央，字号较大"
        rules={[{ required: true, message: '请输入上传说明' }]}
      />
      <ProFormText
        name="hint"
        label="上传提示"
        tooltip="显示在上传说明的下方，为灰色字体，字号较小"
      />
      <ProFormGroup>
        <ProFormDigit
          name="size"
          label="文件大小限制"
          width="xs"
          addonAfter="MB"
          min={1}
          max={2048}
          fieldProps={{
            precision: 0,
          }}
        />
        <ProFormSelect
          name="ext"
          label="允许上传的文件扩展名"
          mode="multiple"
          valueEnum={{
            '.doc': '.doc',
            '.docx': '.docx',
            '.pdf': '.pdf',
            '.zip': '.zip',
            '.rar': '.rar',
            '.txt': '.txt',
            '.jpg': '.jpg',
            '.png': '.png',
            // '.jpeg': '.jpeg',
            // '.gif': '.gif',
            // '.bmp': '.bmp',
            // '.webp': '.webp',
            // '.mp4': '.mp4',
            // '.mp3': '.mp3',
            // '.avi': '.avi',
            // '.flv': '.flv',
            // '.wmv': '.wmv',
            // '.mov': '.mov',
            // '.3gp': '.3gp',
            // '.mkv': '.mkv',
            // '.ts': '.ts',
            // '.m4v': '.m4v',
            // '.m4a': '.m4a',
            // '.aac': '.aac',
            // '.wav': '.wav',
            // '.ogg': '.ogg',
            // '.flac': '.flac',
            // '.xls': '.xls',
            // '.xlsx': '.xlsx',
            // '.ppt': '.ppt',
            // '.pptx': '.pptx',
          }}
          rules={[{ required: true, message: '请选择支持上传的文件扩展名' }]}
        />
      </ProFormGroup>
      <Form.Item
        label="文件命名可选组成"
        name={[props.fieldData.name, 'elements']}
        tooltip="点击下方标签可将其插入公式中"
      >
        <TagsWithAnimation
          prev_data={() => {
            let data: API.UploadFilenameDataType[] = [];
            for (let i = 0; i < props.index; i++) {
              if (i >= props.data.length) break;
              if (props.data[i].type === 'info') {
                data = [...data, ...props.data[i].info!];
              }
            }
            return data;
          }}
          addTag={(tag: string, color: string) => {
            dragDropFilenameRef.current?.addTag(Math.random().toString(36).slice(-8), tag, color);
          }}
        />
      </Form.Item>
      <Form.Item label="文件命名公式" name={[props.fieldData.name, 'filename']}>
        <DragDropFilename ref={dragDropFilenameRef} />
      </Form.Item>
      <ProFormDependency name={['filename', 'ext']}>
        {({ filename, ext }) => (
          <ProFormText>
            当前文件名：
            {filename?.map((item: API.Ifilename) => `${item.content}`)}(
            {ext?.map((item: string, index: number) => (index == 0 ? `${item}` : `/${item}`))})
          </ProFormText>
        )}
      </ProFormDependency>
    </>
  );
};
export default StepUpload;
