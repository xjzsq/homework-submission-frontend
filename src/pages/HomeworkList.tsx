import React, { useState, useRef } from 'react';
import { history, useIntl, FormattedMessage } from 'umi';
import { Button, message, Drawer, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { homework } from '@/services/homeworks/api';

const HomeworkList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.HomeworkListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<API.HomeworkListItem[]>([]);

  const intl = useIntl();

  const generateRender = (record: API.HomeworkListItem) => {
    return [
      <a
        key="edit"
        onClick={() => {
          history.push('/homework?no=' + record?.key);
        }}
      >
        <FormattedMessage id="pages.homeworkList.edit" defaultMessage="编辑" />
      </a>,
      <a
        key="record"
        onClick={() => {
          history.push('/record?no=' + record?.key);
        }}
      >
        <FormattedMessage id="pages.homeworkList.record" defaultMessage="查看记录" />
      </a>,
    ];
  };

  const columns: ProColumns<API.HomeworkListItem>[] = [
    {
      title: <FormattedMessage id="pages.homeworklist.id" defaultMessage="编号" />,
      dataIndex: 'key',
      sorter: true,
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.homeworklist.name" defaultMessage="作业名称" />,
      dataIndex: 'homeworkName',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="描述" />,
      dataIndex: 'homeworkDesc',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.homeworklist.progress" defaultMessage="提交进度" />,
      dataIndex: 'progress',
      search: false,
      renderText: (progress: number[]) => `${progress[0]}/${progress[1]}`,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="状态" />,
      dataIndex: 'status',
      filters: true,
      search: false,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.homeworklist.nameStatus.default" defaultMessage="未开始" />
          ),
          status: 'default',
        },
        1: {
          text: (
            <FormattedMessage
              id="pages.homeworklist.nameStatus.submitting"
              defaultMessage="提交中"
            />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.homeworklist.nameStatus.done" defaultMessage="已完成" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage id="pages.homeworklist.nameStatus.closed" defaultMessage="已截止" />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.homeworklist.titleDeadline" defaultMessage="截止日期" />,
      sorter: true,
      search: false,
      dataIndex: 'deadline',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => generateRender(record),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.HomeworkListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.homeworklist.title',
          defaultMessage: '作业列表',
        })}
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('/homework');
            }}
          >
            <PlusOutlined />
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={homework}
        columns={columns}
      />
      <Drawer
        height={screen.height * 0.6}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={intl.formatMessage({
          id: 'pages.homeworklist.modal.title',
          defaultMessage: '作业概览',
        })}
        visible={showDetail}
        closable={true}
        onClose={() => setShowDetail(false)}
        placement={'bottom'}
      >
        <PageContainer
          header={{
            title: null,
            breadcrumb: {},
          }}
        >
          {currentRow?.homeworkName && (
            <ProDescriptions<API.HomeworkListItem>
              title={currentRow?.homeworkName}
              column={document.body.clientWidth > 532 ? 2 : 1}
              request={async () => ({
                data:
                  { ...currentRow, list: ['奈芙莲', '珂朵莉', '威廉', '艾露可', '莉艾尔'] } || {},
              })}
              params={{
                id: currentRow?.homeworkName,
              }}
              columns={
                [
                  ...columns,
                  {
                    title: (
                      <FormattedMessage
                        id="pages.homeworklist.list.quickActions"
                        defaultMessage="快捷操作"
                      />
                    ),
                    renderText: (text, record) => (
                      <Space>
                        {`${record?.status}` === '0' ? (
                          <a
                            key="openSubmit"
                            onClick={() => {
                              setCurrentRow(record);
                            }}
                            style={{ color: 'lime' }}
                          >
                            <FormattedMessage
                              id="pages.homeworkList.openSubmit"
                              defaultMessage="开放提交"
                            />
                          </a>
                        ) : (
                          <></>
                        )}
                        {`${record?.status}` === '2' || `${record?.status}` === '1' ? (
                          <a
                            key="closeSubmit"
                            onClick={() => {
                              setCurrentRow(record);
                            }}
                            style={{ color: 'red' }}
                          >
                            <FormattedMessage
                              id="pages.homeworkList.closeSubmit"
                              defaultMessage="停止提交"
                            />
                          </a>
                        ) : (
                          <></>
                        )}
                        {`${record?.status}` === '3' ? (
                          <a
                            key="reopenSubmit"
                            onClick={() => {
                              setCurrentRow(record);
                            }}
                          >
                            <FormattedMessage
                              id="pages.homeworkList.reopenSubmit"
                              defaultMessage="重新开放"
                            />
                          </a>
                        ) : (
                          <></>
                        )}
                        {`${record?.status}` === '0' || `${record?.status}` === '1' ? (
                          <a
                            key="sendAlert"
                            onClick={() => {
                              message.error(intl.formatMessage({ id: 'app.dev' }));
                              setCurrentRow(record);
                            }}
                            style={{ color: 'gray' }}
                          >
                            <FormattedMessage
                              id="pages.homeworkList.sendAlert"
                              defaultMessage="发送提醒"
                            />
                          </a>
                        ) : (
                          <></>
                        )}
                        <Space />
                        {`${record?.status}` === '2' || `${record?.status}` === '3' ? (
                          <a
                            key="download"
                            onClick={() => {
                              setCurrentRow(record);
                            }}
                          >
                            <FormattedMessage
                              id="pages.homeworkList.download"
                              defaultMessage="快速下载"
                            />
                          </a>
                        ) : (
                          <></>
                        )}
                      </Space>
                    ),
                  },
                  {
                    title: (
                      <FormattedMessage id="pages.homeworklist.list" defaultMessage="未完成名单" />
                    ),
                    dataIndex: 'list',
                    search: false,
                    renderText: (list: string[]) => (
                      <Space>
                        {list.map((item: string) => (
                          <span>{item}</span>
                        ))}
                      </Space>
                    ),
                  },
                ] as ProDescriptionsItemProps<API.HomeworkListItem>[]
              }
            />
          )}
        </PageContainer>
      </Drawer>
    </PageContainer>
  );
};

export default HomeworkList;

// (`${record?.status}` === '0') ? (
//                 <a
//                     key="openSubmit"
//                     onClick={() => {
//                         setCurrentRow(record);
//                     }}
//                     style={{ color: 'lime' }}
//                 >
//                     <FormattedMessage
//                         id="pages.homeworkList.openSubmit"
//                         defaultMessage="开放提交"
//                     />
//                 </a>
//             ) : <></>,
//             (`${record?.status}` === '2' || `${record?.status}` === '1') ? (
//                 <a
//                     key="closeSubmit"
//                     onClick={() => {
//                         setCurrentRow(record);
//                     }}
//                     style={{ color: 'red' }}
//                 >
//                     <FormattedMessage
//                         id="pages.homeworkList.closeSubmit"
//                         defaultMessage="停止提交"
//                     />
//                 </a>
//             ) : <></>,
//             (`${record?.status}` === '3') ? (
//                 <a
//                     key="reopenSubmit"
//                     onClick={() => {
//                         setCurrentRow(record);
//                     }}
//                 >
//                     <FormattedMessage
//                         id="pages.homeworkList.reopenSubmit"
//                         defaultMessage="重新开放"
//                     />
//                 </a>
//             ) : <></>,
//             (`${record?.status}` === '0' || `${record?.status}` === '1') ? (
//                 <a
//                     key="sendAlert"
//                     onClick={() => {
//                         message.error(intl.formatMessage({ id: 'app.dev' }));
//                         setCurrentRow(record);
//                     }}
//                     style={{ color: 'gray' }}
//                 >
//                     <FormattedMessage
//                         id="pages.homeworkList.sendAlert"
//                         defaultMessage="发送提醒"
//                     />
//                 </a>
//             ) : <></>,
//             (`${record?.status}` === '2' || `${record?.status}` === '3') ? (
//                 <a
//                     key="download"
//                     onClick={() => {
//                         setCurrentRow(record);
//                     }}
//                 >
//                     <FormattedMessage
//                         id="pages.homeworkList.download"
//                         defaultMessage="快速下载"
//                     />
//                 </a>
//             ) : <></>,
