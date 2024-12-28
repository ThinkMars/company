import { createStyles } from 'antd-style'

/**
 * @description: 样式
 * @param {*}
 * @return {*}
 * @example
 *
 * const { layout, menu, conversations, chat, messages, placeholder, sender } = useStyle();
 */
export const useStyle = createStyles(({ token, css }) => ({
  layout: css`
    width: 100vw;
    height: 100vh;
    min-width: 800px;
    display: flex;
    background: ${token.colorBgContainer};
    font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    position: relative;
    overflow: hidden;
    border-radius: 0;

    .ant-modal-root {
      position: absolute;
    }

    .ant-prompts {
      color: ${token.colorText};
    }

    @media (max-width: 1200px) {
      min-width: 600px;
    }
  `,
  menu: css`
    background: ${token.colorBgLayout}80;
    width: 280px;
    min-width: 280px;
    height: 100%;
    display: flex;
    flex-direction: column;

    @media (max-width: 1200px) {
      width: 240px;
      min-width: 240px;
    }
  `,
  rightContent: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  `,
  chatHeader: css`
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    background: ${token.colorBgContainer};
  `,
  chat: css`
    flex: 1;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: auto;

    @media (max-width: 1400px) {
      max-width: 800px;
    }

    @media (max-width: 1200px) {
      max-width: 600px;
      padding: ${token.padding}px;
    }
  `,
  chatContainer: css`
    flex: 1;
    margin-left: 280px;
    height: 100%;
    padding-top: 64px;
    overflow: auto;

    @media (max-width: 1200px) {
      margin-left: 240px;
    }
  `,
  conversations: css`
    padding: 0 12px;
    flex: 1;
    overflow-y: auto;
  `,
  messages: css`
    flex: 1;
    max-width: 100%;
    overflow-y: auto;

    .ant-x-bubble {
      max-width: 88%;

      @media (max-width: 1200px) {
        max-width: 85%;
      }
    }
  `,
  placeholder: css`
    padding-top: 32px;
  `,
  sender: css`
    box-shadow: ${token.boxShadow};
  `,
  logo: css`
    display: flex;
    height: 72px;
    align-items: center;
    justify-content: start;
    padding: 0 24px;
    box-sizing: border-box;

    img {
      width: 24px;
      height: 24px;
      display: inline-block;
    }

    span {
      display: inline-block;
      margin: 0 8px;
      font-weight: bold;
      color: ${token.colorText};
      font-size: 16px;
    }
  `,
  addBtn: css`
    background: #1677ff0f;
    border: 1px solid #1677ff34;
    width: calc(100% - 24px);
    margin: 0 12px 24px 12px;
  `,
}))
