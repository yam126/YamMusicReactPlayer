using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.MySQLProvider
{
    /// <summary>
    /// 网站配置读取类
    /// </summary>
    public class AppSetting
    {
        private static readonly object objLock = new object();
        private static AppSetting instance = null;

        private IConfigurationRoot Config { get; }

        private AppSetting()
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            var builder = new ConfigurationBuilder()
                .SetBasePath(currentDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            Config = builder.Build();
        }

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

        public static IConfigurationSection GetConfigSection(string keyName)
        {
            return GetInstance().Config.GetSection(keyName);
        }

        public static string ConConnectionStrings(string key)
        {
            return GetInstance().Config.GetSection("ConnectionStrings").GetSection(key).Value;
        }

        public static string GetConfigSection(string key, string childKey)
        {
            return GetInstance().Config.GetSection(key).GetSection(childKey).Value;
        }

        public static string GetConfig(string name)
        {
            return GetInstance().Config.GetSection(name).Value;
        }
    }
}
