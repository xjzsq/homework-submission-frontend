import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Drawer, message, Progress } from 'antd';
const axios = require('axios').default;
const JSZip = require('jszip');
const FileSaver = require('file-saver');

const DownloadDrawer: React.ForwardRefExoticComponent<any & React.RefAttributes<unknown>> =
  forwardRef((props: any, ref: any) => {
    const [visible, setVisible] = useState(false);
    const [files, setFiles] = useState<API.FileUrlType[]>([]);
    const [current, setCurrent] = useState(0);
    // 请求文件资源
    const getFile = useCallback((url: string) => {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url,
          responseType: 'blob',
        })
          .then((data: any) => {
            resolve(data.data);
          })
          .catch((err: Error) => {
            reject(err.toString());
          });
      });
    }, []);
    // 批量下载
    const patchDownload = useCallback(
      async (file: API.FileUrlType[]) => {
        const zip = new JSZip();
        const promises: Promise<any>[] = [];
        file.forEach((item) => {
          const promise = getFile(item.url).then((data: any) => {
            zip.file(item.name, data, { binary: true });
            setCurrent((x) => x + 1);
          });
          promises.push(promise);
        });
        Promise.all(promises).then(() => {
          zip
            .generateAsync({ type: 'blob' })
            .then((content: any) => {
              FileSaver.saveAs(content, 'test.zip');
            })
            .catch((err: Error) => {
              console.error(err);
              message.error('下载失败' + err.message);
            });
        });
      },
      [getFile],
    );
    useImperativeHandle(ref, () => ({
      openModal: () => {
        setVisible(true);
      },
      reset: (item: API.FileUrlType[]) => {
        setFiles(item);
        setCurrent(0);
        patchDownload(item);
      },
    }));
    return (
      <Drawer
        title="下载进度"
        placement="bottom"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        height={300}
        width={300}
      >
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Progress percent={parseFloat(((current * 100) / files.length).toFixed(2)) || 0} />
          {current} / {files.length}
        </div>
      </Drawer>
    );
  });

export default DownloadDrawer;
