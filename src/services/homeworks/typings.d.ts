// @ts-ignore
/* eslint-disable */
declare namespace API {
  type HomeworkListItem = {
    key?: number;
    homeworkName: string;
    owner?: string;
    homeworkDesc?: string;
    progress?: number[];
    status: number;
    deadline: string;
    createdAt?: string;
  };

  type HomeworkList = {
    data?: HomeworkListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type fixHomeworkResult = {
    success: boolean;
    data: {
      key?: string;
    };
  };

  type HomeworkDataType = {
    key?: string;
    homeworkName: string;
    homeworkDesc?: string;
    deadline: string;
    status: string;
    steps: StepDataType[];
  };

  type StepDataType = {
    title: string;
    type: string;
    info?: UploadFilenameDataType[];
    text?: string;
    hint?: string;
    size?: number;
    ext?: string[];
    elements?: string[];
    filename?: Ifilename[];
  };

  type Ifilename = {
    id: string;
    content: string;
    color?: string;
  };

  type UploadFilenameDataType = {
    name: string;
    tooltip?: string;
    source?: string;
    check?: boolean;
    autoComplete?: boolean;
  };

  type RecordList = {
    data?: RecordListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type RecordListItem = {
    id: number;
    createAt: Date;
    steps: RecordStepItem[];
  };

  type RecordStepItem = {
    data?: Object;
    name?: string;
    submitAt: Date;
  };

  type FileUrlType = {
    name: string;
    url: string;
  };
}
