import React, { useRef, useState } from 'react';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { history, useRequest } from 'umi';
import { addHomework, updateHomework, queryHomework } from '@/services/homeworks/api';
import { message, Card, Result, Button, Descriptions, Divider, Tooltip, Spin } from 'antd';
import { SnippetsOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  ProFormGroup,
  ProFormList,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDateTimePicker,
  StepsForm,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import StepInfo from './steps/Info';
import StepUpload from './steps/Upload';
import type { FormInstance } from 'antd';
import type { FormListFieldData } from 'antd/lib/form/FormList';
import './index.css';

export interface HomeworkDataType {
  homeworkName: string;
  homeworkDesc?: string;
  deadline: string;
  status: string;
}

export interface StepsDataType {
  steps: API.StepDataType[];
}

const Homework: React.FC<Record<string, any>> = (prop) => {
  const [homeworkData, setHomeworkData] = useState<HomeworkDataType>({
    homeworkName: '作业',
    deadline: moment().format('YYYY-MM-DD HH:mm:ss'),
    status: '0',
  });
  const { data: preData, loading: loadingPreData } = useRequest(
    () => {
      return prop.location.query.no ? queryHomework({ key: prop.location.query.no }) : false;
    },
    {
      onSuccess: (res) => {
        if (res === undefined) {
          message.error('作业不存在或无权限');
          history.push('/homeworklist');
        }
      },
    },
  );
  const [no, setNo] = useState<string>(prop.location.query.no || '0');
  const [current, setCurrent] = useState(0);
  const formRef = useRef<FormInstance>();
  const contentRef = useRef<FormInstance>();
  const [stepsData, setStepsData] = useState<StepsDataType>({
    steps: [
      {
        title: '填写学号姓名',
        type: 'info',
        info: [
          {
            name: '学号',
          },
          {
            name: '姓名',
          },
        ],
      },
      {
        title: '上传作业压缩包',
        type: 'upload',
        text: '点击上传作业压缩包或拖拽作业压缩包到此框内',
        hint: '请上传.zip/.rar格式压缩包，谢谢！',
        size: 10,
        ext: ['.zip', '.rar'],
        elements: ['+', '-', '作业'],
        filename: [
          { id: 'item-0', content: '作业', color: 'orange' },
          { id: 'item-1', content: '-', color: 'orange' },
          { id: 'item-2', content: '学号', color: 'cyan' },
          { id: 'item-3', content: '-', color: 'orange' },
          { id: 'item-4', content: '姓名', color: 'cyan' },
        ],
      },
    ],
  });
  const update = () => {
    setStepsData(contentRef.current?.getFieldsValue());
  };
  if (loadingPreData) {
    return (
      <PageContainer
        title={prop.location.query.no ? '编辑作业' : '新建作业'}
        style={{ textAlign: 'center' }}
      >
        <Spin size={'large'} style={{ marginTop: '30px' }} />
      </PageContainer>
    );
  }
  return (
    <PageContainer title={prop.location.query.no ? '编辑作业' : '新建作业'}>
      <Card bordered={false}>
        <StepsForm
          current={current}
          onCurrentChange={setCurrent}
          submitter={{
            render: (props, dom) => {
              if (props.step === 1) {
                return [
                  dom[0],
                  <Button type="primary" key="next" onClick={() => props.onSubmit?.()}>
                    {prop.location.query.no ? `保存` : `保存并创建`}
                  </Button>,
                ];
              }
              if (props.step === 2) {
                return null;
              }
              return dom;
            },
          }}
          stepsProps={{ responsive: true }}
        >
          <StepsForm.StepForm<HomeworkDataType>
            formRef={formRef}
            title="作业信息"
            initialValues={
              prop.location.query.no
                ? {
                    homeworkName: preData?.homeworkName,
                    homeworkDesc: preData?.homeworkDesc,
                    deadline: preData?.deadline,
                    status: preData?.status,
                  }
                : homeworkData
            }
            onFinish={async (values: HomeworkDataType) => {
              setHomeworkData(values);
              return true;
            }}
          >
            <ProFormText
              label="作业名称"
              name="homeworkName"
              rules={[{ required: true, message: '请输入作业名称' }]}
              placeholder="请输入作业名称"
            />
            <ProFormTextArea
              label="作业描述"
              name="homeworkDesc"
              rules={[{ required: false, message: '请输入描述' }]}
              placeholder="请输入描述"
            />
            <ProFormDateTimePicker
              label="截止时间"
              name="deadline"
              rules={[{ required: true }]}
              placeholder="请输入作业提交截止时间"
            />
            <ProFormSelect
              label="状态设置"
              name="status"
              rules={[{ required: false, message: '请选择当前状态' }]}
              valueEnum={{
                '0': '未开始',
                '1': '提交中',
                '2': '已完成',
                '3': '已截止',
              }}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm<StepsDataType>
            formRef={contentRef}
            title="提交内容"
            initialValues={prop.location.query.no ? { steps: preData?.steps } : stepsData}
            onChange={async (e) => {
              if ((e.target as HTMLInputElement).placeholder === '请输入名称') {
                e.target.removeEventListener('blur', update, false);
                e.target.addEventListener('blur', update, false);
              }
            }}
            onFinish={async (e) => {
              setStepsData(e);
              if (no === '0') {
                const res = await addHomework({ ...homeworkData, ...e });
                if (res && res.success) {
                  setNo(res.data.key!);
                  return true;
                } else {
                  message.error('创建失败');
                  return false;
                }
              } else {
                const res = await updateHomework({ key: no, ...homeworkData, ...e });
                if (res && res.success) {
                  return true;
                } else {
                  message.error('更新失败');
                  return false;
                }
              }
            }}
          >
            <ProFormList
              name="steps"
              creatorButtonProps={{
                creatorButtonText: '增加步骤',
              }}
              copyIconProps={{
                tooltipText: '复制此步骤到末尾',
              }}
              deleteIconProps={{
                tooltipText: '删除此步骤',
              }}
              itemRender={({ listDom, action }, { record }) => {
                return (
                  <ProCard
                    bordered
                    extra={action}
                    title={record?.title}
                    style={{ marginBottom: 8 }}
                  >
                    {listDom}
                  </ProCard>
                );
              }}
            >
              <ProFormGroup>
                <ProFormText
                  name="title"
                  label="步骤标题"
                  rules={[{ required: true, message: '请填写步骤标题' }]}
                />
                <ProFormSelect
                  name="type"
                  label="步骤类型"
                  valueEnum={{
                    info: '信息收集',
                    upload: '单文件上传',
                    uploads: { text: '多文件上传', disabled: true },
                  }}
                  rules={[{ required: true, message: '请选择步骤类型' }]}
                />
              </ProFormGroup>
              {(f: FormListFieldData, index: number) => {
                return (
                  <ProFormDependency name={['type']}>
                    {({ type }) => {
                      if (type === 'info') return <StepInfo update={update} />;
                      if (type === 'upload')
                        return <StepUpload fieldData={f} index={index} data={stepsData.steps} />;
                      return <></>;
                    }}
                  </ProFormDependency>
                );
              }}
            </ProFormList>
          </StepsForm.StepForm>
          <StepsForm.StepForm title="完成">
            <Result
              status="success"
              title={(prop.location.query.no ? '修改' : '创建') + '成功'}
              subTitle="复制下方链接提交"
              extra={<Button onClick={() => history.push('/homeworklist')}>返回作业列表</Button>}
              style={{
                maxWidth: '560px',
                margin: '0 auto',
                padding: '24px 0 8px',
              }}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="作业名称"> {homeworkData.homeworkName}</Descriptions.Item>
                <Descriptions.Item label="提交链接" contentStyle={{ display: 'inline-block' }}>
                  <a id="url" href={`https://u.d1.fan/${no}`} target="_blank">
                    https://u.d1.fan/{no}
                  </a>
                  <CopyToClipboard
                    text={`https://u.d1.fan/${no}`}
                    onCopy={() => message.success('复制成功~')}
                  >
                    <Tooltip title="复制链接">
                      <Button type="text" size="small" icon={<SnippetsOutlined />} />
                    </Tooltip>
                  </CopyToClipboard>
                </Descriptions.Item>
              </Descriptions>
            </Result>
          </StepsForm.StepForm>
        </StepsForm>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div>
          <h3>说明</h3>
          <h4>填写信息</h4>
          <p>表单内填写内容创建后均可修改。</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Homework;
