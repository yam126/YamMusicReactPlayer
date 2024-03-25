/**
 * 生成随机数
 * @param {最小值} min
 * @param {最大值} max
 * @returns 生成的随机数
 */
export const generateRandomNumber = (min, max) => {
  let result = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log('generateRandomNumber result', result);
  return result;
};

/**
 * 字符串左补位
 * @param {原始字符串} str
 * @param {补位长度} len
 * @param {补位的字符} charStr
 * @returns
 */
export const PadLeft = (str, len, charStr) => {
  var str = str + '';
  return new Array(len - str.length + 1).join(charStr || '') + str;
};

/**
 * 字符串右补位
 * @param {原始字符串} str
 * @param {补位长度} len
 * @param {补位的字符} charStr
 * @returns
 */
export const PadRight = (str, len, charStr) => {
  var str = str + '';
  console.log('PadRight ArrayLength', len - str.length + 1);
  return str + new Array(len - str.length + 1).join(charStr || '');
};

/**
 * 转换后的时长
 * @param {原始时长} duration
 * @returns
 */
export const formatDuration = duration => {
  var hour = parseInt(parseFloat(duration / 3600), 10);
  var minute = parseInt(parseFloat((duration % 3600) / 60), 10);
  var second = parseInt(parseFloat(duration % 60), 10);
  return {
    hour: PadLeft(hour.toString(), 2, '0'),
    minute: PadLeft(minute.toString(), 2, '0'),
    second: PadLeft(second.toString(), 2, '0'),
  };
};

/**
 * 获取一定范围内的随机数
 * @param {最小值} min
 * @param {最大值} max
 * @returns
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min); //向上取整
  max = Math.floor(max); //向下取整
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 字节单位转换
 * @param {原始字节} bytes
 * @returns
 */
export const convertBytesToSize = bytes => {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};
