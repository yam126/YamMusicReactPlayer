using System.Data.OracleClient;
using System.Data.SqlTypes;
using System.Data;
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Text;

namespace PublicLibrary
{
    public enum DateInterval
    {
        Year,
        Month,
        Weekday,
        Day,
        Hour,
        Minute,
        Second,
        WeekOfYear
    }

    public class Utils
    {
        #region 系统版本
        /// <summary>
        /// 版本信息类
        /// </summary>
        public class VersionInfo
        {
            public int FileMajorPart
            {
                get { return 2; }
            }
            public int FileMinorPart
            {
                get { return 1; }
            }
            public int FileBuildPart
            {
                get { return 0; }
            }
            public string ProductName
            {
                get { return "HISCMP"; }
            }
            public int ProductType
            {
                get { return 0; }
            }
        }
        public static string GetVersion()
        {
            return "1.0";
        }
        #endregion

        #region 对象转换处理
        /// <summary>
        /// 判断对象是否为Int32类型的数字
        /// </summary>
        /// <param name="Expression"></param>
        /// <returns></returns>
        public static bool IsNumeric(object expression)
        {
            if (expression != null)
                return IsNumeric(expression.ToString());

            return false;

        }

        /// <summary>
        /// 判断对象是否为Int32类型的数字
        /// </summary>
        /// <param name="Expression"></param>
        /// <returns></returns>
        public static bool IsNumeric(string expression)
        {
            if (expression != null)
            {
                string str = expression;
                if (str.Length > 0 && str.Length <= 11 && Regex.IsMatch(str, @"^[-]?[0-9]*[.]?[0-9]*$"))
                {
                    if ((str.Length < 10) || (str.Length == 10 && str[0] == '1') || (str.Length == 11 && str[0] == '-' && str[1] == '1'))
                        return true;
                }
            }
            return false;
        }

        /// <summary>
        /// 是否为Double类型
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        public static bool IsDouble(object expression)
        {
            if (expression != null)
                return Regex.IsMatch(expression.ToString(), @"^([0-9])[0-9]*(\.\w*)?$");

            return false;
        }


        /// <summary>
        /// 正则验证是否合法Email地址
        /// </summary>
        /// <param name="expression">待验证字符串</param>
        /// <returns>是否Email地址</returns>
        public static bool IsEmail(string expression)
        {
            if (!string.IsNullOrEmpty(expression))
                return Regex.IsMatch(expression, @"^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$");

            return false;
        }

        /// <summary>
        /// 正则验证是否合法IP地址
        /// </summary>
        /// <param name="expression">待验证字符串</param>
        /// <returns>是否IP地址</returns>
        public static bool IsIPAddress(string expression)
        {
            if (!string.IsNullOrEmpty(expression))
                return Regex.IsMatch(expression, @"\d+\.\d+\.\d+\.\d+");

            return false;
        }

        /// <summary>
        /// 正则验证是否合法域名(不带http://)
        /// </summary>
        /// <param name="expression">待验证字符串</param>
        /// <returns>是否合法域名</returns>
        public static bool IsHostDomain(string expression)
        {
            if (!string.IsNullOrEmpty(expression))
                return Regex.IsMatch(expression, @"^([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$");

            return false;
        }

        /// <summary>
        /// 正则匹配URL地址
        /// </summary>
        /// <param name="expression">URL地址</param>
        /// <returns>是否URL地址</returns>
        public static bool IsUrlAddress(string expression)
        {
            string Pattern = @"^(http|https|ftp|ftps)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&$%\$#\=~])*$";
            Regex r = new Regex(Pattern);
            Match m = r.Match(expression);
            if (m.Success)
                return true;
            return false;
        }

        /// <summary>
        /// 将字符串转换为数组
        /// </summary>
        /// <param name="str">字符串</param>
        /// <returns>字符串数组</returns>
        public static string[] GetStrArray(string str)
        {
            return str.Split(new char[',']);
        }

        /// <summary>
        /// 将数组转换为字符串
        /// </summary>
        /// <param name="list">List</param>
        /// <param name="speater">分隔符</param>
        /// <returns>String</returns>
        public static string GetArrayStr(List<string> list, string speater)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < list.Count; i++)
            {
                if (i == list.Count - 1)
                {
                    sb.Append(list[i]);
                }
                else
                {
                    sb.Append(list[i]);
                    sb.Append(speater);
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// object型转换为bool型
        /// </summary>
        /// <param name="strValue">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的bool类型结果</returns>
        public static bool StrToBool(object expression, bool defValue)
        {
            if (expression != null)
                return StrToBool(expression, defValue);

            return defValue;
        }

        /// <summary>
        /// string型转换为bool型
        /// </summary>
        /// <param name="strValue">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的bool类型结果</returns>
        public static bool StrToBool(string expression, bool defValue)
        {
            if (expression != null)
            {
                if (string.Compare(expression, "true", true) == 0)
                    return true;
                else if (string.Compare(expression, "false", true) == 0)
                    return false;
                if (string.Compare(expression, "0", true) == 0)
                    return false;
                if (string.Compare(expression, "1", true) == 0)
                    return true;
            }
            return defValue;
        }

        /// <summary>
        /// string型转换为bool型
        /// </summary>
        /// <param name="expression">要转换的字符串</param>
        /// <returns>转换后的bool类型结果</returns>
        public static bool StrToBool(string expression)
        {
            try
            {
                bool temp = true;
                if (expression != null)
                {
                    if (string.Compare(expression, "true", true) == 0)
                        temp = true;
                    else if (string.Compare(expression, "false", true) == 0)
                    {
                        temp = false;
                    }
                    if (string.Compare(expression, "0", true) == 0)
                        temp = false;
                    if (string.Compare(expression, "1", true) == 0)
                        temp = true;
                }
                return temp;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message.ToString());
            }
        }

        /// <summary>
        /// 将对象转换为Int32类型
        /// </summary>
        /// <param name="expression">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static int ObjToInt(object expression, int defValue)
        {
            if (expression != null)
                return StrToInt(expression.ToString(), defValue);

            return defValue;
        }

        /// <summary>
        /// 去除前导0
        /// </summary>
        /// <param name="value">要去前导0的字符串</param>
        /// <returns>去除后的字符串</returns>
        public static string RemovePreambleZero(string value)
        {
            string result = string.Empty;
            double t = 0;
            if (double.TryParse(value, out t))
                result = Convert.ToDouble(value).ToString();
            else
                result = value;
            return result;
        }

        /// <summary>
        /// 将字符串转换为Int32类型
        /// </summary>
        /// <param name="expression">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static int StrToInt(string expression, int defValue)
        {
            if (string.IsNullOrEmpty(expression) || expression.Trim().Length >= 11 || !Regex.IsMatch(expression.Trim(), @"^([-]|[0-9])[0-9]*(\.\w*)?$"))
                return defValue;

            int rv;
            if (Int32.TryParse(expression, out rv))
                return rv;

            return Convert.ToInt32(StrToFloat(expression, defValue));
        }


        /// <summary>
        /// Object型转换为decimal型
        /// </summary>
        /// <param name="strValue">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的decimal类型结果</returns>
        public static decimal ObjToDecimal(object expression, decimal defValue)
        {
            if (expression != null)
                return StrToDecimal(expression.ToString(), defValue);

            return defValue;
        }

        /// <summary>
        /// string型转换为decimal型
        /// </summary>
        /// <param name="strValue">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的decimal类型结果</returns>
        public static decimal StrToDecimal(string expression, decimal defValue)
        {
            if ((expression == null) || (expression.Length > 18))
                return defValue;

            decimal intValue = defValue;
            if (expression != null)
            {
                bool IsDecimal = Regex.IsMatch(expression, @"^([-]|[0-9])[0-9]*(\.\w*)?$");
                if (IsDecimal)
                    decimal.TryParse(expression, out intValue);
            }
            return intValue;
        }

        /// <summary>
        /// Object型转换为float型
        /// </summary>
        /// <param name="strValue">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static float ObjToFloat(object expression, float defValue)
        {
            if (expression != null)
                return StrToFloat(expression.ToString(), defValue);

            return defValue;
        }

        /// <summary>
        /// string型转换为float型
        /// </summary>
        /// <param name="strValue">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static float StrToFloat(string expression, float defValue)
        {
            if ((expression == null) || (expression.Length > 10))
                return defValue;

            float intValue = defValue;
            if (expression != null)
            {
                bool IsFloat = Regex.IsMatch(expression, @"^([-]|[0-9])[0-9]*(\.\w*)?$");
                if (IsFloat)
                    float.TryParse(expression, out intValue);
            }
            return intValue;
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime StrToDateTime(string str, DateTime defValue)
        {
            if (!string.IsNullOrEmpty(str))
            {
                DateTime dateTime;
                if (DateTime.TryParse(str, out dateTime))
                    return dateTime;
            }
            return defValue;
        }
        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的DateTime?类型结果</returns>
        public static DateTime? StrToDateTime2(object str)
        {
            DateTime? dt = null;
            try
            {
                DateTime tempdt = DateTime.MinValue;
                if (DateTime.TryParse(str.ToString(), out tempdt))
                {
                    dt = tempdt;
                }
            }
            catch
            {
            }
            return dt;
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime StrToDateTime(object str)
        {
            DateTime dt = (DateTime)SqlDateTime.MinValue;
            try
            {
                dt = StrToDateTime(str.ToString(), dt);
            }
            catch
            {
            }
            return dt;
        }

        /// <summary>
        /// 将日期时间转换为MM/dd/yyyy格式的字符串
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static string StrToDateTimeENStr(object str)
        {
            string result = string.Empty;
            DateTime dt = (DateTime)SqlDateTime.MinValue;
            try
            {
                dt = StrToDateTime(str.ToString(), dt);
                result = dt.Month.ToString("00") + "/" + dt.Day.ToString("00") + "/" + dt.Year.ToString("0000");
            }
            catch
            {
                result = dt.Month.ToString("00") + "/" + dt.Day.ToString("00") + "/" + dt.Year.ToString("0000");
            }
            return result;
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime StrToDateTime(DataRow dr, string FieldName, string DateFormat)
        {
            DateTime dt = (DateTime)SqlDateTime.MinValue;
            if (Convert.IsDBNull(dr[FieldName]))
                return dt;
            bool iscomplate = DateTime.TryParseExact(dr[FieldName].ToString(), DateFormat, Thread.CurrentThread.CurrentCulture, DateTimeStyles.AssumeUniversal, out dt);
            if (!iscomplate)
            {
                iscomplate = DateTime.TryParseExact(dr[FieldName].ToString(), "yyyy-MM-dd", Thread.CurrentThread.CurrentCulture, DateTimeStyles.AssumeUniversal, out dt);
                if (!iscomplate)
                {
                    iscomplate = DateTime.TryParse(dr[FieldName].ToString(), out dt);
                    if (!iscomplate)
                        dt = (DateTime)SqlDateTime.MinValue;
                }
            }
            return dt;
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime StrToDateTime(string str, string DateFormat)
        {
            DateTime dt = (DateTime)SqlDateTime.MinValue;
            if (string.IsNullOrEmpty(str))
                return dt;
            bool iscomplate = DateTime.TryParseExact(str, DateFormat, Thread.CurrentThread.CurrentCulture, DateTimeStyles.AssumeUniversal, out dt);
            if (!iscomplate)
            {
                iscomplate = DateTime.TryParseExact(str, "yyyy-MM-dd", Thread.CurrentThread.CurrentCulture, DateTimeStyles.AssumeUniversal, out dt);
                if (!iscomplate)
                {
                    iscomplate = DateTime.TryParse(str, out dt);
                    if (!iscomplate)
                        dt = (DateTime)SqlDateTime.MinValue;
                }
            }
            return dt;
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime StrToDateTime1(string str, string DateFormat)
        {
            DateTime dt = (DateTime)SqlDateTime.MinValue;
            if (string.IsNullOrEmpty(str))
                return dt;
            bool iscomplate = DateTime.TryParseExact(str, DateFormat, Thread.CurrentThread.CurrentCulture, DateTimeStyles.AssumeUniversal, out dt);
            if (!iscomplate)
            {
                iscomplate = DateTime.TryParseExact(str, "yyyy-MM-dd", Thread.CurrentThread.CurrentCulture, DateTimeStyles.AssumeUniversal, out dt);
                if (!iscomplate)
                {
                    iscomplate = DateTime.TryParse(str, out dt);
                    if (!iscomplate)
                        dt = (DateTime)SqlDateTime.MinValue;
                }
            }
            return dt;
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime StrToDateTime2(string str, string DateFormat)
        {
            DateTime dt = (DateTime)SqlDateTime.MinValue;
            if (string.IsNullOrEmpty(str))
                return dt;
            bool iscomplate = DateTime.TryParseExact(str, DateFormat, System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out dt);
            if (!iscomplate)
            {
                iscomplate = DateTime.TryParseExact(str, DateFormat, System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out dt);
                if (!iscomplate)
                {
                    iscomplate = DateTime.TryParse(str, out dt);
                    if (!iscomplate)
                        dt = (DateTime)SqlDateTime.MinValue;
                }
            }
            return dt;
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime StrToDateTimeByOracle(object str)
        {
            DateTime dt = (DateTime)OracleDateTime.MinValue;
            try
            {
                dt = StrToDateTime(str.ToString(), dt);
            }
            catch
            {
            }
            return dt;
        }

        /// <summary>
        /// 正则取出字符串中的数字
        /// </summary>
        /// <param name="str">字符串</param>
        /// <returns>数字</returns>
        public static double GetStringNumberByRegular(string str)
        {
            double result = 0;
            Match m = Regex.Match(str, "\\d+(\\.\\d+){0,1}");
            double.TryParse(m.Groups[0].ToString(), out result);
            return result;
        }
        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="obj">要转换的对象</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime ObjectToDateTime(object obj)
        {
            return StrToDateTime(obj.ToString());
        }

        /// <summary>
        /// 将对象转换为日期时间类型
        /// </summary>
        /// <param name="obj">要转换的对象</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static DateTime ObjectToDateTime(object obj, DateTime defValue)
        {
            return StrToDateTime(obj.ToString(), defValue);
        }

        /// <summary>
        /// 将对象转换为字符串
        /// </summary>
        /// <param name="obj">要转换的对象</param>
        /// <returns>转换后的string类型结果</returns>
        public static string ObjectToStr(object obj)
        {
            if (obj == null)
                return "";
            return obj.ToString().Trim();
        }

        /// <summary>
        /// 计算文件大小函数(保留两位小数),Size为字节大小
        /// </summary>
        /// <param name="size">初始文件大小</param>
        /// <returns>转换后的字符串</returns>
        public static string GetFileSize(long size)
        {
            var num = 1024.00; //byte

            if (size < num)
                return size + "B";
            if (size < Math.Pow(num, 2))
                return (size / num).ToString("f2") + "K"; //kb
            if (size < Math.Pow(num, 3))
                return (size / Math.Pow(num, 2)).ToString("f2") + "M"; //M
            if (size < Math.Pow(num, 4))
                return (size / Math.Pow(num, 3)).ToString("f2") + "G"; //G

            return (size / Math.Pow(num, 4)).ToString("f2") + "T"; //T
        }

        /// <summary>
        /// 将对象转换为字符串
        /// </summary>
        /// <param name="obj">要转换的对象</param>
        /// <returns>转换后的string类型结果</returns>
        public static Guid ObjectToGuid(object obj)
        {
            if (obj == null || string.IsNullOrEmpty(obj.ToString()))
                return new Guid();
            return new Guid(obj.ToString());
        }
        #endregion

        #region 分割字符串
        /// <summary>
        /// 分割字符串
        /// </summary>
        public static string[] SplitString(string strContent, string strSplit)
        {
            if (!string.IsNullOrEmpty(strContent))
            {
                if (strContent.IndexOf(strSplit) < 0)
                    return new string[] { strContent };

                return Regex.Split(strContent, Regex.Escape(strSplit), RegexOptions.IgnoreCase);
            }
            else
                return new string[0] { };
        }

        /// <summary>
        /// 分割字符串
        /// </summary>
        /// <returns></returns>
        public static string[] SplitString(string strContent, string strSplit, int count)
        {
            string[] result = new string[count];
            string[] splited = SplitString(strContent, strSplit);

            for (int i = 0; i < count; i++)
            {
                if (i < splited.Length)
                    result[i] = splited[i];
                else
                    result[i] = string.Empty;
            }

            return result;
        }
        #endregion

        #region 删除最后结尾的一个逗号
        /// <summary>
        /// 删除最后结尾的一个逗号
        /// </summary>
        public static string DelLastComma(string str)
        {
            return str.Substring(0, str.LastIndexOf(","));
        }
        #endregion

        #region 删除最后结尾的指定字符后的字符
        /// <summary>
        /// 删除最后结尾的指定字符后的字符
        /// </summary>
        public static string DelLastChar(string str, string strchar)
        {
            if (string.IsNullOrEmpty(str))
                return "";
            if (str.LastIndexOf(strchar) >= 0 && str.LastIndexOf(strchar) == str.Length - 1)
            {
                return str.Substring(0, str.LastIndexOf(strchar));
            }
            return str;
        }
        #endregion

        #region 生成指定长度的字符串
        /// <summary>
        /// 生成指定长度的字符串,即生成strLong个str字符串
        /// </summary>
        /// <param name="strLong">生成的长度</param>
        /// <param name="str">以str生成字符串</param>
        /// <returns></returns>
        public static string StringOfChar(int strLong, string str)
        {
            string ReturnStr = "";
            for (int i = 0; i < strLong; i++)
            {
                ReturnStr += str;
            }

            return ReturnStr;
        }
        #endregion

        #region 生成日期随机码
        /// <summary>
        /// 生成日期随机码
        /// </summary>
        /// <returns></returns>
        public static string GetRamCode()
        {
            #region
            return DateTime.Now.ToString("yyyyMMddHHmmssffff");
            #endregion
        }
        #endregion

        #region 生成随机字母或数字
        /// <summary>
        /// 生成随机数字
        /// </summary>
        /// <param name="length">生成长度</param>
        /// <returns></returns>
        public static string Number(int Length)
        {
            return Number(Length, false);
        }

        /// <summary>
        /// 生成随机数字
        /// </summary>
        /// <param name="Length">生成长度</param>
        /// <param name="Sleep">是否要在生成前将当前线程阻止以避免重复</param>
        /// <returns></returns>
        public static string Number(int Length, bool Sleep)
        {
            if (Sleep)
                System.Threading.Thread.Sleep(3);
            string result = "";
            System.Random random = new Random();
            for (int i = 0; i < Length; i++)
            {
                result += random.Next(10).ToString();
            }
            return result;
        }

        /// <summary>
        /// 生成指定范围中的一个随机数
        /// </summary>
        /// <param name="Length">生成范围</param>
        /// <returns>随机数</returns>
        public static int MarkRandomNumber(int Length)
        {
            int result = 1;
            System.Random random = new Random();
            try
            {
                result = random.Next(1, Length);
            }
            catch (Exception exp)
            {
                result = 1;
            }
            return result;
        }
        /// <summary>
        /// 生成随机字母字符串(数字字母混和)
        /// </summary>
        /// <param name="codeCount">待生成的位数</param>
        public static string GetCheckCode(int codeCount)
        {
            string str = string.Empty;
            int rep = 0;
            long num2 = DateTime.Now.Ticks + rep;
            rep++;
            Random random = new Random(((int)(((ulong)num2) & 0xffffffffL)) | ((int)(num2 >> rep)));
            for (int i = 0; i < codeCount; i++)
            {
                char ch;
                int num = random.Next();
                if ((num % 2) == 0)
                {
                    ch = (char)(0x30 + ((ushort)(num % 10)));
                }
                else
                {
                    ch = (char)(0x41 + ((ushort)(num % 0x1a)));
                }
                str = str + ch.ToString();
            }
            return str;
        }
        /// <summary>
        /// 根据日期和随机码生成订单号
        /// </summary>
        /// <returns></returns>
        public static string GetOrderNumber()
        {
            string num = DateTime.Now.ToString("yyMMddHHmmss");//yyyyMMddHHmmssms
            return num + Number(2).ToString();
        }
        private static int Next(int numSeeds, int length)
        {
            byte[] buffer = new byte[length];
            System.Security.Cryptography.RNGCryptoServiceProvider Gen = new System.Security.Cryptography.RNGCryptoServiceProvider();
            Gen.GetBytes(buffer);
            uint randomResult = 0x0;//这里用uint作为生成的随机数  
            for (int i = 0; i < length; i++)
            {
                randomResult |= ((uint)buffer[i] << ((length - 1 - i) * 8));
            }
            return (int)(randomResult % numSeeds);
        }
        #endregion

        #region 截取字符长度
        /// <summary>
        /// 截取字符长度
        /// </summary>
        /// <param name="inputString">字符</param>
        /// <param name="len">长度</param>
        /// <returns></returns>
        public static string CutString(string inputString, int len)
        {
            if (string.IsNullOrEmpty(inputString))
                return "";
            inputString = DropHTML(inputString);
            ASCIIEncoding ascii = new ASCIIEncoding();
            int tempLen = 0;
            string tempString = "";
            byte[] s = ascii.GetBytes(inputString);
            for (int i = 0; i < s.Length; i++)
            {
                if ((int)s[i] == 63)
                {
                    tempLen += 2;
                }
                else
                {
                    tempLen += 1;
                }

                try
                {
                    tempString += inputString.Substring(i, 1);
                }
                catch
                {
                    break;
                }

                if (tempLen > len)
                    break;
            }
            //如果截过则加上半个省略号 
            byte[] mybyte = System.Text.Encoding.Default.GetBytes(inputString);
            if (mybyte.Length > len)
                tempString += "…";
            return tempString;
        }
        #endregion

        #region 清除HTML标记
        public static string DropHTML(string Htmlstring)
        {
            if (string.IsNullOrEmpty(Htmlstring)) return "";
            //删除脚本  
            Htmlstring = Regex.Replace(Htmlstring, @"<script[^>]*?>.*?</script>", "", RegexOptions.IgnoreCase);
            //删除HTML  
            Htmlstring = Regex.Replace(Htmlstring, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"([\r\n])[\s]+", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"-->", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"<!--.*", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(quot|#34);", "\"", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(amp|#38);", "&", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(lt|#60);", "<", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(gt|#62);", ">", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(nbsp|#160);", " ", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(iexcl|#161);", "\xa1", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(cent|#162);", "\xa2", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(pound|#163);", "\xa3", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(copy|#169);", "\xa9", RegexOptions.IgnoreCase);

            Htmlstring = Regex.Replace(Htmlstring, @"&#(\d+);", "", RegexOptions.IgnoreCase);
            Htmlstring.Replace("<", "");
            Htmlstring.Replace(">", "");
            Htmlstring.Replace("\r\n", "");
            Htmlstring = WebUtility.HtmlEncode(Htmlstring).Trim();
            return Htmlstring;
        }
        #endregion

        #region 清除HTML标记且返回相应的长度
        public static string DropHTML(string Htmlstring, int strLen)
        {
            return CutString(DropHTML(Htmlstring), strLen);
        }
        #endregion

        #region TXT代码转换成HTML格式
        /// <summary>
        /// 字符串字符处理
        /// </summary>
        /// <param name="chr">等待处理的字符串</param>
        /// <returns>处理后的字符串</returns>
        /// //把TXT代码转换成HTML格式
        public static String ToHtml(string Input)
        {
            StringBuilder sb = new StringBuilder(Input);
            sb.Replace("&", "&amp;");
            sb.Replace("<", "&lt;");
            sb.Replace(">", "&gt;");
            sb.Replace("\r\n", "<br />");
            sb.Replace("\n", "<br />");
            sb.Replace("\t", " ");
            //sb.Replace(" ", "&nbsp;");
            return sb.ToString();
        }
        #endregion

        #region HTML代码转换成TXT格式
        /// <summary>
        /// 字符串字符处理
        /// </summary>
        /// <param name="chr">等待处理的字符串</param>
        /// <returns>处理后的字符串</returns>
        /// //把HTML代码转换成TXT格式
        public static String ToTxt(String Input)
        {
            StringBuilder sb = new StringBuilder(Input);
            sb.Replace("&nbsp;", " ");
            sb.Replace("<br>", "\r\n");
            sb.Replace("<br>", "\n");
            sb.Replace("<br />", "\n");
            sb.Replace("<br />", "\r\n");
            sb.Replace("&lt;", "<");
            sb.Replace("&gt;", ">");
            sb.Replace("&amp;", "&");
            return sb.ToString();
        }
        #endregion

        #region 检测是否有Sql危险字符
        /// <summary>
        /// 检测是否有Sql危险字符
        /// </summary>
        /// <param name="str">要判断字符串</param>
        /// <returns>判断结果</returns>
        public static bool IsSafeSqlString(string str)
        {
            return !Regex.IsMatch(str, @"[-|;|,|\/|\(|\)|\[|\]|\}|\{|%|@|\*|!|\']");
        }

        /// <summary>
        /// 检查危险字符
        /// </summary>
        /// <param name="Input"></param>
        /// <returns></returns>
        public static string Filter(string sInput)
        {
            if (sInput == null || sInput == "")
                return null;
            string sInput1 = sInput.ToLower();
            string output = sInput;
            string pattern = @"*|and|exec|insert|select|delete|update|count|master|truncate|declare|char(|mid(|chr(|'";
            if (Regex.Match(sInput1, Regex.Escape(pattern), RegexOptions.Compiled | RegexOptions.IgnoreCase).Success)
            {
                throw new Exception("字符串中含有非法字符!");
            }
            else
            {
                output = output.Replace("'", "''");
            }
            return output;
        }

        /// <summary> 
        /// 检查过滤设定的危险字符
        /// </summary> 
        /// <param name="InText">要过滤的字符串 </param> 
        /// <returns>如果参数存在不安全字符，则返回true </returns> 
        public static bool SqlFilter(string word, string InText)
        {
            if (InText == null)
                return false;
            foreach (string i in word.Split('|'))
            {
                if ((InText.ToLower().IndexOf(i + " ") > -1) || (InText.ToLower().IndexOf(" " + i) > -1))
                {
                    return true;
                }
            }
            return false;
        }
        #endregion

        #region 过滤特殊字符
        /// <summary>
        /// 过滤特殊字符
        /// </summary>
        /// <param name="Input"></param>
        /// <returns></returns>
        public static string Htmls(string Input)
        {
            if (Input != string.Empty && Input != null)
            {
                string ihtml = Input.ToLower();
                ihtml = ihtml.Replace("<script", "&lt;script");
                ihtml = ihtml.Replace("script>", "script&gt;");
                ihtml = ihtml.Replace("<%", "&lt;%");
                ihtml = ihtml.Replace("%>", "%&gt;");
                ihtml = ihtml.Replace("<$", "&lt;$");
                ihtml = ihtml.Replace("$>", "$&gt;");
                return ihtml;
            }
            else
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// 过滤特殊字符
        /// </summary>
        /// <param name="SourceString">包括HTML，脚本，数据库关键字，特殊字符的源码 </param>
        /// <returns>已经过滤后的字符串</returns>
        public static string FilterSpecialString(string SourceString)
        {
            if (string.IsNullOrEmpty(SourceString))
            {
                return "";
            }
            else
            {
                //删除脚本
                SourceString = Regex.Replace(SourceString, @"<script[^>]*?>.*?</script>", "", RegexOptions.IgnoreCase);

                #region 删除HTML
                SourceString = Regex.Replace(SourceString, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"([\r\n])[\s]+", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"-->", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"<!--.*", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(quot|#34);", "\"", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(amp|#38);", "&", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(lt|#60);", "<", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(gt|#62);", ">", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(nbsp|#160);", " ", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(iexcl|#161);", "\xa1", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(cent|#162);", "\xa2", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(pound|#163);", "\xa3", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&(copy|#169);", "\xa9", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, @"&#(\d+);", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "xp_cmdshell", "", RegexOptions.IgnoreCase);
                #endregion

                #region 删除与数据库相关的词
                SourceString = Regex.Replace(SourceString, "select", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "insert", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "delete from", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "count''", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "drop table", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "truncate", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "asc", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "mid", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "char", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "xp_cmdshell", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "exec master", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "net localgroup administrators", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "and", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "net user", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "or", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "net", "", RegexOptions.IgnoreCase);
                //SourceString = Regex.Replace(SourceString,"*", "", RegexOptions.IgnoreCase);
                //SourceString = Regex.Replace(SourceString,"-", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "delete", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "drop", "", RegexOptions.IgnoreCase);
                SourceString = Regex.Replace(SourceString, "script", "", RegexOptions.IgnoreCase);
                #endregion

                #region 特殊的字符
                SourceString = SourceString.Replace("<", "");
                SourceString = SourceString.Replace(">", "");
                SourceString = SourceString.Replace("*", "");
                SourceString = SourceString.Replace("-", "");
                SourceString = SourceString.Replace("?", "");
                SourceString = SourceString.Replace(",", "");
                SourceString = SourceString.Replace("/", "");
                SourceString = SourceString.Replace(";", "");
                SourceString = SourceString.Replace("*/", "");
                SourceString = SourceString.Replace("\r\n", "");
                //SourceString = HttpContext.Current.Server.HtmlEncode(SourceString).Trim();
                #endregion

                return SourceString;
            }

        }
        #endregion

        #region 检查是否为IP地址
        /// <summary>
        /// 是否为ip
        /// </summary>
        /// <param name="ip"></param>
        /// <returns></returns>
        public static bool IsIP(string ip)
        {
            return Regex.IsMatch(ip, @"^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$");
        }
        #endregion


        #region 获得当前绝对路径
        /// <summary>
        /// 获得当前绝对路径
        /// </summary>
        /// <param name="strPath">指定的路径</param>
        /// <returns>绝对路径</returns>
        [Obsolete]
        public static string GetMapPath(string strPath, bool isWebApplication)
        {
            if (strPath.ToLower().StartsWith("http://"))
            {
                return strPath;
            }
            if (isWebApplication)
            {
                return CoreHttpContext.MapPath(strPath);
            }
            else //非web程序引用
            {
                strPath = strPath.Replace("/", "\\");
                if (strPath.StartsWith("\\"))
                {
                    strPath = strPath.Substring(strPath.IndexOf('\\', 1)).TrimStart('\\');
                }
                return System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, strPath);
            }
        }
        #endregion

        #region 文件操作
        /// <summary>
        /// 删除单个文件
        /// </summary>
        /// <param name="_filepath">文件相对路径</param>
        [Obsolete]
        public static bool DeleteFile(string _filepath, bool isWebApplication)
        {
            if (string.IsNullOrEmpty(_filepath))
            {
                return false;
            }
            string fullpath = GetMapPath(_filepath, isWebApplication);
            if (File.Exists(fullpath))
            {
                File.Delete(fullpath);
                return true;
            }
            return false;
        }

        /// <summary>
        /// 删除上传的文件(及缩略图)
        /// </summary>
        /// <param name="_filepath"></param>
        [Obsolete]
        public static void DeleteUpFile(string _filepath, bool isWebApplication)
        {
            if (string.IsNullOrEmpty(_filepath))
            {
                return;
            }
            string fullpath = GetMapPath(_filepath, isWebApplication); //原图
            if (File.Exists(fullpath))
            {
                File.Delete(fullpath);
            }
            if (_filepath.LastIndexOf("/") >= 0)
            {
                string thumbnailpath = _filepath.Substring(0, _filepath.LastIndexOf("/")) + "mall_" + _filepath.Substring(_filepath.LastIndexOf("/") + 1);
                string fullTPATH = GetMapPath(thumbnailpath, isWebApplication); //宿略图
                if (File.Exists(fullTPATH))
                {
                    File.Delete(fullTPATH);
                }
            }
        }

        /// <summary>
        /// 返回文件大小KB
        /// </summary>
        /// <param name="_filepath">文件相对路径</param>
        /// <returns>int</returns>
        public static int GetFileSize(string _filepath, bool isWebApplication)
        {
            if (string.IsNullOrEmpty(_filepath))
            {
                return 0;
            }
            string fullpath = GetMapPath(_filepath, isWebApplication);
            if (File.Exists(fullpath))
            {
                FileInfo fileInfo = new FileInfo(fullpath);
                return ((int)fileInfo.Length) / 1024;
            }
            return 0;
        }

        /// <summary>
        /// 文件容量单位转换
        /// </summary>
        /// <param name="KSize">字节容量</param>
        /// <returns>转换后的容量</returns>
        public static string ByteConversionGBMBKB(Int64 KSize)
        {
            int GB = 1024 * 1024 * 1024;//定义GB的计算常量
            int MB = 1024 * 1024;//定义MB的计算常量
            int KB = 1024;//定义KB的计算常量
            if (KSize / GB >= 1)//如果当前Byte的值大于等于1GB
                return (Math.Round(KSize / (float)GB, 2)).ToString() + "GB";//将其转换成GB
            else if (KSize / MB >= 1)//如果当前Byte的值大于等于1MB
                return (Math.Round(KSize / (float)MB, 2)).ToString() + "MB";//将其转换成MB
            else if (KSize / KB >= 1)//如果当前Byte的值大于等于1KB
                return (Math.Round(KSize / (float)KB, 2)).ToString() + "KB";//将其转换成KGB
            else
                return KSize.ToString() + "Byte";//显示Byte值
        }

        /// <summary>
        /// 返回文件扩展名，不含“.”
        /// </summary>
        /// <param name="_filepath">文件全名称</param>
        /// <returns>string</returns>
        public static string GetFileExt(string _filepath)
        {
            if (string.IsNullOrEmpty(_filepath))
            {
                return "";
            }
            if (_filepath.LastIndexOf(".") > 0)
            {
                return _filepath.Substring(_filepath.LastIndexOf(".") + 1); //文件扩展名，不含“.”
            }
            return "";
        }

        /// <summary>
        /// 返回文件名，不含路径
        /// </summary>
        /// <param name="_filepath">文件相对路径</param>
        /// <returns>string</returns>
        public static string GetFileName(string _filepath)
        {
            return _filepath.Substring(_filepath.LastIndexOf(@"/") + 1);
        }

        /// <summary>
        /// 文件是否存在
        /// </summary>
        /// <param name="_filepath">文件相对路径</param>
        /// <returns>bool</returns>
        [Obsolete]
        public static bool FileExists(string _filepath, bool isWebApplication)
        {
            string fullpath = GetMapPath(_filepath, isWebApplication);
            if (File.Exists(fullpath))
            {
                return true;
            }
            return false;
        }


        /// <summary>
        /// 返回指定文本文件的内容
        /// </summary>
        /// <param name="FPath">文件路径</param>
        /// <param name="eCode">字符编码对象</param>
        /// <returns></returns>
        public static string getTxtFileBody(string FPath, Encoding eCode)
        {
            StreamReader sr = new StreamReader(FPath, eCode);
            string TxtBody = "";
            string TempLine = "";
            while (TempLine != null)
            {
                TempLine = sr.ReadLine();
                if (TempLine != null)
                {
                    TxtBody += TempLine + "\n";
                }
            }
            sr.Close();
            return TxtBody;
        }

        /// <summary>
        /// 返回指定文本文件的内容(不带换行符)
        /// </summary>
        /// <param name="FPath">文件路径</param>
        /// <param name="eCode">字符编码对象</param>
        /// <returns></returns>
        public static string getTxtFileBody1(string FPath, Encoding eCode)
        {
            StreamReader sr = new StreamReader(FPath, eCode);
            string TxtBody = "";
            string TempLine = "";
            while (TempLine != null)
            {
                TempLine = sr.ReadLine();
                if (TempLine != null)
                {
                    TxtBody += TempLine;
                }
            }
            sr.Close();
            return TxtBody;
        }

        /// <summary>
        /// 写入制定的文本到文件里
        /// </summary>
        /// <param name="append">是否追加</param>
        /// <param name="Body">文件内容</param>
        /// <param name="FPath">文件路径</param>
        public static string WriteTextToFile(string FPath, bool append, string Body, System.Text.Encoding FileEncoding)
        {
            string Message = String.Empty;
            try
            {
                StreamWriter sr = new StreamWriter(FPath, append, FileEncoding);
                sr.Write(Body);
                sr.Close();
            }
            catch (Exception exp)
            {
                Message = exp.Message;
            }
            return Message;
        }

        /// <summary>
        /// 写入制定的文本到文件里
        /// </summary>
        /// <param name="append">是否追加</param>
        /// <param name="Body">文件内容</param>
        /// <param name="FPath">文件路径</param>
        public static string WriteTextToFile(string FPath, bool append, string Body)
        {
            string Message = String.Empty;
            try
            {
                StreamWriter sr = new StreamWriter(FPath, append, Encoding.GetEncoding("gb2312"));
                sr.Write(Body);
                sr.Close();
            }
            catch (Exception exp)
            {
                Message = exp.Message;
            }
            return Message;
        }
        #endregion

        #region 替换指定的字符串
        /// <summary>
        /// 替换指定的字符串
        /// </summary>
        /// <param name="originalStr">原字符串</param>
        /// <param name="oldStr">旧字符串</param>
        /// <param name="newStr">新字符串</param>
        /// <returns></returns>
        public static string ReplaceStr(string originalStr, string oldStr, string newStr)
        {
            if (string.IsNullOrEmpty(oldStr))
            {
                return "";
            }
            return originalStr.Replace(oldStr, newStr);
        }
        #endregion

        #region 显示分页
        /// <summary>
        /// 返回分页页码
        /// </summary>
        /// <param name="pageSize">页面大小</param>
        /// <param name="pageIndex">当前页</param>
        /// <param name="totalCount">总记录数</param>
        /// <param name="linkUrl">链接地址，__id__代表页码</param>
        /// <param name="centSize">中间页码数量</param>
        /// <returns></returns>
        public static string OutPageList(int pageSize, int pageIndex, int totalCount, string linkUrl, int centSize)
        {
            //计算页数
            if (totalCount < 1 || pageSize < 1)
            {
                return "";
            }
            int pageCount = totalCount / pageSize;
            if (pageCount < 1)
            {
                return "";
            }
            if (totalCount % pageSize > 0)
            {
                pageCount += 1;
            }
            if (pageCount <= 1)
            {
                return "";
            }
            StringBuilder pageStr = new StringBuilder();
            string pageId = "__id__";
            string firstBtn = "<a href=\"" + ReplaceStr(linkUrl, pageId, (pageIndex - 1).ToString()) + "\">«上一页</a>";
            string lastBtn = "<a href=\"" + ReplaceStr(linkUrl, pageId, (pageIndex + 1).ToString()) + "\">下一页»</a>";
            string firstStr = "<a href=\"" + ReplaceStr(linkUrl, pageId, "1") + "\">1</a>";
            string lastStr = "<a href=\"" + ReplaceStr(linkUrl, pageId, pageCount.ToString()) + "\">" + pageCount.ToString() + "</a>";

            if (pageIndex <= 1)
            {
                firstBtn = "<span class=\"disabled\">«上一页</span>";
            }
            if (pageIndex >= pageCount)
            {
                lastBtn = "<span class=\"disabled\">下一页»</span>";
            }
            if (pageIndex == 1)
            {
                firstStr = "<span class=\"current\">1</span>";
            }
            if (pageIndex == pageCount)
            {
                lastStr = "<span class=\"current\">" + pageCount.ToString() + "</span>";
            }
            int firstNum = pageIndex - (centSize / 2); //中间开始的页码
            if (pageIndex < centSize)
                firstNum = 2;
            int lastNum = pageIndex + centSize - ((centSize / 2) + 1); //中间结束的页码
            if (lastNum >= pageCount)
                lastNum = pageCount - 1;
            pageStr.Append(firstBtn + firstStr);
            if (pageIndex >= centSize)
            {
                pageStr.Append("<span>...</span>\n");
            }
            for (int i = firstNum; i <= lastNum; i++)
            {
                if (i == pageIndex)
                {
                    pageStr.Append("<span class=\"current\">" + i + "</span>");
                }
                else
                {
                    pageStr.Append("<a href=\"" + ReplaceStr(linkUrl, pageId, i.ToString()) + "\">" + i + "</a>");
                }
            }
            if (pageCount - pageIndex > centSize - ((centSize / 2)))
            {
                pageStr.Append("<span>...</span>");
            }
            pageStr.Append(lastStr + lastBtn);
            return pageStr.ToString();
        }
        #endregion

        #region URL处理
        /// <summary>
        /// URL字符编码
        /// </summary>
        public static string UrlEncode(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return "";
            }
            str = str.Replace("'", "");
            return WebUtility.UrlEncode(str);
        }

        /// <summary>
        /// URL字符解码
        /// </summary>
        public static string UrlDecode(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return "";
            }
            return WebUtility.UrlDecode(str);
        }

        /// <summary>
        /// 组合URL参数
        /// </summary>
        /// <param name="_url">页面地址</param>
        /// <param name="_keys">参数名称</param>
        /// <param name="_values">参数值</param>
        /// <returns>String</returns>
        public static string CombUrlTxt(string _url, string _keys, params string[] _values)
        {
            StringBuilder urlParams = new StringBuilder();
            try
            {
                string[] keyArr = _keys.Split(new char[] { '&' });
                for (int i = 0; i < keyArr.Length; i++)
                {
                    if (!string.IsNullOrEmpty(_values[i]) && _values[i] != "0")
                    {
                        _values[i] = UrlEncode(_values[i]);
                        urlParams.Append(string.Format(keyArr[i], _values) + "&");
                    }
                }
                if (!string.IsNullOrEmpty(urlParams.ToString()) && _url.IndexOf("?") == -1)
                    urlParams.Insert(0, "?");
            }
            catch
            {
                return _url;
            }
            return _url + DelLastChar(urlParams.ToString(), "&");
        }
        #endregion

        #region URL请求数据
        /// <summary>
        /// HTTP POST方式请求数据
        /// </summary>
        /// <param name="url">URL.</param>
        /// <param name="param">POST的数据</param>
        /// <returns></returns>
        public static string HttpPost(string url, string param)
        {
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.Accept = "*/*";
            request.Timeout = 15000;
            request.AllowAutoRedirect = false;

            StreamWriter requestStream = null;
            WebResponse response = null;
            string responseStr = null;

            try
            {
                requestStream = new StreamWriter(request.GetRequestStream());
                requestStream.Write(param);
                requestStream.Close();

                response = request.GetResponse();
                if (response != null)
                {
                    StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
                    responseStr = reader.ReadToEnd();
                    reader.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                request = null;
                requestStream = null;
                response = null;
            }

            return responseStr;
        }

        /// <summary>
        /// HTTP GET方式请求数据.
        /// </summary>
        /// <param name="url">URL.</param>
        /// <returns></returns>
        public static string HttpGet(string url)
        {
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
            request.Method = "GET";
            //request.ContentType = "application/x-www-form-urlencoded";
            request.Accept = "*/*";
            request.Timeout = 15000;
            request.AllowAutoRedirect = false;

            WebResponse response = null;
            string responseStr = null;

            try
            {
                response = request.GetResponse();

                if (response != null)
                {
                    StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
                    responseStr = reader.ReadToEnd();
                    reader.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                request = null;
                response = null;
            }

            return responseStr;
        }
        #endregion

        #region 时间日期
        /// <summary>
        /// 时间比较函数(VB.NET二次封装)
        /// </summary>
        /// <param name="Interval">时间间隔</param>
        /// <param name="Time1">时间1</param>
        /// <param name="Time2">时间2</param>
        /// <returns>相差时间</returns>
        public static long DateDiff(string vInterval, DateTime Time1, DateTime Time2)
        {
            long result = -1;
            switch (vInterval)
            {
                case "dd":
                    result = DateDiff(DateInterval.Day, Time1.Date, Time2.Date);
                    break;
                case "yyyy":
                    result = DateDiff(DateInterval.Year, Time1, Time2);
                    break;
                case "mm":
                    result = DateDiff(DateInterval.Minute, Time1, Time2);
                    break;
                case "MM":
                    result = DateDiff(DateInterval.Month, Time1, Time2);
                    break;
                case "hh":
                    result = DateDiff(DateInterval.Hour, Time1, Time2);
                    break;
                case "Weekday":
                    result = DateDiff(DateInterval.Weekday, Time1, Time2);
                    break;
                case "WeekOfYear":
                    result = DateDiff(DateInterval.WeekOfYear, Time1, Time2);
                    break;
                case "ss":
                    result = DateDiff(DateInterval.Second, Time1, Time2);
                    break;
            }

            return result;
        }

        /// <summary>
        /// 时间比较函数
        /// </summary>
        /// <param name="interval">比较单位</param>
        /// <param name="date1">时间1</param>
        /// <param name="date2">时间2</param>
        /// <returns>时间间隔</returns>
        public static long DateDiff(DateInterval interval, DateTime date1, DateTime date2)
        {

            TimeSpan ts = date2 - date1;

            switch (interval)
            {
                case DateInterval.Year:
                    return date2.Year - date1.Year;
                case DateInterval.Month:
                    return (date2.Month - date1.Month) + (12 * (date2.Year - date1.Year));
                case DateInterval.Weekday:
                    return Fix(ts.TotalDays) / 7;
                case DateInterval.Day:
                    return Fix(ts.TotalDays);
                case DateInterval.Hour:
                    return Fix(ts.TotalHours);
                case DateInterval.Minute:
                    return Fix(ts.TotalMinutes);
                default:
                    return Fix(ts.TotalSeconds);
            }
        }


        /// <summary>
        /// 以日期为单位返回时间范围
        /// </summary>
        /// <param name="time1">时间1</param>
        /// <param name="time2">时间2</param>
        /// <param name="FormatDateString">格式化字符串</param>
        /// <param name="message">错误消息</param>
        /// <returns>格式后的字符串</returns>
        public static string getTimeRangeByFormat(DateTime time1, DateTime time2, string FormatDateString, out string message)
        {
            string result = string.Empty;
            long timeRange = -1;
            message = string.Empty;
            DateTime StartTime = DateTime.MinValue;
            DateTime EndTime = DateTime.MinValue;
            if (string.IsNullOrEmpty(FormatDateString))
            {
                message = "参数:FormatDateString不能为空";
                return string.Empty;
            }
            try
            {
                if (DateDiff("dd", time1, time2) == 0)
                {
                    return time1.ToString(FormatDateString);
                }
                else if (DateDiff("dd", time1, time2) < 0)
                {
                    StartTime = time2;
                    EndTime = time1;
                    timeRange = DateDiff("dd", time2, time1);
                }
                else if (DateDiff("dd", time1, time2) > 0)
                {
                    StartTime = time1;
                    EndTime = time2;
                    timeRange = DateDiff("dd", time1, time2);
                }
                while (DateDiff("dd", StartTime, EndTime) > 0)
                {
                    StartTime = StartTime.AddDays(1);
                    result += "'" + StartTime.ToString(FormatDateString) + "',";
                }
                if (!string.IsNullOrEmpty(result))
                    result = result.Substring(0, result.Length - 1);
            }
            catch (Exception exp)
            {
                message = exp.Message;
                return string.Empty;
            }
            return result;
        }

        private static long Fix(double Number)
        {
            if (Number >= 0)
            {
                return (long)Math.Floor(Number);
            }
            return (long)Math.Ceiling(Number);
        }
        #endregion

        #region 正则判断

        /// <summary>
        /// 判断是否是整数
        /// </summary>
        /// <param name="str">字符串</param>
        /// <returns>是否整数</returns>
        public static bool IsIntNum(string str)
        {
            System.Text.RegularExpressions.Regex reg1
            = new System.Text.RegularExpressions.
            Regex(@"^[-]?[1-9]{1}\d*$|^[0]{1}$");
            bool ismatch = reg1.IsMatch(str);
            return ismatch;
        }

        /// <summary>
        /// 判断是否是日期格式
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public static bool IsDate(string strDate)
        {
            try
            {
                DateTime.Parse(strDate);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 判断是否是日期格式
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public static bool IsDateTime(string strDate)
        {
            DateTime testValue = DateTime.Now;
            try
            {
                if (string.IsNullOrEmpty(strDate))
                    return false;
                return DateTime.TryParse(strDate, out testValue);
            }
            catch
            {
                return false;
            }
        }
        #endregion

        #region 数学计算函数
        /// <summary>
        /// 实现数据的四舍五入法
        /// </summary>
        /// <param name="v">要进行处理的数据</param>
        /// <param name="x">保留的小数位数</param>
        /// <returns>四舍五入后的结果</returns>
        public static double Round(double v, int x)
        {
            bool isNegative = false;
            //如果是负数
            if (v < 0)
            {
                isNegative = true;
                v = -v;
            }
            int IValue = 1;
            for (int i = 1; i <= x; i++)
            {
                IValue = IValue * 10;
            }
            double Int = Math.Round(v * IValue + 0.5, 0);
            v = Int / IValue;
            if (isNegative)
            {
                v = -v;
            }
            return v;
        }
        #endregion

        #region 转换数据类型

        public static decimal ConvertToDecimal(object obj)
        {
            try
            {
                return Convert.ToDecimal(obj);
            }
            catch (Exception)
            {
                return Convert.ToDecimal("0.00");
            }
        }

        /// <summary>
        /// 将string转换为decimal
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static decimal StrToDecimal(string str)
        {
            decimal dt = 0;
            if (string.IsNullOrEmpty(str))
                return dt;
            if (!decimal.TryParse(str, out dt))
                return 0;
            return dt;
        }

        /// <summary>
        /// 将string转换为long
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static long StrToLong(string str)
        {
            long dt = 0;
            if (string.IsNullOrEmpty(str))
                return dt;
            if (!long.TryParse(str, out dt))
                return 0;
            return dt;
        }

        /// <summary>
        /// 将string转换为short
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static short StrToShort(string str)
        {
            short dt = 0;
            if (string.IsNullOrEmpty(str))
                return dt;
            if (!short.TryParse(str, out dt))
                return 0;
            return dt;
        }
        #endregion

        #region 数据库字段操作

        /// <summary>
        /// 获得数据行的值
        /// </summary>
        /// <param name="dataRow">数据行</param>
        /// <param name="columnIndex">列索引</param>
        /// <returns>列值</returns>
        public static string GetDataRowValue(DataRow dataRow, int columnIndex)
        {
            string result = string.Empty;
            if (columnIndex <= 0 || columnIndex > dataRow.Table.Columns.Count)
                result = string.Empty;
            else if (Convert.IsDBNull(dataRow[columnIndex]))
                result = string.Empty;
            else
                result = Convert.ToString(dataRow[columnIndex]);
            return result;
        }

        /// <summary>
        /// 获得数据行的值
        /// </summary>
        /// <param name="dataRow">数据行</param>
        /// <param name="columnName">列名称</param>
        /// <returns>列值</returns>
        public static string GetDataRowValue(DataRow dataRow, string columnName)
        {
            string result = string.Empty;
            if (string.IsNullOrEmpty(columnName))
                result = string.Empty;
            else if (Convert.IsDBNull(dataRow[columnName]))
                result = string.Empty;
            else
                result = Convert.ToString(dataRow[columnName]);
            return result;
        }
        #endregion

        #region MD5加密
        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="Text">要加密的文本</param>
        /// <param name="sKey">秘钥</param>
        /// <returns></returns>
        public static string EncryptPasswordByMD5(string Text, string sKey = "test")
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            byte[] inputByteArray;
            inputByteArray = Encoding.Default.GetBytes(Text);
            des.Key = ASCIIEncoding.ASCII.GetBytes(MD5Hash(sKey).Substring(0, 8));
            des.IV = ASCIIEncoding.ASCII.GetBytes(MD5Hash(sKey).Substring(0, 8));
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            StringBuilder ret = new StringBuilder();
            foreach (byte b in ms.ToArray())
            {
                ret.AppendFormat("{0:X2}", b);
            }
            string md4j = ret.ToString();
            return ret.ToString();
        }

        /// <summary>
        /// netcore下的实现MD5加密
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        private static string MD5Hash(string input)
        {
            using (var md5 = MD5.Create())
            {
                var result = md5.ComputeHash(Encoding.ASCII.GetBytes(input));
                var strResult = BitConverter.ToString(result);
                return strResult.Replace("-", "");
            }

        }
        #endregion

        public static string SHA256(string str)
        {
            //如果str有中文，不同Encoding的sha是不同的！！
            byte[] SHA256Data = Encoding.UTF8.GetBytes(str);

            SHA256Managed Sha256 = new SHA256Managed();
            byte[] by = Sha256.ComputeHash(SHA256Data);

            return BitConverter.ToString(by).Replace("-", "").ToLower(); //64
            //return Convert.ToBase64String(by);                         //44
        }

        /// <summary>
        /// 将[时:分:秒]转换为秒钟
        /// </summary>
        /// <param name="durationStr"></param>
        /// <returns></returns>
        public static double ConvertDuration(string durationStr)
        {
            double result = 0;
            string[] durationAry = durationStr.Split(':');
            if (durationAry == null || durationAry.Length <= 0 || durationAry.Length < 3)
                return 0;
            double hourSecord = Utils.StrToDouble(durationAry[0]) * 3600;
            double minute = Utils.StrToDouble(durationAry[1]) * 60;
            double Second = Utils.StrToDouble(durationAry[2]);
            result = hourSecord + minute + Second;
            return result;
        }

        /// <summary>
        /// 将string转换为decimal
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>转换后的int类型结果</returns>
        public static double StrToDouble(string str)
        {
            double dt = 0;
            if (string.IsNullOrEmpty(str))
                return dt;
            if (!double.TryParse(str, out dt))
                return 0;
            return dt;
        }
    }
}