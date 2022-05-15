import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage, useRequest } from 'umi';
import { message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-table';
import { record, queryHomework, getFileUrl, getLastFileUrls } from '@/services/homeworks/api';
import DownloadDrawer from './components/DownloadDrawer';

interface IDownloadDrawerRef {
  reset: (item: API.FileUrlType[]) => void;
  openModal: () => void;
}

const RecordList: React.FC<Record<string, any>> = (prop) => {
  const intl = useIntl();
  const actionRef = useRef();
  const downloadDrawerRef = useRef<IDownloadDrawerRef>();
  const [columns, setColumns] = useState<ProColumns<any>[]>([]);
  const { loading: loadingColumns, data: dataColumn } = useRequest(
    () => {
      return prop.location.query.no ? queryHomework({ key: prop.location.query.no }) : false;
    },
    {
      onSuccess: (data) => {
        const _columns: any[] = [
          {
            title: <FormattedMessage id="pages.homeworklist.id" defaultMessage="编号" />,
            dataIndex: 'id',
            sorter: true,
            valueType: 'textarea',
          },
          {
            title: <FormattedMessage id="pages.recordlist.createAt" defaultMessage="首次打开" />,
            dataIndex: 'createAt',
            sorter: true,
            search: false,
            valueType: 'textarea',
          },
          {
            title: <FormattedMessage id="pages.recordlist.endAt" defaultMessage="完成时间" />,
            dataIndex: 'endAt',
            sorter: true,
            search: false,
            valueType: 'textarea',
          },
        ];
        data.steps.map((item, idx) => {
          if (item.type == 'info') {
            item.info?.map((info) => {
              _columns.push({
                title: info.name,
                dataIndex: info.name,
                valueType: 'textarea',
              });
            });
          } else if (item.type == 'upload') {
            _columns.push({
              title: `文件（${item.title}）`,
              dataIndex: `file-${idx}`,
              valueType: 'textarea',
              search: false,
            });
          }
        });
        _columns.push({
          title: <FormattedMessage id="pages.recordlist.isComplete" defaultMessage="是否完成" />,
          dataIndex: 'isComplete',
          filters: true,
          search: false,
          valueType: 'textarea',
          valueEnum: {
            否: {
              text: <FormattedMessage id="pages.recordlist.isCompleteFalse" defaultMessage="否" />,
            },
            是: {
              text: <FormattedMessage id="pages.recordlist.isCompleteTrue" defaultMessage="是" />,
            },
          },
        });
        _columns.push({
          title: <FormattedMessage id="pages.recordlist.isLast" defaultMessage="最后提交" />,
          dataIndex: 'isLast',
          filters: true,
          search: false,
          valueType: 'textarea',
          valueEnum: {
            否: {
              text: <FormattedMessage id="pages.recordlist.isLastFalse" defaultMessage="否" />,
            },
            是: {
              text: <FormattedMessage id="pages.recordlist.isLastTrue" defaultMessage="是" />,
            },
          },
        });
        setColumns(_columns);
      },
    },
  );

  return (
    <PageContainer>
      <ProTable
        headerTitle={
          dataColumn?.homeworkName +
          ' ' +
          intl.formatMessage({
            id: 'pages.record.title',
            defaultMessage: '提交记录',
          }) +
          '（若列表为空，请点击查询按钮）'
        }
        loading={loadingColumns}
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          return (
            <Space size={16}>
              <a
                onClick={() => {
                  message.info('在做了在做了');
                  console.log(selectedRows, selectedRowKeys);
                }}
              >
                打包下载选中行的文件
              </a>
              <a onClick={onCleanSelected}>取消选择</a>
            </Space>
          );
        }}
        toolBarRender={() => {
          return [
            <a
              onClick={async () => {
                const res = await getLastFileUrls(prop.location.query.no);
                if (res.success) {
                  downloadDrawerRef.current!.reset(res.data);
                  downloadDrawerRef.current!.openModal();
                } else {
                  message.error(res.errorMessage || '未知错误');
                  console.error(res);
                }
              }}
            >
              <FormattedMessage
                id="pages.recordlist.downloadAllLastFiles"
                defaultMessage="打包下载全部最后提交的文件"
              />
            </a>,
          ];
        }}
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async (...args) => {
          const res = await record(prop.location.query.no, ...args);
          const _res = { success: true, data: [] as any[] };
          res.data!.map((data) => {
            const _data: any = {
              id: data.id,
              createAt: moment(data.createAt).format('YYYY-MM-DD HH:mm:ss'),
            };
            let _isLast = true,
              _canPush = true;
            data.steps.map((item, idx) => {
              if ('name' in item) {
                _data[`file-${idx}`] = (
                  <a
                    onClick={async () => {
                      const file = await getFileUrl(
                        prop.location.query.no,
                        data.id,
                        idx,
                        item.name!,
                      );
                      if (file.success) {
                        window.open(file.data);
                      } else {
                        message.error('文件未找到，请重新刷新列表重试');
                      }
                    }}
                  >
                    {item.name}
                  </a>
                );
                if (item.name?.includes('.hssbak')) {
                  _isLast = false;
                }
              } else if ('data' in item) {
                for (const key in item.data) {
                  _data[key] = item.data[key];
                  if (
                    key in args[0] &&
                    args[0][key] !== '' &&
                    !item.data[key].toLowerCase().includes(args[0][key].toLowerCase())
                  ) {
                    _canPush = false;
                    break;
                  }
                }
              }
              if (dataColumn?.steps.length == idx + 1) {
                _data.endAt = moment(item.submitAt).format('YYYY-MM-DD HH:mm:ss');
              }
            });
            for (const key in args[0]) {
              if (key == 'current' || key == 'pageSize') continue;
              if (args[0][key] !== '' && !(key in _data)) {
                _canPush = false;
                break;
              }
            }
            if (!_canPush) return; // 如果有一个条件不符合，就直接跳过
            const _isComplete = dataColumn?.steps.length == data.steps.length;
            _data.isComplete = _isComplete ? '是' : '否';
            _data.isLast = _isComplete && _isLast ? '是' : '否';
            _res.data.push(_data);
          });
          if (args[2] && args[2].isComplete) {
            // filter: isComplete
            _res.data = _res.data.filter((item) => {
              return args[2].isComplete!.indexOf(item.isComplete) > -1;
            });
          }
          if (args[2] && args[2].isLast) {
            // filter: isLast
            _res.data = _res.data.filter((item) => {
              return args[2].isLast!.indexOf(item.isLast) > -1;
            });
          }
          if (args[1] && args[1].toString() != '{}') {
            // sort
            for (const key in args[1]) {
              _res.data.sort((a, b) => {
                if (a[key] && b[key]) {
                  return (args[1][key] === 'ascend' ? a[key] < b[key] : a[key] > b[key]) ? -1 : 1;
                } else if (a[key]) {
                  return -1;
                } else {
                  return 1;
                }
              });
            }
          }
          return _res;
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) =>
            intl.formatMessage(
              {
                id: 'pages.record.total',
                defaultMessage: '共 {total} 条记录',
              },
              { total },
            ),
        }}
      />
      <DownloadDrawer ref={downloadDrawerRef} />
    </PageContainer>
  );
};

export default RecordList;
