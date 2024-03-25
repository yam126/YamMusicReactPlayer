using PublicLibrary;
using System.Text.RegularExpressions;
using System.Text;
using System.Xml.Linq;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Library
{
    /// <summary>
    /// 应用程序配置
    /// </summary>
    public class AppSetting
    {
        private static readonly object objLock = new object();
        private static AppSetting instance = null;

        private IConfigurationRoot Config { get; }

        /// <summary>
        /// 构造函数
        /// </summary>
        private AppSetting()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            Config = builder.Build();
        }

        /// <summary>
        /// 单例模式避免重复创建
        /// </summary>
        /// <returns>返回设置object</returns>
        public static AppSetting GetInstance()
        {
            if (instance == null)
            {
                lock (objLock)
                {
                    if (instance == null)
                    {
                        instance = new AppSetting();
                    }
                }
            }

            return instance;
        }

        /// <summary>
        /// 获得配置节点的配置集合
        /// </summary>
        /// <param name="keyName">配置节点名称</param>
        /// <returns>配置集合</returns>
        public static IConfigurationSection GetConfigSection(string keyName)
        {
            return GetInstance().Config.GetSection(keyName);
        }

        /// <summary>
        /// 获取指定App设置
        /// </summary>
        /// <param name="keyName">配置节点名称</param>
        /// <returns>设置内容</returns>
        public static string GetAppSetting(string keyName)
        {
            return GetInstance().Config.GetSection("AppSetting").GetSection(keyName).Value;
        }

        /// <summary>
        /// 获得连接字符串
        /// </summary>
        /// <param name="key">数据库连接字符串名称</param>
        /// <returns>数据库连接字符串</returns>
        public static string ConConnectionStrings(string key)
        {
            return GetInstance().Config.GetSection("ConnectionStrings").GetSection(key).Value;
        }

        /// <summary>
        /// 获取配置
        /// </summary>
        /// <param name="name">配置节点名称</param>
        /// <returns>配置节点内容</returns>
        public static string GetConfig(string name)
        {
            return GetInstance().Config.GetSection(name).Value;
        }



        /// <summary>
        ///   替换部分字符串
        /// </summary>
        /// <param name="sPassed">需要替换的字符串</param>
        /// <returns></returns>
        public static string ReplaceString(string JsonString)
        {
            if (JsonString == null) { return JsonString; }
            if (JsonString.Contains("\\"))
            {
                JsonString = JsonString.Replace("\\", "\\\\");
            }
            if (JsonString.Contains("\'"))
            {
                JsonString = JsonString.Replace("\'", "\\\'");
            }
            if (JsonString.Contains("\""))
            {
                JsonString = JsonString.Replace("\"", "\\\"");
            }
            //去掉字符串的回车换行符
            JsonString = Regex.Replace(JsonString, @"[\n\r\t]", "");
            JsonString = JsonString.Trim();
            return JsonString;
        }



        /// <summary>
        /// 获得所有contentTypes
        /// </summary>
        /// <param name="message">错误消息</param>
        /// <returns>所有获得所有contentTypes</returns>
        public static List<contentTypeModel> GetContentTypes(out string message)
        {
            #region 声明初始化变量

            //返回值
            List<contentTypeModel> result = null;

            //错误消息
            message = "";

            //文件名
            string FileName = "allContentType.xml";

            //文件路径
            string FilePath = "";

            //xml文档
            XDocument doc = null;

            //子类型列表
            List<XElement> contentTypes = null;
            #endregion

            #region 读取文件内容
            FilePath = CoreHttpContext.MapPath("");
            string FileFullPath = FilePath + "\\" + FileName;
            FileFullPath = FileFullPath.Replace("wwwroot\\", "");
            if (!File.Exists(FileFullPath))
            {
                message = $"{FileFullPath}配置文件不存在";
                return null;
            }
            try
            {
                string xmlCode = Utils.getTxtFileBody(FileFullPath, Encoding.UTF8);
                if (string.IsNullOrEmpty(xmlCode))
                {
                    message = $"{FileName}配置文件内容为空";
                    return null;
                }
                doc = XDocument.Parse(xmlCode);
                contentTypes = doc.Root.Elements().ToList();
                if (contentTypes == null || contentTypes.Count <= 0)
                {
                    message = $"{FileName}配置文件没有子节点，请检查配置文件";
                    return null;
                }
                result = new List<contentTypeModel>();
                foreach (XElement element in contentTypes)
                {
                    contentTypeModel item = new contentTypeModel();
                    item.type = element.Elements().First(q => q.Name == "type").Value;
                    item.contentType = element.Elements().First(q => q.Name == "contentType").Value;
                    result.Add(item);
                }
                if (!string.IsNullOrEmpty(message))
                {
                    message = $"读取allContentType.json转换出错，原因[{message}]";
                    return null;
                }
            }
            catch (Exception exp)
            {
                message = $"allContentType.json配置文件读取出错,原因[{exp.Message}]";
                return null;
            }
            #endregion

            return result;
        }
    }
}
