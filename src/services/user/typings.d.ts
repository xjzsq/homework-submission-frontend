// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    username?: string;
    avatar?: string;
    email?: string;
    notifyCount?: number;
    unreadCount?: number;
    access?: string;
    authority?: string;
  };

  type LoginResult = {
    success: boolean;
    data: {
      status?: string;
      type?: string;
      currentAuthority?: string;
      jwt?: string;
    };
  };
  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type CheckUsernameParams = {
    username: string;
  };

  type RegisterParams = {
    email: string;
    username: string;
    invite: string;
    password: string;
  };

  type PasswordRegisterParams = {
    email: string;
    username: string;
    invite: string;
    password: string;
  };

  type AuthRegisterParams = {
    email: string;
    username: string;
    invite: string;
  };

  type TokenCheckParams = {
    username: string;
    token: string;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
