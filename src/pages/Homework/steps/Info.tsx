import React from 'react';
import {
  ProFormList,
  ProFormText,
  ProFormCheckbox,
  ProFormGroup,
  ProFormSelect,
} from '@ant-design/pro-form';
import { Button, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
interface Iprops {
  update: () => void;
}
const StepInfo: React.FC<Iprops> = (props: Iprops) => {
  return (
    <ProFormList
      name="info"
      label="信息收集内容"
      actionRender={(prop, action, defaultActionDom) => {
        return [
          <Button
            danger
            key={prop.key}
            onClick={() => {
              action.remove((defaultActionDom[0] as { _owner: { index: number } })._owner.index);
              props.update();
            }}
          >
            删除字段
          </Button>,
        ];
      }}
      itemRender={({ listDom, action }) => {
        return (
          <ProCard bordered style={{ marginBottom: 8 }}>
            {listDom}
            <div style={{ float: 'right', marginBottom: '-24px' }}>{action}</div>
          </ProCard>
        );
      }}
    >
      <ProFormGroup>
        <ProFormText
          name="name"
          label="名称"
          placeholder="请输入名称" // 增加多语言时一定要去改 Homework/index.jsx 的表单 onChange 源码
          rules={[{ required: true }]}
        />
        <ProFormText
          name="tooltip"
          label="名称提示"
          tooltip="像这条提示一样显示在名称右侧的问号中"
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormSelect
          name="source"
          label="数据来源表单"
          showSearch
          request={async () => [
            { label: '无数据来源', value: '无数据来源' },
            { label: 'B190303班学生名单', value: 'B190303班学生名单' },
            { label: 'Q190101班学生名单', value: 'Q190101班学生名单' },
          ]}
          initialValue="无数据来源"
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormCheckbox name="check" disabled>
          <Tooltip title="将会匹配数据来源表单中的数据">
            执行数据验证（<span style={{ color: 'deeppink' }}>功能暂未开放，在写了在写了</span>）
          </Tooltip>
        </ProFormCheckbox>
      </ProFormGroup>
      <ProFormGroup style={{ marginBottom: '-24px' }}>
        <ProFormCheckbox name="autoComplete">
          <Tooltip title="请确保数据来源表单已设置，否则勾选无效！">
            根据其他表单项自动填充（
            <span style={{ color: 'deeppink' }}>请避免为身份证等敏感数据勾选此项！</span>）
          </Tooltip>
        </ProFormCheckbox>
      </ProFormGroup>
    </ProFormList>
  );
};
export default StepInfo;
