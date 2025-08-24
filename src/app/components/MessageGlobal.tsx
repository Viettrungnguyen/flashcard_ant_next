import { App, message as antdMessage } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

let message: MessageInstance = antdMessage;

function MessageGlobal() {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  return null;
}

export { message };
export default MessageGlobal;
