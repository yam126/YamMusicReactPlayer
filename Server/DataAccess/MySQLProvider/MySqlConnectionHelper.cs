using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace DataAccess.MySQLProvider
{
    public class MySqlConnectionHelper
    {
        internal const string s_strUpperDataDirWithToken = "|DATADIRECTORY|";
        private static object s_lock = new object();
        /// <summary>
        /// 配置文件名
        /// </summary>
        public static string FileName = "";

        //public static OracleConnectionHolder GetConnection(string connectionString, bool revertImpersonation)
        //{

        //    string strTempConnection = connectionString.ToUpperInvariant();
        //    //Commented out for source code release.
        //    //if (strTempConnection.Contains(s_strUpperDataDirWithToken))
        //    //    EnsureSqlExpressDBFile( connectionString );

        //    OracleConnectionHolder holder = new OracleConnectionHolder(connectionString);
        //    bool closeConn = true;
        //    try
        //    {
        //        try
        //        {
        //            holder.Open();
        //            closeConn = false;
        //        }
        //        finally
        //        {
        //            if (closeConn)
        //            {
        //                holder.Close();
        //                holder = null;
        //            }
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return holder;
        //}

        public static string GetConnectionString(string specifiedConnectionString, bool lookupConnectionString)
        {
            if (specifiedConnectionString == null || specifiedConnectionString.Length < 1)
                return null;

            string connectionString = null;

            if (lookupConnectionString)
            {
                connectionString = AppSetting.ConConnectionStrings(specifiedConnectionString);
                //if (connObj != null)
                //    connectionString = connObj.ConnectionString;

                if (connectionString == null)
                    return null;
            }
            else
            {
                connectionString = specifiedConnectionString;
            }

            return connectionString;
        }

        public static string GetConnectionString(string NodeName)
        {
            string ConfigPath = AppDomain.CurrentDomain.BaseDirectory.ToString() + FileName;

            string connectionString = null;
            if (File.Exists(ConfigPath))
            {
                XmlNode Root = XmlHelper.getRootNode(ConfigPath);
                XmlNode Connection = XmlHelper.ReadNode(Root, "ConnectionString");
                connectionString = XmlHelper.ReadNode(Connection, NodeName).InnerText;
            }


            return connectionString;
        }
    }
}
