import { message } from 'antd';
const notificaiton = () => {
};

notificaiton.errror = (msg) => {
  message.error({
    content: `${msg}`,
  });
};
notificaiton.success = (msg) => {
  message.success({
    content: `${msg}`,
  });
};
notificaiton.warn = (msg) => {
  message.warning({
    content: `${msg}`,
  });
};

export default notificaiton;
