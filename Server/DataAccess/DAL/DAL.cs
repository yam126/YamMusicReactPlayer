using DataAccess.Model;
using DataAccess.MySQLProvider;
using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Data;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAL
{
    /// <summary>
    /// 专辑信息 
    /// </summary>
    public partial class albuminfo_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public albuminfo_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public albuminfo_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(albuminfo model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<albuminfo> lists = new List<albuminfo>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_albuminfo", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<albuminfo> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(albuminfo model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<albuminfo> lists = new List<albuminfo>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_albuminfo", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 更新专辑歌曲数量信息
        /// </summary>
        /// <param name="message">错误消息</param>
        /// <param name="albumId">歌曲编号[默认0更新所有专辑的歌曲数量]</param>
        /// <returns>0成功、非0失败</returns>
        public int UpadteAlbumSongData(out string message, long albumId = 0) 
        {
            int result = -1;
            message = string.Empty;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.Add(sqlPro.CreateInputParam("valbumId", MySqlDbType.Int64, albumId, 4000));
            result = sqlPro.ExecuteNonQuery("UpadteAlbumSongData", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<albuminfo> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>0成功、非0失败</returns>
        public int Delete(string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            string sql = " delete from albuminfo ";
            if (string.IsNullOrEmpty(SqlWhere))
            {
                message = "删除条件不能为空";
                return result;
            }
            sql += " where " + SqlWhere;
            result = sqlPro.UpdateData(sql, out message);
            return result;
        }

        #region 查询方法

        /// <summary>
        /// 查询前几条歌曲编号
        /// </summary>
        /// <param name="limit">条数</param>
        /// <param name="message">错误消息</param>
        /// <returns>歌曲编号</returns>
        public List<string> QueryIDLimit(int limit, out string message)
        {
            message = string.Empty;
            List<string> result = new List<string>();
            string sql = $" select albumId from albuminfo ORDER BY createdatetime limit {limit} ";
            DataTable dt = sqlPro.ExecuteDataSet(sql, CommandType.Text, null, out message);
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                    result.Add(dr[0].ToString());
            }
            return result;
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<albuminfo> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<albuminfo> result = new List<albuminfo>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_albuminfo", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                albuminfo model = new albuminfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<albuminfo> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<albuminfo> result = new List<albuminfo>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_albuminfo_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                albuminfo model = new albuminfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref albuminfo model, DataRow dr)
        {
            //专辑编号
            model.albumId = Convert.IsDBNull(dr["albumId"]) ? 0 : Convert.ToInt64(dr["albumId"]);
            //专辑名称
            model.albumName = Convert.IsDBNull(dr["albumName"]) ? string.Empty : Convert.ToString(dr["albumName"]).Trim();
            //专辑作者
            model.albumAuthor = Convert.IsDBNull(dr["albumAuthor"]) ? string.Empty : Convert.ToString(dr["albumAuthor"]).Trim();
            //专辑简介
            model.albumIntro = Convert.IsDBNull(dr["albumIntro"]) ? string.Empty : Convert.ToString(dr["albumIntro"]).Trim();
            //专辑封面
            model.albumCover = Convert.IsDBNull(dr["albumCover"]) ? string.Empty : Convert.ToString(dr["albumCover"]).Trim();
            //浏览次数
            model.viewCount = Convert.IsDBNull(dr["viewCount"]) ? 0 : Convert.ToInt32(dr["viewCount"]);
            //分享次数
            model.shareCount = Convert.IsDBNull(dr["shareCount"]) ? 0 : Convert.ToInt32(dr["shareCount"]);
            //创建人
            model.userid = Convert.IsDBNull(dr["userid"]) ? 0 : Convert.ToInt64(dr["userid"]);
            //创建时间
            model.createdatetime = Convert.IsDBNull(dr["createdatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["createdatetime"]);
            //修改人
            model.modifierId = Convert.IsDBNull(dr["modifierId"]) ? 0 : Convert.ToInt64(dr["modifierId"]);
            //修改时间
            model.modifieddatetime = Convert.IsDBNull(dr["modifieddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["modifieddatetime"]);
            //歌曲数量
            model.songLength = Convert.IsDBNull(dr["songLength"]) ? 0 : Convert.ToInt32(dr["songLength"]);
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<albuminfo> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //专辑编号
                lists[i].albumId = lists[i].albumId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].albumId);
                //专辑名称
                lists[i].albumName = string.IsNullOrEmpty(lists[i].albumName) ? string.Empty : Convert.ToString(lists[i].albumName).Trim();
                //专辑作者
                lists[i].albumAuthor = string.IsNullOrEmpty(lists[i].albumAuthor) ? string.Empty : Convert.ToString(lists[i].albumAuthor).Trim();
                //专辑简介
                lists[i].albumIntro = string.IsNullOrEmpty(lists[i].albumIntro) ? string.Empty : Convert.ToString(lists[i].albumIntro).Trim();
                //专辑封面
                lists[i].albumCover = string.IsNullOrEmpty(lists[i].albumCover) ? string.Empty : Convert.ToString(lists[i].albumCover).Trim();
                //浏览次数
                lists[i].viewCount = lists[i].viewCount == null ? Convert.ToInt32(0) : Convert.ToInt32(lists[i].viewCount);
                //分享次数
                lists[i].shareCount = lists[i].shareCount == null ? Convert.ToInt32(0) : Convert.ToInt32(lists[i].shareCount);
                //创建人
                lists[i].userid = lists[i].userid == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].userid);
                //创建时间
                lists[i].createdatetime = lists[i].createdatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].createdatetime.GetValueOrDefault());
                //修改人
                lists[i].modifierId = lists[i].modifierId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].modifierId);
                //修改时间
                lists[i].modifieddatetime = lists[i].modifieddatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].modifieddatetime.GetValueOrDefault());
                //歌曲数量
                lists[i].songLength = lists[i].songLength == null ? Convert.ToInt32(0) : Convert.ToInt32(lists[i].songLength);
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<albuminfo> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].albumName))
                {
                    if (lists[i].albumName.Length > 600)
                    {
                        OutLength = lists[i].albumName.Length - 600;
                        message += "字段名[albumName]描述[专辑名称]超长、字段最长[600]实际" + lists[i].albumName.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].albumAuthor))
                {
                    if (lists[i].albumAuthor.Length > 600)
                    {
                        OutLength = lists[i].albumAuthor.Length - 600;
                        message += "字段名[albumAuthor]描述[专辑作者]超长、字段最长[600]实际" + lists[i].albumAuthor.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].albumIntro))
                {
                    if (lists[i].albumIntro.Length > 1200)
                    {
                        OutLength = lists[i].albumIntro.Length - 1200;
                        message += "字段名[albumIntro]描述[专辑简介]超长、字段最长[1200]实际" + lists[i].albumIntro.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].albumCover))
                {
                    if (lists[i].albumCover.Length > 8000)
                    {
                        OutLength = lists[i].albumCover.Length - 8000;
                        message += "字段名[albumCover]描述[专辑封面]超长、字段最长[8000]实际" + lists[i].albumCover.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(albuminfo model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //专辑编号
                     new MySqlParameter("albumId",MySqlDbType.Int64,0)
                     {
                        Value=model.albumId==null?0:Convert.ToInt64(model.albumId)
                     },
                    //专辑名称
                     new MySqlParameter("albumName",MySqlDbType.VarChar,600)
                     {
                        Value=string.IsNullOrEmpty(model.albumName)?string.Empty:FilteSQLStr(Convert.ToString(model.albumName))
                     },
                    //专辑作者
                     new MySqlParameter("albumAuthor",MySqlDbType.VarChar,600)
                     {
                        Value=string.IsNullOrEmpty(model.albumAuthor)?string.Empty:FilteSQLStr(Convert.ToString(model.albumAuthor))
                     },
                    //专辑简介
                     new MySqlParameter("albumIntro",MySqlDbType.VarChar,1200)
                     {
                        Value=string.IsNullOrEmpty(model.albumIntro)?string.Empty:FilteSQLStr(Convert.ToString(model.albumIntro))
                     },
                    //专辑封面
                     new MySqlParameter("albumCover",MySqlDbType.VarChar,8000)
                     {
                        Value=string.IsNullOrEmpty(model.albumCover)?string.Empty:FilteSQLStr(Convert.ToString(model.albumCover))
                     },
                    //浏览次数
                     new MySqlParameter("viewCount",MySqlDbType.Int32,0)
                     {
                        Value=model.viewCount==0?0:Convert.ToInt32(model.viewCount)
                     },
                    //分享次数
                     new MySqlParameter("shareCount",MySqlDbType.Int32,0)
                     {
                        Value=model.shareCount==0?0:Convert.ToInt32(model.shareCount)
                     },
                    //创建人
                     new MySqlParameter("userid",MySqlDbType.Int64,0)
                     {
                        Value=model.userid==null?0:Convert.ToInt64(model.userid)
                     },
                    //创建时间
                     new MySqlParameter("createdatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.createdatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.createdatetime)
                     },
                    //修改人
                     new MySqlParameter("modifierId",MySqlDbType.Int64,0)
                     {
                        Value=model.modifierId==null?0:Convert.ToInt64(model.modifierId)
                     },
                    //修改时间
                     new MySqlParameter("modifieddatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.modifieddatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.modifieddatetime)
                     },
                    //歌曲数量
                     new MySqlParameter("songLength",MySqlDbType.Int32,0)
                     {
                        Value=model.songLength==0?0:Convert.ToInt32(model.songLength)
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<albuminfo> lists)
        {
            ArrayList result = new ArrayList();
            foreach (albuminfo model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into albuminfo(";
                Sql += "albumId,";
                Sql += "albumName,";
                Sql += "albumAuthor,";
                Sql += "albumIntro,";
                Sql += "albumCover,";
                Sql += "viewCount,";
                Sql += "shareCount,";
                Sql += "userid,";
                Sql += "createdatetime,";
                Sql += "modifierId,";
                Sql += "modifieddatetime,";
                Sql += "songLength";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.albumId) + "',";
                Sql += "'" + FilteSQLStr(model.albumName) + "',";
                Sql += "'" + FilteSQLStr(model.albumAuthor) + "',";
                Sql += "'" + FilteSQLStr(model.albumIntro) + "',";
                Sql += "'" + model.albumCover + "',";
                Sql += "'" + FilteSQLStr(model.viewCount) + "',";
                Sql += "'" + FilteSQLStr(model.shareCount) + "',";
                Sql += "'" + FilteSQLStr(model.userid) + "',";
                Sql += "DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "'" + FilteSQLStr(model.modifierId) + "',";
                Sql += "DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "'" + FilteSQLStr(model.songLength) + "'";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<albuminfo> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (albuminfo model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update albuminfo set ";
                Sql += "albumId='" + FilteSQLStr(model.albumId) + "',";
                Sql += "albumName='" + FilteSQLStr(model.albumName) + "',";
                Sql += "albumAuthor='" + FilteSQLStr(model.albumAuthor) + "',";
                Sql += "albumIntro='" + FilteSQLStr(model.albumIntro) + "',";
                Sql += "albumCover='" + FilteSQLStr(model.albumCover) + "',";
                Sql += "viewCount='" + FilteSQLStr(model.viewCount) + "',";
                Sql += "shareCount='" + FilteSQLStr(model.shareCount) + "',";
                Sql += "userid='" + FilteSQLStr(model.userid) + "',";
                Sql += "createdatetime=DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "modifierId='" + FilteSQLStr(model.modifierId) + "',";
                Sql += "modifieddatetime=DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "songLength='" + FilteSQLStr(model.songLength) + "'";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }
    /// <summary>
    /// app设备信息 
    /// </summary>
    public partial class appdevicerecord_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public appdevicerecord_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public appdevicerecord_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(appdevicerecord model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<appdevicerecord> lists = new List<appdevicerecord>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_appdevicerecord", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<appdevicerecord> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(appdevicerecord model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<appdevicerecord> lists = new List<appdevicerecord>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_appdevicerecord", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<appdevicerecord> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<appdevicerecord> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<appdevicerecord> result = new List<appdevicerecord>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_appdevicerecord", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                appdevicerecord model = new appdevicerecord();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<appdevicerecord> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<appdevicerecord> result = new List<appdevicerecord>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_appdevicerecord_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                appdevicerecord model = new appdevicerecord();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref appdevicerecord model, DataRow dr)
        {
            //用户编号
            model.userid = Convert.IsDBNull(dr["userid"]) ? 0 : Convert.ToInt64(dr["userid"]);
            //设备id
            model.deviceid = Convert.IsDBNull(dr["deviceid"]) ? string.Empty : Convert.ToString(dr["deviceid"]).Trim();
            //token
            model.token = Convert.IsDBNull(dr["token"]) ? string.Empty : Convert.ToString(dr["token"]).Trim();
            //设备类型(1-PC 2-IPhone 3-Android)
            model.DeviceType = Convert.IsDBNull(dr["DeviceType"]) ? 0 : Convert.ToInt32(dr["DeviceType"]);
            //创建时间
            model.createdatetime = Convert.IsDBNull(dr["createdatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["createdatetime"]);
            //修改时间
            model.modifieddatetime = Convert.IsDBNull(dr["modifieddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["modifieddatetime"]);
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<appdevicerecord> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //用户编号
                lists[i].userid = lists[i].userid == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].userid);
                //设备id
                lists[i].deviceid = string.IsNullOrEmpty(lists[i].deviceid) ? string.Empty : Convert.ToString(lists[i].deviceid).Trim();
                //token
                lists[i].token = string.IsNullOrEmpty(lists[i].token) ? string.Empty : Convert.ToString(lists[i].token).Trim();
                //设备类型(1-PC 2-IPhone 3-Android)
                lists[i].DeviceType = lists[i].DeviceType == null ? Convert.ToInt32(0) : Convert.ToInt32(lists[i].DeviceType);
                //创建时间
                lists[i].createdatetime = lists[i].createdatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].createdatetime.GetValueOrDefault());
                //修改时间
                lists[i].modifieddatetime = lists[i].modifieddatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].modifieddatetime.GetValueOrDefault());
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<appdevicerecord> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].deviceid))
                {
                    if (lists[i].deviceid.Length > 1020)
                    {
                        OutLength = lists[i].deviceid.Length - 1020;
                        message += "字段名[deviceid]描述[设备id]超长、字段最长[1020]实际" + lists[i].deviceid.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].token))
                {
                    if (lists[i].token.Length > 1855)
                    {
                        OutLength = lists[i].token.Length - 1855;
                        message += "字段名[token]描述[token]超长、字段最长[1855]实际" + lists[i].token.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(appdevicerecord model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //用户编号
                     new MySqlParameter("userid",MySqlDbType.Int64,0)
                     {
                        Value=model.userid==null?0:Convert.ToInt64(model.userid)
                     },
                    //设备id
                     new MySqlParameter("deviceid",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.deviceid)?string.Empty:FilteSQLStr(Convert.ToString(model.deviceid))
                     },
                    //token
                     new MySqlParameter("token",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.token)?string.Empty:FilteSQLStr(Convert.ToString(model.token))
                     },
                    //设备类型(1-PC 2-IPhone 3-Android)
                     new MySqlParameter("DeviceType",MySqlDbType.Int32,0)
                     {
                        Value=model.DeviceType==0?0:Convert.ToInt32(model.DeviceType)
                     },
                    //创建时间
                     new MySqlParameter("createdatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.createdatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.createdatetime)
                     },
                    //修改时间
                     new MySqlParameter("modifieddatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.modifieddatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.modifieddatetime)
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<appdevicerecord> lists)
        {
            ArrayList result = new ArrayList();
            foreach (appdevicerecord model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into appdevicerecord(";
                Sql += "userid,";
                Sql += "deviceid,";
                Sql += "token,";
                Sql += "DeviceType,";
                Sql += "createdatetime,";
                Sql += "modifieddatetime";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.userid) + "',";
                Sql += "'" + FilteSQLStr(model.deviceid) + "',";
                Sql += "'" + FilteSQLStr(model.token) + "',";
                Sql += "'" + FilteSQLStr(model.DeviceType) + "',";
                Sql += "DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<appdevicerecord> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (appdevicerecord model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update appdevicerecord set ";
                Sql += "userid='" + FilteSQLStr(model.userid) + "',";
                Sql += "deviceid='" + FilteSQLStr(model.deviceid) + "',";
                Sql += "token='" + FilteSQLStr(model.token) + "',";
                Sql += "DeviceType='" + FilteSQLStr(model.DeviceType) + "',";
                Sql += "createdatetime=DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "modifieddatetime=DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 歌曲信息 
    /// </summary>
    public partial class songinfo_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public songinfo_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public songinfo_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改查

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(songinfo model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<songinfo> lists = new List<songinfo>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_songinfo", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<songinfo> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>0成功、非0失败</returns>
        public int Delete(string SqlWhere,out string message) 
        {
            int result = -1;
            message = string.Empty;
            string sql = " delete from songinfo ";
            if(string.IsNullOrEmpty(SqlWhere))
            {
                message = "删除条件不能为空";
                return result;
            }
            sql += " where " + SqlWhere;
            result = sqlPro.UpdateData(sql, out message);
            return result;
        }

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(songinfo model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<songinfo> lists = new List<songinfo>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_songinfo", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<songinfo> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法

        /// <summary>
        /// 查询前几条歌曲编号
        /// </summary>
        /// <param name="limit">条数</param>
        /// <param name="message">错误消息</param>
        /// <returns>歌曲编号</returns>
        public List<string> QuerySongIDLimit(int limit, out string message) 
        {
            message = string.Empty;
            List<string> result = new List<string>();
            string sql = $" select songId from songinfo ORDER BY createdatetime limit {limit} ";
            DataTable dt = sqlPro.ExecuteDataSet(sql, CommandType.Text, null, out message);
            if (dt != null && dt.Rows.Count > 0) 
            {
                foreach(DataRow dr in dt.Rows) 
                    result.Add(dr[0].ToString());
            }
            return result;
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<songinfo> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<songinfo> result = new List<songinfo>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_songinfo", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                songinfo model = new songinfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<songinfo> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<songinfo> result = new List<songinfo>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_songinfo_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                songinfo model = new songinfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref songinfo model, DataRow dr)
        {
            //歌曲编号
            model.songId = Convert.IsDBNull(dr["songId"]) ? 0 : Convert.ToInt64(dr["songId"]);
            //专辑编号
            model.albumId = Convert.IsDBNull(dr["albumId"]) ? 0 : Convert.ToInt64(dr["albumId"]);
            //歌曲名称
            model.title = Convert.IsDBNull(dr["title"]) ? string.Empty : Convert.ToString(dr["title"]).Trim();
            //专辑封面
            model.cover = Convert.IsDBNull(dr["cover"]) ? string.Empty : Convert.ToString(dr["cover"]).Trim();
            //文件名
            model.fileName = Convert.IsDBNull(dr["fileName"]) ? string.Empty : Convert.ToString(dr["fileName"]).Trim();
            //文件类型
            model.fileType = Convert.IsDBNull(dr["fileType"]) ? string.Empty : Convert.ToString(dr["fileType"]).Trim();
            //文件大小
            model.fileSize = Convert.IsDBNull(dr["fileSize"]) ? 0 : Convert.ToDouble(dr["fileSize"]);
            //歌曲时长
            model.duration = Convert.IsDBNull(dr["duration"]) ? 0 : Convert.ToDouble(dr["duration"]);
            //歌手名
            model.artist = Convert.IsDBNull(dr["artist"]) ? string.Empty : Convert.ToString(dr["artist"]).Trim();
            //年份
            model.year = Convert.IsDBNull(dr["year"]) ? string.Empty : Convert.ToString(dr["year"]).Trim();
            //注释
            model.comment = Convert.IsDBNull(dr["comment"]) ? string.Empty : Convert.ToString(dr["comment"]).Trim();
            //保留位1
            model.reserved1 = Convert.IsDBNull(dr["reserved1"]) ? string.Empty : Convert.ToString(dr["reserved1"]).Trim();
            //保留位2
            model.reserved2 = Convert.IsDBNull(dr["reserved2"]) ? string.Empty : Convert.ToString(dr["reserved2"]).Trim();
            //保留位3
            model.reserved3 = Convert.IsDBNull(dr["reserved3"]) ? string.Empty : Convert.ToString(dr["reserved3"]).Trim();
            //创建人
            model.userid = Convert.IsDBNull(dr["userid"]) ? 0 : Convert.ToInt64(dr["userid"]);
            //创建时间
            model.createdatetime = Convert.IsDBNull(dr["createdatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["createdatetime"]);
            //修改人
            model.modifierId = Convert.IsDBNull(dr["modifierId"]) ? 0 : Convert.ToInt64(dr["modifierId"]);
            //修改时间
            model.modifieddatetime = Convert.IsDBNull(dr["modifieddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["modifieddatetime"]);
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<songinfo> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //歌曲编号
                lists[i].songId = lists[i].songId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].songId);
                //专辑编号
                lists[i].albumId = lists[i].albumId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].albumId);
                //歌曲名称
                lists[i].title = string.IsNullOrEmpty(lists[i].title) ? string.Empty : Convert.ToString(lists[i].title).Trim();
                //专辑封面
                lists[i].cover = string.IsNullOrEmpty(lists[i].cover) ? string.Empty : Convert.ToString(lists[i].cover).Trim();
                //文件名
                lists[i].fileName = string.IsNullOrEmpty(lists[i].fileName) ? string.Empty : Convert.ToString(lists[i].fileName).Trim();
                //文件类型
                lists[i].fileType = string.IsNullOrEmpty(lists[i].fileType) ? string.Empty : Convert.ToString(lists[i].fileType).Trim();
                //文件大小
                lists[i].fileSize = lists[i].fileSize == null ? Convert.ToDouble(0) : Convert.ToDouble(lists[i].fileSize);
                //歌曲时长
                lists[i].duration = lists[i].duration == null ? Convert.ToDouble(0) : Convert.ToDouble(lists[i].duration);
                //歌手名
                lists[i].artist = string.IsNullOrEmpty(lists[i].artist) ? string.Empty : Convert.ToString(lists[i].artist).Trim();
                //年份
                lists[i].year = string.IsNullOrEmpty(lists[i].year) ? string.Empty : Convert.ToString(lists[i].year).Trim();
                //注释
                lists[i].comment = string.IsNullOrEmpty(lists[i].comment) ? string.Empty : Convert.ToString(lists[i].comment).Trim();
                //保留位1
                lists[i].reserved1 = string.IsNullOrEmpty(lists[i].reserved1) ? string.Empty : Convert.ToString(lists[i].reserved1).Trim();
                //保留位2
                lists[i].reserved2 = string.IsNullOrEmpty(lists[i].reserved2) ? string.Empty : Convert.ToString(lists[i].reserved2).Trim();
                //保留位3
                lists[i].reserved3 = string.IsNullOrEmpty(lists[i].reserved3) ? string.Empty : Convert.ToString(lists[i].reserved3).Trim();
                //创建人
                lists[i].userid = lists[i].userid == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].userid);
                //创建时间
                lists[i].createdatetime = lists[i].createdatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].createdatetime.GetValueOrDefault());
                //修改人
                lists[i].modifierId = lists[i].modifierId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].modifierId);
                //修改时间
                lists[i].modifieddatetime = lists[i].modifieddatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].modifieddatetime.GetValueOrDefault());
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<songinfo> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].title))
                {
                    if (lists[i].title.Length > 1020)
                    {
                        OutLength = lists[i].title.Length - 1020;
                        message += "字段名[title]描述[歌曲名称]超长、字段最长[1020]实际" + lists[i].title.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].cover))
                {
                    if (lists[i].cover.Length > 8000)
                    {
                        OutLength = lists[i].cover.Length - 8000;
                        message += "字段名[cover]描述[专辑封面]超长、字段最长[8000]实际" + lists[i].cover.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].fileName))
                {
                    if (lists[i].fileName.Length > 1020)
                    {
                        OutLength = lists[i].fileName.Length - 1020;
                        message += "字段名[fileName]描述[文件名]超长、字段最长[1020]实际" + lists[i].fileName.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].fileType))
                {
                    if (lists[i].fileType.Length > 1020)
                    {
                        OutLength = lists[i].fileType.Length - 1020;
                        message += "字段名[fileType]描述[文件类型]超长、字段最长[1020]实际" + lists[i].fileType.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].artist))
                {
                    if (lists[i].artist.Length > 1020)
                    {
                        OutLength = lists[i].artist.Length - 1020;
                        message += "字段名[artist]描述[歌手名]超长、字段最长[1020]实际" + lists[i].artist.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].year))
                {
                    if (lists[i].year.Length > 1020)
                    {
                        OutLength = lists[i].year.Length - 1020;
                        message += "字段名[year]描述[年份]超长、字段最长[1020]实际" + lists[i].year.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].comment))
                {
                    if (lists[i].comment.Length > 3420)
                    {
                        OutLength = lists[i].comment.Length - 3420;
                        message += "字段名[comment]描述[注释]超长、字段最长[3420]实际" + lists[i].comment.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].reserved1))
                {
                    if (lists[i].reserved1.Length > 12000)
                    {
                        OutLength = lists[i].reserved1.Length - 12000;
                        message += "字段名[reserved1]描述[保留位1]超长、字段最长[12000]实际" + lists[i].reserved1.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].reserved2))
                {
                    if (lists[i].reserved2.Length > 12000)
                    {
                        OutLength = lists[i].reserved2.Length - 12000;
                        message += "字段名[reserved2]描述[保留位2]超长、字段最长[12000]实际" + lists[i].reserved2.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].reserved3))
                {
                    if (lists[i].reserved3.Length > 12000)
                    {
                        OutLength = lists[i].reserved3.Length - 12000;
                        message += "字段名[reserved3]描述[保留位3]超长、字段最长[12000]实际" + lists[i].reserved3.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(songinfo model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //歌曲编号
                     new MySqlParameter("songId",MySqlDbType.Int64,0)
                     {
                        Value=model.songId==null?0:Convert.ToInt64(model.songId)
                     },
                    //专辑编号
                     new MySqlParameter("albumId",MySqlDbType.Int64,0)
                     {
                        Value=model.albumId==null?0:Convert.ToInt64(model.albumId)
                     },
                    //歌曲名称
                     new MySqlParameter("title",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.title)?string.Empty:FilteSQLStr(Convert.ToString(model.title))
                     },
                    //专辑封面
                     new MySqlParameter("cover",MySqlDbType.VarChar,8000)
                     {
                        Value=string.IsNullOrEmpty(model.cover)?string.Empty:FilteSQLStr(Convert.ToString(model.cover))
                     },
                    //文件名
                     new MySqlParameter("fileName",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.fileName)?string.Empty:FilteSQLStr(Convert.ToString(model.fileName))
                     },
                    //文件类型
                     new MySqlParameter("fileType",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.fileType)?string.Empty:FilteSQLStr(Convert.ToString(model.fileType))
                     },
                    //文件大小
                     new MySqlParameter("fileSize",MySqlDbType.Int64,0)
                     {
                         Value=model.fileSize==null?0:model.fileSize
                     },
                    //歌曲时长
                     new MySqlParameter("duration",MySqlDbType.Int64,0)
                     {
                         Value=model.duration==null?0:model.duration
                     },
                    //歌手名
                     new MySqlParameter("artist",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.artist)?string.Empty:FilteSQLStr(Convert.ToString(model.artist))
                     },
                    //年份
                     new MySqlParameter("year",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.year)?string.Empty:FilteSQLStr(Convert.ToString(model.year))
                     },
                    //注释
                     new MySqlParameter("comment",MySqlDbType.VarChar,3420)
                     {
                        Value=string.IsNullOrEmpty(model.comment)?string.Empty:FilteSQLStr(Convert.ToString(model.comment))
                     },
                    //保留位1
                     new MySqlParameter("reserved1",MySqlDbType.VarChar,12000)
                     {
                        Value=string.IsNullOrEmpty(model.reserved1)?string.Empty:FilteSQLStr(Convert.ToString(model.reserved1))
                     },
                    //保留位2
                     new MySqlParameter("reserved2",MySqlDbType.VarChar,12000)
                     {
                        Value=string.IsNullOrEmpty(model.reserved2)?string.Empty:FilteSQLStr(Convert.ToString(model.reserved2))
                     },
                    //保留位3
                     new MySqlParameter("reserved3",MySqlDbType.VarChar,12000)
                     {
                        Value=string.IsNullOrEmpty(model.reserved3)?string.Empty:FilteSQLStr(Convert.ToString(model.reserved3))
                     },
                    //创建人
                     new MySqlParameter("userid",MySqlDbType.Int64,0)
                     {
                        Value=model.userid==null?0:Convert.ToInt64(model.userid)
                     },
                    //创建时间
                     new MySqlParameter("createdatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.createdatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.createdatetime)
                     },
                    //修改人
                     new MySqlParameter("modifierId",MySqlDbType.Int64,0)
                     {
                        Value=model.modifierId==null?0:Convert.ToInt64(model.modifierId)
                     },
                    //修改时间
                     new MySqlParameter("modifieddatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.modifieddatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.modifieddatetime)
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<songinfo> lists)
        {
            ArrayList result = new ArrayList();
            foreach (songinfo model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into songinfo(";
                Sql += "songId,";
                Sql += "albumId,";
                Sql += "title,";
                Sql += "cover,";
                Sql += "fileName,";
                Sql += "fileType,";
                Sql += "fileSize,";
                Sql += "duration,";
                Sql += "artist,";
                Sql += "year,";
                Sql += "comment,";
                Sql += "reserved1,";
                Sql += "reserved2,";
                Sql += "reserved3,";
                Sql += "userid,";
                Sql += "createdatetime,";
                Sql += "modifierId,";
                Sql += "modifieddatetime";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.songId) + "',";
                Sql += "'" + FilteSQLStr(model.albumId) + "',";
                Sql += "'" + FilteSQLStr(model.title) + "',";
                Sql += "'" + model.cover + "',";
                Sql += "'" + FilteSQLStr(model.fileName) + "',";
                Sql += "'" + FilteSQLStr(model.fileType) + "',";
                Sql += "'" + FilteSQLStr(model.fileSize) + "',";
                Sql += "'" + FilteSQLStr(model.duration) + "',";
                Sql += "'" + FilteSQLStr(model.artist) + "',";
                Sql += "'" + FilteSQLStr(model.year) + "',";
                Sql += "'" + FilteSQLStr(model.comment) + "',";
                Sql += "'" + FilteSQLStr(model.reserved1) + "',";
                Sql += "'" + FilteSQLStr(model.reserved2) + "',";
                Sql += "'" + FilteSQLStr(model.reserved3) + "',";
                Sql += "'" + FilteSQLStr(model.userid) + "',";
                Sql += "DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "'" + FilteSQLStr(model.modifierId) + "',";
                Sql += "DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<songinfo> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (songinfo model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update songinfo set ";
                Sql += "songId='" + FilteSQLStr(model.songId) + "',";
                Sql += "albumId='" + FilteSQLStr(model.albumId) + "',";
                Sql += "title='" + FilteSQLStr(model.title) + "',";
                Sql += "cover='" + model.cover + "',";
                Sql += "fileName='" + FilteSQLStr(model.fileName) + "',";
                Sql += "fileType='" + FilteSQLStr(model.fileType) + "',";
                Sql += "fileSize='" + FilteSQLStr(model.fileSize) + "',";
                Sql += "duration='" + FilteSQLStr(model.duration) + "',";
                Sql += "artist='" + FilteSQLStr(model.artist) + "',";
                Sql += "year='" + FilteSQLStr(model.year) + "',";
                Sql += "comment='" + FilteSQLStr(model.comment) + "',";
                Sql += "reserved1='" + FilteSQLStr(model.reserved1) + "',";
                Sql += "reserved2='" + FilteSQLStr(model.reserved2) + "',";
                Sql += "reserved3='" + FilteSQLStr(model.reserved3) + "',";
                Sql += "userid='" + FilteSQLStr(model.userid) + "',";
                Sql += "createdatetime=DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "modifierId='" + FilteSQLStr(model.modifierId) + "',";
                Sql += "modifieddatetime=DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 用户信息 
    /// </summary>
    public partial class userinfo_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public userinfo_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public userinfo_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(userinfo model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<userinfo> lists = new List<userinfo>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_userinfo", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<userinfo> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(userinfo model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<userinfo> lists = new List<userinfo>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_userinfo", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<userinfo> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<userinfo> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<userinfo> result = new List<userinfo>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_userinfo", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                userinfo model = new userinfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<userinfo> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<userinfo> result = new List<userinfo>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_userinfo_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                userinfo model = new userinfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref userinfo model, DataRow dr)
        {
            //用户编号
            model.userid = Convert.IsDBNull(dr["userid"]) ? 0 : Convert.ToInt64(dr["userid"]);
            //用户名
            model.username = Convert.IsDBNull(dr["username"]) ? string.Empty : Convert.ToString(dr["username"]).Trim();
            //密码
            model.password = Convert.IsDBNull(dr["password"]) ? string.Empty : Convert.ToString(dr["password"]).Trim();
            //电子邮件
            model.email = Convert.IsDBNull(dr["email"]) ? string.Empty : Convert.ToString(dr["email"]).Trim();
            //微信号
            model.wechart = Convert.IsDBNull(dr["wechart"]) ? string.Empty : Convert.ToString(dr["wechart"]).Trim();
            //签名
            model.signature = Convert.IsDBNull(dr["signature"]) ? string.Empty : Convert.ToString(dr["signature"]).Trim();
            //创建时间
            model.createdatetime = Convert.IsDBNull(dr["createdatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["createdatetime"]);
            //修改时间
            model.modifieddatetime = Convert.IsDBNull(dr["modifieddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["modifieddatetime"]);
            //用户头像
            model.userface = Convert.IsDBNull(dr["userface"]) ? string.Empty : Convert.ToString(dr["userface"]).Trim();
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<userinfo> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //用户编号
                lists[i].userid = lists[i].userid == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].userid);
                //用户名
                lists[i].username = string.IsNullOrEmpty(lists[i].username) ? string.Empty : Convert.ToString(lists[i].username).Trim();
                //密码
                lists[i].password = string.IsNullOrEmpty(lists[i].password) ? string.Empty : Convert.ToString(lists[i].password).Trim();
                //电子邮件
                lists[i].email = string.IsNullOrEmpty(lists[i].email) ? string.Empty : Convert.ToString(lists[i].email).Trim();
                //微信号
                lists[i].wechart = string.IsNullOrEmpty(lists[i].wechart) ? string.Empty : Convert.ToString(lists[i].wechart).Trim();
                //签名
                lists[i].signature = string.IsNullOrEmpty(lists[i].signature) ? string.Empty : Convert.ToString(lists[i].signature).Trim();
                //创建时间
                lists[i].createdatetime = lists[i].createdatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].createdatetime.GetValueOrDefault());
                //修改时间
                lists[i].modifieddatetime = lists[i].modifieddatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].modifieddatetime.GetValueOrDefault());
                //用户头像
                lists[i].userface = string.IsNullOrEmpty(lists[i].userface) ? string.Empty : Convert.ToString(lists[i].userface).Trim();
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<userinfo> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].username))
                {
                    if (lists[i].username.Length > 60)
                    {
                        OutLength = lists[i].username.Length - 60;
                        message += "字段名[username]描述[用户名]超长、字段最长[60]实际" + lists[i].username.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].password))
                {
                    if (lists[i].password.Length > 270)
                    {
                        OutLength = lists[i].password.Length - 270;
                        message += "字段名[password]描述[密码]超长、字段最长[270]实际" + lists[i].password.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].email))
                {
                    if (lists[i].email.Length > 1020)
                    {
                        OutLength = lists[i].email.Length - 1020;
                        message += "字段名[email]描述[电子邮件]超长、字段最长[1020]实际" + lists[i].email.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].wechart))
                {
                    if (lists[i].wechart.Length > 1020)
                    {
                        OutLength = lists[i].wechart.Length - 1020;
                        message += "字段名[wechart]描述[微信号]超长、字段最长[1020]实际" + lists[i].wechart.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].signature))
                {
                    if (lists[i].signature.Length > 1420)
                    {
                        OutLength = lists[i].signature.Length - 1420;
                        message += "字段名[signature]描述[签名]超长、字段最长[1420]实际" + lists[i].signature.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].userface))
                {
                    if (lists[i].userface.Length > 3420)
                    {
                        OutLength = lists[i].userface.Length - 3420;
                        message += "字段名[userface]描述[用户头像]超长、字段最长[3420]实际" + lists[i].userface.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(userinfo model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //用户编号
                     new MySqlParameter("userid",MySqlDbType.Int64,0)
                     {
                        Value=model.userid==null?0:Convert.ToInt64(model.userid)
                     },
                    //用户名
                     new MySqlParameter("username",MySqlDbType.VarChar,60)
                     {
                        Value=string.IsNullOrEmpty(model.username)?string.Empty:FilteSQLStr(Convert.ToString(model.username))
                     },
                    //密码
                     new MySqlParameter("password",MySqlDbType.VarChar,270)
                     {
                        Value=string.IsNullOrEmpty(model.password)?string.Empty:FilteSQLStr(Convert.ToString(model.password))
                     },
                    //电子邮件
                     new MySqlParameter("email",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.email)?string.Empty:FilteSQLStr(Convert.ToString(model.email))
                     },
                    //微信号
                     new MySqlParameter("wechart",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.wechart)?string.Empty:FilteSQLStr(Convert.ToString(model.wechart))
                     },
                    //签名
                     new MySqlParameter("signature",MySqlDbType.VarChar,1420)
                     {
                        Value=string.IsNullOrEmpty(model.signature)?string.Empty:FilteSQLStr(Convert.ToString(model.signature))
                     },
                    //创建时间
                     new MySqlParameter("createdatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.createdatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.createdatetime)
                     },
                    //修改时间
                     new MySqlParameter("modifieddatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.modifieddatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.modifieddatetime)
                     },
                    //用户头像
                     new MySqlParameter("userface",MySqlDbType.VarChar,3420)
                     {
                        Value=string.IsNullOrEmpty(model.userface)?string.Empty:FilteSQLStr(Convert.ToString(model.userface))
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<userinfo> lists)
        {
            ArrayList result = new ArrayList();
            foreach (userinfo model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into userinfo(";
                Sql += "userid,";
                Sql += "username,";
                Sql += "password,";
                Sql += "email,";
                Sql += "wechart,";
                Sql += "signature,";
                Sql += "createdatetime,";
                Sql += "modifieddatetime,";
                Sql += "userface";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.userid) + "',";
                Sql += "'" + FilteSQLStr(model.username) + "',";
                Sql += "'" + FilteSQLStr(model.password) + "',";
                Sql += "'" + FilteSQLStr(model.email) + "',";
                Sql += "'" + FilteSQLStr(model.wechart) + "',";
                Sql += "'" + FilteSQLStr(model.signature) + "',";
                Sql += "DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "'" + FilteSQLStr(model.userface) + "'";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<userinfo> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (userinfo model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update userinfo set ";
                Sql += "userid='" + FilteSQLStr(model.userid) + "',";
                Sql += "username='" + FilteSQLStr(model.username) + "',";
                Sql += "password='" + FilteSQLStr(model.password) + "',";
                Sql += "email='" + FilteSQLStr(model.email) + "',";
                Sql += "wechart='" + FilteSQLStr(model.wechart) + "',";
                Sql += "signature='" + FilteSQLStr(model.signature) + "',";
                Sql += "createdatetime=DATE_FORMAT('" + model.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "modifieddatetime=DATE_FORMAT('" + model.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "userface='" + FilteSQLStr(model.userface) + "'";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 用户设备视图
    /// </summary>
    public partial class vw_userdeviceinfo_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public vw_userdeviceinfo_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public vw_userdeviceinfo_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_userdeviceinfo> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<vw_userdeviceinfo> result = new List<vw_userdeviceinfo>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("@SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_userdeviceinfo", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                vw_userdeviceinfo model = new vw_userdeviceinfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_userdeviceinfo> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<vw_userdeviceinfo> result = new List<vw_userdeviceinfo>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_userdeviceinfo_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                vw_userdeviceinfo model = new vw_userdeviceinfo();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref vw_userdeviceinfo model, DataRow dr)
        {
            //创建人
            model.Userid = Convert.IsDBNull(dr["Userid"]) ? 0 : Convert.ToInt64(dr["Userid"]);
            //用户名
            model.Username = Convert.IsDBNull(dr["Username"]) ? string.Empty : Convert.ToString(dr["Username"]).Trim();
            //密码
            model.Password = Convert.IsDBNull(dr["Password"]) ? string.Empty : Convert.ToString(dr["Password"]).Trim();
            //电子邮件
            model.Email = Convert.IsDBNull(dr["Email"]) ? string.Empty : Convert.ToString(dr["Email"]).Trim();
            //微信号
            model.Wechart = Convert.IsDBNull(dr["Wechart"]) ? string.Empty : Convert.ToString(dr["Wechart"]).Trim();
            //签名
            model.Signature = Convert.IsDBNull(dr["Signature"]) ? string.Empty : Convert.ToString(dr["Signature"]).Trim();
            //创建时间
            model.Createdatetime = Convert.IsDBNull(dr["Createdatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["Createdatetime"]);
            //修改时间
            model.Modifieddatetime = Convert.IsDBNull(dr["Modifieddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["Modifieddatetime"]);
            //设备id
            model.Deviceid = Convert.IsDBNull(dr["Deviceid"]) ? string.Empty : Convert.ToString(dr["Deviceid"]).Trim();
            //token
            model.Token = Convert.IsDBNull(dr["Token"]) ? string.Empty : Convert.ToString(dr["Token"]).Trim();
            //设备类型(1-PC 2-IPhone 3-Android)
            model.DeviceType = Convert.IsDBNull(dr["DeviceType"]) ? 0 : Convert.ToInt32(dr["DeviceType"]);
            //用户头像
            model.Userface = Convert.IsDBNull(dr["Userface"]) ? string.Empty : Convert.ToString(dr["Userface"]).Trim();
        }
        #endregion
    }

    /// <summary>
    /// 最近收听记录 
    /// </summary>
    public partial class recentlylistened_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public recentlylistened_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public recentlylistened_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(recentlylistened model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<recentlylistened> lists = new List<recentlylistened>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_recentlylistened", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<recentlylistened> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(recentlylistened model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<recentlylistened> lists = new List<recentlylistened>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_recentlylistened", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<recentlylistened> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法

        /// <summary>
        /// 查询并过滤重复专辑编号
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns></returns>
        public List<string> QueryDistinctAlbumId(string SqlWhere,out string message) 
        {
            message = string.Empty;
            string sql = "SELECT DISTINCT AlbumId FROM `recentlylistened`";
            List<string> result = new List<string>();
            DataTable dt = null;
            if (!string.IsNullOrEmpty(SqlWhere)) 
            {
                sql += $" where {SqlWhere}";
            }
            dt= sqlPro.ExecuteDataSet(sql, CommandType.Text, null, out message);
            if(dt != null && dt.Rows.Count > 0) 
            {
                foreach(DataRow dr in dt.Rows) 
                {
                    result.Add(dr[0].ToString());
                }
            }
            return result;
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<recentlylistened> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<recentlylistened> result = new List<recentlylistened>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_recentlylistened", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                recentlylistened model = new recentlylistened();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<recentlylistened> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<recentlylistened> result = new List<recentlylistened>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_recentlylistened_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                recentlylistened model = new recentlylistened();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref recentlylistened model, DataRow dr)
        {
            //主键编号
            model.RecordID = Convert.IsDBNull(dr["RecordID"]) ? 0 : Convert.ToInt64(dr["RecordID"]);
            //用户编号
            model.UserID = Convert.IsDBNull(dr["UserID"]) ? 0 : Convert.ToInt64(dr["UserID"]);
            //歌曲编号
            model.SongId = Convert.IsDBNull(dr["SongId"]) ? 0 : Convert.ToInt64(dr["SongId"]);
            //专辑编号
            model.AlbumId = Convert.IsDBNull(dr["AlbumId"]) ? 0 : Convert.ToInt64(dr["AlbumId"]);
            //创建时间
            model.CreatedDataTime = Convert.IsDBNull(dr["CreatedDataTime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["CreatedDataTime"]);
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<recentlylistened> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //主键编号
                lists[i].RecordID = lists[i].RecordID == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].RecordID);
                //用户编号
                lists[i].UserID = lists[i].UserID == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].UserID);
                //歌曲编号
                lists[i].SongId = lists[i].SongId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].SongId);
                //专辑编号
                lists[i].AlbumId = lists[i].AlbumId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].AlbumId);
                //创建时间
                lists[i].CreatedDataTime = lists[i].CreatedDataTime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].CreatedDataTime.GetValueOrDefault());
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<recentlylistened> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(recentlylistened model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //主键编号
                     new MySqlParameter("RecordID",MySqlDbType.Int64,0)
                     {
                        Value=model.RecordID==null?0:Convert.ToInt64(model.RecordID)
                     },
                    //用户编号
                     new MySqlParameter("UserID",MySqlDbType.Int64,0)
                     {
                        Value=model.UserID==null?0:Convert.ToInt64(model.UserID)
                     },
                    //歌曲编号
                     new MySqlParameter("SongId",MySqlDbType.Int64,0)
                     {
                        Value=model.SongId==null?0:Convert.ToInt64(model.SongId)
                     },
                    //专辑编号
                     new MySqlParameter("AlbumId",MySqlDbType.Int64,0)
                     {
                        Value=model.AlbumId==null?0:Convert.ToInt64(model.AlbumId)
                     },
                    //创建时间
                     new MySqlParameter("CreatedDataTime",MySqlDbType.Datetime,0)
                     {
                        Value=model.CreatedDataTime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.CreatedDataTime)
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<recentlylistened> lists)
        {
            ArrayList result = new ArrayList();
            foreach (recentlylistened model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into recentlylistened(";
                Sql += "RecordID,";
                Sql += "UserID,";
                Sql += "SongId,";
                Sql += "AlbumId,";
                Sql += "CreatedDataTime";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.RecordID) + "',";
                Sql += "'" + FilteSQLStr(model.UserID) + "',";
                Sql += "'" + FilteSQLStr(model.SongId) + "',";
                Sql += "'" + FilteSQLStr(model.AlbumId) + "',";
                Sql += "DATE_FORMAT('" + model.CreatedDataTime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<recentlylistened> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (recentlylistened model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update recentlylistened set ";
                Sql += "RecordID='" + FilteSQLStr(model.RecordID) + "',";
                Sql += "UserID='" + FilteSQLStr(model.UserID) + "',";
                Sql += "SongId='" + FilteSQLStr(model.SongId) + "',";
                Sql += "AlbumId='" + FilteSQLStr(model.AlbumId) + "',";
                Sql += "CreatedDataTime=DATE_FORMAT('" + model.CreatedDataTime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 歌曲评论 
    /// </summary>
    public partial class songcomment_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public songcomment_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public songcomment_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(songcomment model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<songcomment> lists = new List<songcomment>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_songcomment", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<songcomment> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(songcomment model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<songcomment> lists = new List<songcomment>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_songcomment", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<songcomment> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<songcomment> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<songcomment> result = new List<songcomment>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_songcomment", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                songcomment model = new songcomment();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<songcomment> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<songcomment> result = new List<songcomment>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_songcomment_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                songcomment model = new songcomment();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref songcomment model, DataRow dr)
        {
            //评论编号
            model.commentId = Convert.IsDBNull(dr["commentId"]) ? 0 : Convert.ToInt64(dr["commentId"]);
            //歌曲编号
            model.songId = Convert.IsDBNull(dr["songId"]) ? 0 : Convert.ToInt64(dr["songId"]);
            //发布者
            model.publisher = Convert.IsDBNull(dr["publisher"]) ? 0 : Convert.ToInt64(dr["publisher"]);
            //评论内容
            model.content = Convert.IsDBNull(dr["content"]) ? string.Empty : Convert.ToString(dr["content"]).Trim();
            //发布时间
            model.createddatetime = Convert.IsDBNull(dr["createddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["createddatetime"]);
            //备用字段01
            model.backup01 = Convert.IsDBNull(dr["backup01"]) ? string.Empty : Convert.ToString(dr["backup01"]).Trim();
            //备用字段02
            model.backup02 = Convert.IsDBNull(dr["backup02"]) ? string.Empty : Convert.ToString(dr["backup02"]).Trim();
            //备用字段03
            model.backup03 = Convert.IsDBNull(dr["backup03"]) ? string.Empty : Convert.ToString(dr["backup03"]).Trim();
            //状态
            model.state = Convert.IsDBNull(dr["state"]) ? 0 : Convert.ToInt32(dr["state"]);
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<songcomment> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //评论编号
                lists[i].commentId = lists[i].commentId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].commentId);
                //歌曲编号
                lists[i].songId = lists[i].songId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].songId);
                //发布者
                lists[i].publisher = lists[i].publisher == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].publisher);
                //评论内容
                lists[i].content = string.IsNullOrEmpty(lists[i].content) ? string.Empty : Convert.ToString(lists[i].content).Trim();
                //发布时间
                lists[i].createddatetime = lists[i].createddatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].createddatetime.GetValueOrDefault());
                //备用字段01
                lists[i].backup01 = string.IsNullOrEmpty(lists[i].backup01) ? string.Empty : Convert.ToString(lists[i].backup01).Trim();
                //备用字段02
                lists[i].backup02 = string.IsNullOrEmpty(lists[i].backup02) ? string.Empty : Convert.ToString(lists[i].backup02).Trim();
                //备用字段03
                lists[i].backup03 = string.IsNullOrEmpty(lists[i].backup03) ? string.Empty : Convert.ToString(lists[i].backup03).Trim();
                //状态
                lists[i].state = lists[i].state == null ? Convert.ToInt32(0) : Convert.ToInt32(lists[i].state);
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<songcomment> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].content))
                {
                    if (lists[i].content.Length > 2620)
                    {
                        OutLength = lists[i].content.Length - 2620;
                        message += "字段名[content]描述[评论内容]超长、字段最长[2620]实际" + lists[i].content.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup01))
                {
                    if (lists[i].backup01.Length > 1020)
                    {
                        OutLength = lists[i].backup01.Length - 1020;
                        message += "字段名[backup01]描述[备用字段01]超长、字段最长[1020]实际" + lists[i].backup01.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup02))
                {
                    if (lists[i].backup02.Length > 1020)
                    {
                        OutLength = lists[i].backup02.Length - 1020;
                        message += "字段名[backup02]描述[备用字段02]超长、字段最长[1020]实际" + lists[i].backup02.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup03))
                {
                    if (lists[i].backup03.Length > 1020)
                    {
                        OutLength = lists[i].backup03.Length - 1020;
                        message += "字段名[backup03]描述[备用字段03]超长、字段最长[1020]实际" + lists[i].backup03.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(songcomment model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //评论编号
                     new MySqlParameter("commentId",MySqlDbType.Int64,0)
                     {
                        Value=model.commentId==null?0:Convert.ToInt64(model.commentId)
                     },
                    //歌曲编号
                     new MySqlParameter("songId",MySqlDbType.Int64,0)
                     {
                        Value=model.songId==null?0:Convert.ToInt64(model.songId)
                     },
                    //发布者
                     new MySqlParameter("publisher",MySqlDbType.Int64,0)
                     {
                        Value=model.publisher==null?0:Convert.ToInt64(model.publisher)
                     },
                    //评论内容
                     new MySqlParameter("content",MySqlDbType.VarChar,2620)
                     {
                        Value=string.IsNullOrEmpty(model.content)?string.Empty:FilteSQLStr(Convert.ToString(model.content))
                     },
                    //发布时间
                     new MySqlParameter("createddatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.createddatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.createddatetime)
                     },
                    //备用字段01
                     new MySqlParameter("backup01",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup01)?string.Empty:FilteSQLStr(Convert.ToString(model.backup01))
                     },
                    //备用字段02
                     new MySqlParameter("backup02",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup02)?string.Empty:FilteSQLStr(Convert.ToString(model.backup02))
                     },
                    //备用字段03
                     new MySqlParameter("backup03",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup03)?string.Empty:FilteSQLStr(Convert.ToString(model.backup03))
                     },
                    //状态
                     new MySqlParameter("state",MySqlDbType.Int32,0)
                     {
                        Value=model.state==0?0:Convert.ToInt32(model.state)
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<songcomment> lists)
        {
            ArrayList result = new ArrayList();
            foreach (songcomment model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into songcomment(";
                Sql += "commentId,";
                Sql += "songId,";
                Sql += "publisher,";
                Sql += "content,";
                Sql += "createddatetime,";
                Sql += "backup01,";
                Sql += "backup02,";
                Sql += "backup03,";
                Sql += "state";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.commentId) + "',";
                Sql += "'" + FilteSQLStr(model.songId) + "',";
                Sql += "'" + FilteSQLStr(model.publisher) + "',";
                Sql += "'" + FilteSQLStr(model.content) + "',";
                Sql += "DATE_FORMAT('" + model.createddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "'" + FilteSQLStr(model.backup01) + "',";
                Sql += "'" + FilteSQLStr(model.backup02) + "',";
                Sql += "'" + FilteSQLStr(model.backup03) + "',";
                Sql += "'" + FilteSQLStr(model.state) + "'";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<songcomment> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (songcomment model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update songcomment set ";
                Sql += "commentId='" + FilteSQLStr(model.commentId) + "',";
                Sql += "songId='" + FilteSQLStr(model.songId) + "',";
                Sql += "publisher='" + FilteSQLStr(model.publisher) + "',";
                Sql += "content='" + FilteSQLStr(model.content) + "',";
                Sql += "createddatetime=DATE_FORMAT('" + model.createddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "backup01='" + FilteSQLStr(model.backup01) + "',";
                Sql += "backup02='" + FilteSQLStr(model.backup02) + "',";
                Sql += "backup03='" + FilteSQLStr(model.backup03) + "',";
                Sql += "state='" + FilteSQLStr(model.state) + "'";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 收听历史 
    /// </summary>
    public partial class listeninghistory_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public listeninghistory_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public listeninghistory_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(listeninghistory model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<listeninghistory> lists = new List<listeninghistory>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_listeninghistory", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<listeninghistory> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(listeninghistory model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<listeninghistory> lists = new List<listeninghistory>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_listeninghistory", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<listeninghistory> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<listeninghistory> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<listeninghistory> result = new List<listeninghistory>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_listeninghistory", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                listeninghistory model = new listeninghistory();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<listeninghistory> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<listeninghistory> result = new List<listeninghistory>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_listeninghistory_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                listeninghistory model = new listeninghistory();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref listeninghistory model, DataRow dr)
        {
            //记录编号
            model.recordId = Convert.IsDBNull(dr["recordId"]) ? 0 : Convert.ToInt64(dr["recordId"]);
            //歌曲编号
            model.songId = Convert.IsDBNull(dr["songId"]) ? 0 : Convert.ToInt64(dr["songId"]);
            //用户编号
            model.userId = Convert.IsDBNull(dr["userId"]) ? 0 : Convert.ToInt64(dr["userId"]);
            //备用字段01
            model.backup01 = Convert.IsDBNull(dr["backup01"]) ? string.Empty : Convert.ToString(dr["backup01"]).Trim();
            //备用字段02
            model.backup02 = Convert.IsDBNull(dr["backup02"]) ? string.Empty : Convert.ToString(dr["backup02"]).Trim();
            //备用字段03
            model.backup03 = Convert.IsDBNull(dr["backup03"]) ? string.Empty : Convert.ToString(dr["backup03"]).Trim();
            //创建时间
            model.CreationDateTime = Convert.IsDBNull(dr["CreationDateTime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["CreationDateTime"]);
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<listeninghistory> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //记录编号
                lists[i].recordId = lists[i].recordId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].recordId);
                //歌曲编号
                lists[i].songId = lists[i].songId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].songId);
                //用户编号
                lists[i].userId = lists[i].userId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].userId);
                //备用字段01
                lists[i].backup01 = string.IsNullOrEmpty(lists[i].backup01) ? string.Empty : Convert.ToString(lists[i].backup01).Trim();
                //备用字段02
                lists[i].backup02 = string.IsNullOrEmpty(lists[i].backup02) ? string.Empty : Convert.ToString(lists[i].backup02).Trim();
                //备用字段03
                lists[i].backup03 = string.IsNullOrEmpty(lists[i].backup03) ? string.Empty : Convert.ToString(lists[i].backup03).Trim();
                //创建时间
                lists[i].CreationDateTime = lists[i].CreationDateTime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].CreationDateTime.GetValueOrDefault());
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<listeninghistory> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].backup01))
                {
                    if (lists[i].backup01.Length > 1020)
                    {
                        OutLength = lists[i].backup01.Length - 1020;
                        message += "字段名[backup01]描述[备用字段01]超长、字段最长[1020]实际" + lists[i].backup01.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup02))
                {
                    if (lists[i].backup02.Length > 1020)
                    {
                        OutLength = lists[i].backup02.Length - 1020;
                        message += "字段名[backup02]描述[备用字段02]超长、字段最长[1020]实际" + lists[i].backup02.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup03))
                {
                    if (lists[i].backup03.Length > 1020)
                    {
                        OutLength = lists[i].backup03.Length - 1020;
                        message += "字段名[backup03]描述[备用字段03]超长、字段最长[1020]实际" + lists[i].backup03.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(listeninghistory model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //记录编号
                     new MySqlParameter("recordId",MySqlDbType.Int64,0)
                     {
                        Value=model.recordId==null?0:Convert.ToInt64(model.recordId)
                     },
                    //歌曲编号
                     new MySqlParameter("songId",MySqlDbType.Int64,0)
                     {
                        Value=model.songId==null?0:Convert.ToInt64(model.songId)
                     },
                    //用户编号
                     new MySqlParameter("userId",MySqlDbType.Int64,0)
                     {
                        Value=model.userId==null?0:Convert.ToInt64(model.userId)
                     },
                    //备用字段01
                     new MySqlParameter("backup01",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup01)?string.Empty:FilteSQLStr(Convert.ToString(model.backup01))
                     },
                    //备用字段02
                     new MySqlParameter("backup02",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup02)?string.Empty:FilteSQLStr(Convert.ToString(model.backup02))
                     },
                    //备用字段03
                     new MySqlParameter("backup03",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup03)?string.Empty:FilteSQLStr(Convert.ToString(model.backup03))
                     },
                    //创建时间
                     new MySqlParameter("CreationDateTime",MySqlDbType.Datetime,0)
                     {
                        Value=model.CreationDateTime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.CreationDateTime)
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<listeninghistory> lists)
        {
            ArrayList result = new ArrayList();
            foreach (listeninghistory model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into listeninghistory(";
                Sql += "recordId,";
                Sql += "songId,";
                Sql += "userId,";
                Sql += "backup01,";
                Sql += "backup02,";
                Sql += "backup03,";
                Sql += "CreationDateTime";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.recordId) + "',";
                Sql += "'" + FilteSQLStr(model.songId) + "',";
                Sql += "'" + FilteSQLStr(model.userId) + "',";
                Sql += "'" + FilteSQLStr(model.backup01) + "',";
                Sql += "'" + FilteSQLStr(model.backup02) + "',";
                Sql += "'" + FilteSQLStr(model.backup03) + "',";
                Sql += "DATE_FORMAT('" + model.CreationDateTime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<listeninghistory> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (listeninghistory model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update listeninghistory set ";
                Sql += "recordId='" + FilteSQLStr(model.recordId) + "',";
                Sql += "songId='" + FilteSQLStr(model.songId) + "',";
                Sql += "userId='" + FilteSQLStr(model.userId) + "',";
                Sql += "backup01='" + FilteSQLStr(model.backup01) + "',";
                Sql += "backup02='" + FilteSQLStr(model.backup02) + "',";
                Sql += "backup03='" + FilteSQLStr(model.backup03) + "',";
                Sql += "CreationDateTime=DATE_FORMAT('" + model.CreationDateTime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s')";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 歌曲评论视图
    /// </summary>
    public partial class vw_songcomment_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public vw_songcomment_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public vw_songcomment_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_songcomment> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<vw_songcomment> result = new List<vw_songcomment>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("@SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_songcomment", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                vw_songcomment model = new vw_songcomment();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_songcomment> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<vw_songcomment> result = new List<vw_songcomment>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_songcomment_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                vw_songcomment model = new vw_songcomment();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref vw_songcomment model, DataRow dr)
        {
            //评论编号
            model.CommentId = Convert.IsDBNull(dr["CommentId"]) ? 0 : Convert.ToInt64(dr["CommentId"]);
            //歌曲编号
            model.SongId = Convert.IsDBNull(dr["SongId"]) ? 0 : Convert.ToInt64(dr["SongId"]);
            //发布者
            model.Publisher = Convert.IsDBNull(dr["Publisher"]) ? 0 : Convert.ToInt64(dr["Publisher"]);
            //评论内容
            model.Content = Convert.IsDBNull(dr["Content"]) ? string.Empty : Convert.ToString(dr["Content"]).Trim();
            //发布时间
            model.Createddatetime = Convert.IsDBNull(dr["Createddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["Createddatetime"]);
            //备用字段01
            model.Backup01 = Convert.IsDBNull(dr["Backup01"]) ? string.Empty : Convert.ToString(dr["Backup01"]).Trim();
            //备用字段02
            model.Backup02 = Convert.IsDBNull(dr["Backup02"]) ? string.Empty : Convert.ToString(dr["Backup02"]).Trim();
            //备用字段03
            model.Backup03 = Convert.IsDBNull(dr["Backup03"]) ? string.Empty : Convert.ToString(dr["Backup03"]).Trim();
            //用户名
            model.Username = Convert.IsDBNull(dr["Username"]) ? string.Empty : Convert.ToString(dr["Username"]).Trim();
            //用户头像
            model.Userface = Convert.IsDBNull(dr["Userface"]) ? string.Empty : Convert.ToString(dr["Userface"]).Trim();
            //状态
            model.State = Convert.IsDBNull(dr["State"]) ? 0 : Convert.ToInt32(dr["State"]);
        }
        #endregion
    }

    /// <summary>
    /// 歌曲收听记录
    /// </summary>
    public partial class vw_recentlylistened_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public vw_recentlylistened_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public vw_recentlylistened_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_recentlylistened> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<vw_recentlylistened> result = new List<vw_recentlylistened>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("@SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_recentlylistened", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                vw_recentlylistened model = new vw_recentlylistened();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_recentlylistened> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<vw_recentlylistened> result = new List<vw_recentlylistened>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_recentlylistened_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                vw_recentlylistened model = new vw_recentlylistened();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref vw_recentlylistened model, DataRow dr)
        {
            //主键编号
            model.RecordID = Convert.IsDBNull(dr["RecordID"]) ? 0 : Convert.ToInt64(dr["RecordID"]);
            //用户编号
            model.UserID = Convert.IsDBNull(dr["UserID"]) ? 0 : Convert.ToInt64(dr["UserID"]);
            //歌曲编号
            model.SongId = Convert.IsDBNull(dr["SongId"]) ? 0 : Convert.ToInt64(dr["SongId"]);
            //专辑编号
            model.AlbumId = Convert.IsDBNull(dr["AlbumId"]) ? 0 : Convert.ToInt64(dr["AlbumId"]);
            //创建时间
            model.CreatedDataTime = Convert.IsDBNull(dr["CreatedDataTime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["CreatedDataTime"]);
            //用户名
            model.Username = Convert.IsDBNull(dr["Username"]) ? string.Empty : Convert.ToString(dr["Username"]).Trim();
            //用户头像
            model.Userface = Convert.IsDBNull(dr["Userface"]) ? string.Empty : Convert.ToString(dr["Userface"]).Trim();
            //歌曲名称
            model.Title = Convert.IsDBNull(dr["Title"]) ? string.Empty : Convert.ToString(dr["Title"]).Trim();
            //专辑封面
            model.Cover = Convert.IsDBNull(dr["Cover"]) ? string.Empty : Convert.ToString(dr["Cover"]).Trim();
            //歌手名
            model.Artist = Convert.IsDBNull(dr["Artist"]) ? string.Empty : Convert.ToString(dr["Artist"]).Trim();
            //歌曲时长
            model.Duration = Convert.IsDBNull(dr["Duration"]) ? 0 : Convert.ToDouble(dr["Duration"]);
            //年份
            model.Year = Convert.IsDBNull(dr["Year"]) ? string.Empty : Convert.ToString(dr["Year"]).Trim();
            //注释
            model.Comment = Convert.IsDBNull(dr["Comment"]) ? string.Empty : Convert.ToString(dr["Comment"]).Trim();
            //文件名
            model.FileName = Convert.IsDBNull(dr["FileName"]) ? string.Empty : Convert.ToString(dr["FileName"]).Trim();
            //文件类型
            model.FileType = Convert.IsDBNull(dr["FileType"]) ? string.Empty : Convert.ToString(dr["FileType"]).Trim();
            //文件大小
            model.FileSize = Convert.IsDBNull(dr["FileSize"]) ? 0 : Convert.ToDouble(dr["FileSize"]);
            //专辑名称
            model.AlbumName = Convert.IsDBNull(dr["AlbumName"]) ? string.Empty : Convert.ToString(dr["AlbumName"]).Trim();
            //专辑作者
            model.AlbumAuthor = Convert.IsDBNull(dr["AlbumAuthor"]) ? string.Empty : Convert.ToString(dr["AlbumAuthor"]).Trim();
            //专辑简介
            model.AlbumIntro = Convert.IsDBNull(dr["AlbumIntro"]) ? string.Empty : Convert.ToString(dr["AlbumIntro"]).Trim();
            //专辑封面
            model.AlbumCover = Convert.IsDBNull(dr["AlbumCover"]) ? string.Empty : Convert.ToString(dr["AlbumCover"]).Trim();
            //浏览次数
            model.ViewCount = Convert.IsDBNull(dr["ViewCount"]) ? 0 : Convert.ToInt32(dr["ViewCount"]);
            //分享次数
            model.ShareCount = Convert.IsDBNull(dr["ShareCount"]) ? 0 : Convert.ToInt32(dr["ShareCount"]);
            //歌曲数量
            model.SongLength = Convert.IsDBNull(dr["SongLength"]) ? 0 : Convert.ToInt32(dr["SongLength"]);
        }
        #endregion
    }

    /// <summary>
    /// 分享历史 
    /// </summary
    public partial class sharinghistory_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public sharinghistory_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public sharinghistory_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(sharinghistory model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<sharinghistory> lists = new List<sharinghistory>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_sharinghistory", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<sharinghistory> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(sharinghistory model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<sharinghistory> lists = new List<sharinghistory>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_sharinghistory", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<sharinghistory> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<sharinghistory> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<sharinghistory> result = new List<sharinghistory>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_sharinghistory", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                sharinghistory model = new sharinghistory();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<sharinghistory> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<sharinghistory> result = new List<sharinghistory>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_sharinghistory_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                sharinghistory model = new sharinghistory();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref sharinghistory model, DataRow dr)
        {
            //记录编号
            model.recordId = Convert.IsDBNull(dr["recordId"]) ? 0 : Convert.ToInt64(dr["recordId"]);
            //歌曲编号
            model.songId = Convert.IsDBNull(dr["songId"]) ? 0 : Convert.ToInt64(dr["songId"]);
            //分享目标用户编号
            model.shareTarget = Convert.IsDBNull(dr["shareTarget"]) ? 0 : Convert.ToInt64(dr["shareTarget"]);
            //分享用户编号
            model.shareUser = Convert.IsDBNull(dr["shareUser"]) ? 0 : Convert.ToInt64(dr["shareUser"]);
            //创建时间
            model.CreatedDataTime = Convert.IsDBNull(dr["CreatedDataTime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["CreatedDataTime"]);
            //备用字段01
            model.backup01 = Convert.IsDBNull(dr["backup01"]) ? string.Empty : Convert.ToString(dr["backup01"]).Trim();
            //备用字段02
            model.backup02 = Convert.IsDBNull(dr["backup02"]) ? string.Empty : Convert.ToString(dr["backup02"]).Trim();
            //备用字段03
            model.backup03 = Convert.IsDBNull(dr["backup03"]) ? string.Empty : Convert.ToString(dr["backup03"]).Trim();
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<sharinghistory> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //记录编号
                lists[i].recordId = lists[i].recordId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].recordId);
                //歌曲编号
                lists[i].songId = lists[i].songId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].songId);
                //分享目标用户编号
                lists[i].shareTarget = lists[i].shareTarget == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].shareTarget);
                //分享用户编号
                lists[i].shareUser = lists[i].shareUser == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].shareUser);
                //创建时间
                lists[i].CreatedDataTime = lists[i].CreatedDataTime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].CreatedDataTime.GetValueOrDefault());
                //备用字段01
                lists[i].backup01 = string.IsNullOrEmpty(lists[i].backup01) ? string.Empty : Convert.ToString(lists[i].backup01).Trim();
                //备用字段02
                lists[i].backup02 = string.IsNullOrEmpty(lists[i].backup02) ? string.Empty : Convert.ToString(lists[i].backup02).Trim();
                //备用字段03
                lists[i].backup03 = string.IsNullOrEmpty(lists[i].backup03) ? string.Empty : Convert.ToString(lists[i].backup03).Trim();
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<sharinghistory> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].backup01))
                {
                    if (lists[i].backup01.Length > 1020)
                    {
                        OutLength = lists[i].backup01.Length - 1020;
                        message += "字段名[backup01]描述[备用字段01]超长、字段最长[1020]实际" + lists[i].backup01.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup02))
                {
                    if (lists[i].backup02.Length > 1020)
                    {
                        OutLength = lists[i].backup02.Length - 1020;
                        message += "字段名[backup02]描述[备用字段02]超长、字段最长[1020]实际" + lists[i].backup02.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup03))
                {
                    if (lists[i].backup03.Length > 1020)
                    {
                        OutLength = lists[i].backup03.Length - 1020;
                        message += "字段名[backup03]描述[备用字段03]超长、字段最长[1020]实际" + lists[i].backup03.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(sharinghistory model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //记录编号
                     new MySqlParameter("recordId",MySqlDbType.Int64,0)
                     {
                        Value=model.recordId==null?0:Convert.ToInt64(model.recordId)
                     },
                    //歌曲编号
                     new MySqlParameter("songId",MySqlDbType.Int64,0)
                     {
                        Value=model.songId==null?0:Convert.ToInt64(model.songId)
                     },
                    //分享目标用户编号
                     new MySqlParameter("shareTarget",MySqlDbType.Int64,0)
                     {
                        Value=model.shareTarget==null?0:Convert.ToInt64(model.shareTarget)
                     },
                    //分享用户编号
                     new MySqlParameter("shareUser",MySqlDbType.Int64,0)
                     {
                        Value=model.shareUser==null?0:Convert.ToInt64(model.shareUser)
                     },
                    //创建时间
                     new MySqlParameter("CreatedDataTime",MySqlDbType.Datetime,0)
                     {
                        Value=model.CreatedDataTime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.CreatedDataTime)
                     },
                    //备用字段01
                     new MySqlParameter("backup01",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup01)?string.Empty:FilteSQLStr(Convert.ToString(model.backup01))
                     },
                    //备用字段02
                     new MySqlParameter("backup02",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup02)?string.Empty:FilteSQLStr(Convert.ToString(model.backup02))
                     },
                    //备用字段03
                     new MySqlParameter("backup03",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup03)?string.Empty:FilteSQLStr(Convert.ToString(model.backup03))
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<sharinghistory> lists)
        {
            ArrayList result = new ArrayList();
            foreach (sharinghistory model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into sharinghistory(";
                Sql += "recordId,";
                Sql += "songId,";
                Sql += "shareTarget,";
                Sql += "shareUser,";
                Sql += "CreatedDataTime,";
                Sql += "backup01,";
                Sql += "backup02,";
                Sql += "backup03";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.recordId) + "',";
                Sql += "'" + FilteSQLStr(model.songId) + "',";
                Sql += "'" + FilteSQLStr(model.shareTarget) + "',";
                Sql += "'" + FilteSQLStr(model.shareUser) + "',";
                Sql += "DATE_FORMAT('" + model.CreatedDataTime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "'" + FilteSQLStr(model.backup01) + "',";
                Sql += "'" + FilteSQLStr(model.backup02) + "',";
                Sql += "'" + FilteSQLStr(model.backup03) + "'";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<sharinghistory> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (sharinghistory model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update sharinghistory set ";
                Sql += "recordId='" + FilteSQLStr(model.recordId) + "',";
                Sql += "songId='" + FilteSQLStr(model.songId) + "',";
                Sql += "shareTarget='" + FilteSQLStr(model.shareTarget) + "',";
                Sql += "shareUser='" + FilteSQLStr(model.shareUser) + "',";
                Sql += "CreatedDataTime=DATE_FORMAT('" + model.CreatedDataTime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "backup01='" + FilteSQLStr(model.backup01) + "',";
                Sql += "backup02='" + FilteSQLStr(model.backup02) + "',";
                Sql += "backup03='" + FilteSQLStr(model.backup03) + "'";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 分享历史视图
    /// </summary>
    public partial class vw_sharinghistory_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public vw_sharinghistory_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public vw_sharinghistory_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_sharinghistory> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<vw_sharinghistory> result = new List<vw_sharinghistory>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("@SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_sharinghistory", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                vw_sharinghistory model = new vw_sharinghistory();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_sharinghistory> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<vw_sharinghistory> result = new List<vw_sharinghistory>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_sharinghistory_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                vw_sharinghistory model = new vw_sharinghistory();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref vw_sharinghistory model, DataRow dr)
        {
            //记录编号
            model.RecordId = Convert.IsDBNull(dr["RecordId"]) ? 0 : Convert.ToInt64(dr["RecordId"]);
            //歌曲编号
            model.SongId = Convert.IsDBNull(dr["SongId"]) ? 0 : Convert.ToInt64(dr["SongId"]);
            //分享目标用户编号
            model.ShareTarget = Convert.IsDBNull(dr["ShareTarget"]) ? 0 : Convert.ToInt64(dr["ShareTarget"]);
            //分享用户编号
            model.ShareUser = Convert.IsDBNull(dr["ShareUser"]) ? 0 : Convert.ToInt64(dr["ShareUser"]);
            //创建时间
            model.CreatedDataTime = Convert.IsDBNull(dr["CreatedDataTime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["CreatedDataTime"]);
            //备用字段01
            model.Backup01 = Convert.IsDBNull(dr["Backup01"]) ? string.Empty : Convert.ToString(dr["Backup01"]).Trim();
            //备用字段02
            model.Backup02 = Convert.IsDBNull(dr["Backup02"]) ? string.Empty : Convert.ToString(dr["Backup02"]).Trim();
            //备用字段03
            model.Backup03 = Convert.IsDBNull(dr["Backup03"]) ? string.Empty : Convert.ToString(dr["Backup03"]).Trim();
            //歌曲名称
            model.Title = Convert.IsDBNull(dr["Title"]) ? string.Empty : Convert.ToString(dr["Title"]).Trim();
            //专辑封面
            model.Cover = Convert.IsDBNull(dr["Cover"]) ? string.Empty : Convert.ToString(dr["Cover"]).Trim();
            //文件名
            model.FileName = Convert.IsDBNull(dr["FileName"]) ? string.Empty : Convert.ToString(dr["FileName"]).Trim();
            //文件类型
            model.FileType = Convert.IsDBNull(dr["FileType"]) ? string.Empty : Convert.ToString(dr["FileType"]).Trim();
            //文件大小
            model.FileSize = Convert.IsDBNull(dr["FileSize"]) ? 0 : Convert.ToDouble(dr["FileSize"]);
            //歌曲时长
            model.Duration = Convert.IsDBNull(dr["Duration"]) ? 0 : Convert.ToDouble(dr["Duration"]);
            //歌手名
            model.Artist = Convert.IsDBNull(dr["Artist"]) ? string.Empty : Convert.ToString(dr["Artist"]).Trim();
            //年份
            model.Year = Convert.IsDBNull(dr["Year"]) ? string.Empty : Convert.ToString(dr["Year"]).Trim();
            //注释
            model.Comment = Convert.IsDBNull(dr["Comment"]) ? string.Empty : Convert.ToString(dr["Comment"]).Trim();
            //保留位3
            model.Reserved3 = Convert.IsDBNull(dr["Reserved3"]) ? string.Empty : Convert.ToString(dr["Reserved3"]).Trim();
            //保留位2
            model.Reserved2 = Convert.IsDBNull(dr["Reserved2"]) ? string.Empty : Convert.ToString(dr["Reserved2"]).Trim();
            //保留位1
            model.Reserved1 = Convert.IsDBNull(dr["Reserved1"]) ? string.Empty : Convert.ToString(dr["Reserved1"]).Trim();
            //用户名
            model.ShareTargetUserName = Convert.IsDBNull(dr["ShareTargetUserName"]) ? string.Empty : Convert.ToString(dr["ShareTargetUserName"]).Trim();
            //用户头像
            model.ShareTargetUserFace = Convert.IsDBNull(dr["ShareTargetUserFace"]) ? string.Empty : Convert.ToString(dr["ShareTargetUserFace"]).Trim();
            //用户名
            model.ShareUserName = Convert.IsDBNull(dr["ShareUserName"]) ? string.Empty : Convert.ToString(dr["ShareUserName"]).Trim();
            //用户头像
            model.ShareUserFace = Convert.IsDBNull(dr["ShareUserFace"]) ? string.Empty : Convert.ToString(dr["ShareUserFace"]).Trim();
        }
        #endregion
    }

    /// <summary>
    /// 用户好友信息 
    /// </summary>
    public partial class friends_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public friends_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public friends_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 增加数据
        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(friends model, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<friends> lists = new List<friends>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            MySqlParameter[] sqlparms = this.SetMySqlParameter(model);
            result = sqlPro.ExecuteNonQuery("Create_friends", CommandType.StoredProcedure, sqlparms, out message);
            return result;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<friends> lists, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkInsertSql(lists);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>0成功、非0失败</returns>
        public int Delete(string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            string sql = " delete from friends ";
            if (string.IsNullOrEmpty(SqlWhere))
            {
                message = "删除条件不能为空";
                return result;
            }
            sql += " where " + SqlWhere;
            result = sqlPro.UpdateData(sql, out message);
            return result;
        }

        #region 修改方法
        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(friends model, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            List<friends> lists = new List<friends>() { model };
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            List<MySqlParameter> sqlparms = new List<MySqlParameter>();
            sqlparms.AddRange(this.SetMySqlParameter(model));
            sqlparms.Add(sqlPro.CreateInputParam("SqlWhere", MySqlDbType.VarChar, SqlWhere, 4000));
            result = sqlPro.ExecuteNonQuery("Update_friends", CommandType.StoredProcedure, sqlparms.ToArray(), out message);
            return result;
        }

        /// <summary>
        /// 批量修改
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>修改条数</returns>
        public int Update(List<friends> lists, string SqlWhere, out string message)
        {
            int result = -1;
            message = string.Empty;
            CheckEmpty(ref lists);
            CheckMaxLength(ref lists, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            ArrayList sqls = this.MarkUpdateSql(lists, SqlWhere);
            result = sqlPro.UpdateTransData(sqls, out message);
            return result;
        }
        #endregion

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<friends> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<friends> result = new List<friends>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_friends", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                friends model = new friends();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<friends> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<friends> result = new List<friends>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_friends_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                friends model = new friends();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 是否好友
        /// </summary>
        /// <param name="userId">用户编号</param>
        /// <param name="friendUserId">好友编号</param>
        /// <param name="message">错误消息</param>
        /// <returns>是否好友</returns>
        public bool IsFriend(long userId,long friendUserId,out string message) 
        {
            #region 声明变量

            //返回值
            bool result= false;

            //sql语句
            string sql = $"select count(recordId) from friends where userId='{userId}' and friendUserId='{friendUserId}' ";
            #endregion

            DataTable dt=sqlPro.ExecuteDataSet(sql, CommandType.Text, null, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;

            if (Convert.ToInt32(dt.Rows[0][0])>0)
                result = true;

            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref friends model, DataRow dr)
        {
            //记录编号
            model.recordId = Convert.IsDBNull(dr["recordId"]) ? 0 : Convert.ToInt64(dr["recordId"]);
            //用户编号
            model.userId = Convert.IsDBNull(dr["userId"]) ? 0 : Convert.ToInt64(dr["userId"]);
            //好友用户编号
            model.friendUserId = Convert.IsDBNull(dr["friendUserId"]) ? 0 : Convert.ToInt64(dr["friendUserId"]);
            //歌曲编号
            model.songId = Convert.IsDBNull(dr["songId"]) ? 0 : Convert.ToInt64(dr["songId"]);
            //创建时间
            model.createddatetime = Convert.IsDBNull(dr["createddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["createddatetime"]);
            //备用字段01
            model.backup01 = Convert.IsDBNull(dr["backup01"]) ? string.Empty : Convert.ToString(dr["backup01"]).Trim();
            //备用字段02
            model.backup02 = Convert.IsDBNull(dr["backup02"]) ? string.Empty : Convert.ToString(dr["backup02"]).Trim();
            //备用字段03
            model.backup03 = Convert.IsDBNull(dr["backup03"]) ? string.Empty : Convert.ToString(dr["backup03"]).Trim();
        }

        ///<summary>
        ///检查是否空值
        ///</summary>
        private void CheckEmpty(ref List<friends> lists)
        {
            for (int i = 0; i < lists.Count; i++)
            {
                //记录编号
                lists[i].recordId = lists[i].recordId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].recordId);
                //用户编号
                lists[i].userId = lists[i].userId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].userId);
                //好友用户编号
                lists[i].friendUserId = lists[i].friendUserId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].friendUserId);
                //歌曲编号
                lists[i].songId = lists[i].songId == null ? Convert.ToInt64(0) : Convert.ToInt64(lists[i].songId);
                //创建时间
                lists[i].createddatetime = lists[i].createddatetime == null ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(lists[i].createddatetime.GetValueOrDefault());
                //备用字段01
                lists[i].backup01 = string.IsNullOrEmpty(lists[i].backup01) ? string.Empty : Convert.ToString(lists[i].backup01).Trim();
                //备用字段02
                lists[i].backup02 = string.IsNullOrEmpty(lists[i].backup02) ? string.Empty : Convert.ToString(lists[i].backup02).Trim();
                //备用字段03
                lists[i].backup03 = string.IsNullOrEmpty(lists[i].backup03) ? string.Empty : Convert.ToString(lists[i].backup03).Trim();
            }
        }

        ///<summary>
        ///检查是否超过长度
        ///</summary>
        ///<param name="lists">数据集</param>
        ///<param name="message">错误消息</param>
        private void CheckMaxLength(ref List<friends> lists, out string message)
        {
            #region 声明变量

            //错误消息
            message = string.Empty;

            //超过的长度
            int OutLength = 0;
            #endregion

            #region 循环验证长度
            for (int i = 0; i < lists.Count; i++)
            {
                if (!string.IsNullOrEmpty(lists[i].backup01))
                {
                    if (lists[i].backup01.Length > 1020)
                    {
                        OutLength = lists[i].backup01.Length - 1020;
                        message += "字段名[backup01]描述[备用字段01]超长、字段最长[1020]实际" + lists[i].backup01.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup02))
                {
                    if (lists[i].backup02.Length > 1020)
                    {
                        OutLength = lists[i].backup02.Length - 1020;
                        message += "字段名[backup02]描述[备用字段02]超长、字段最长[1020]实际" + lists[i].backup02.Length + "超过长度" + OutLength + ",";
                    }
                }
                if (!string.IsNullOrEmpty(lists[i].backup03))
                {
                    if (lists[i].backup03.Length > 1020)
                    {
                        OutLength = lists[i].backup03.Length - 1020;
                        message += "字段名[backup03]描述[备用字段03]超长、字段最长[1020]实际" + lists[i].backup03.Length + "超过长度" + OutLength + ",";
                    }
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(message)) message = message.Substring(0, message.Length - 1);
        }

        ///<summary>
        ///赋值数据行
        ///</summary>
        ///<param name="model">数据行model</param>
        public MySqlParameter[] SetMySqlParameter(friends model)
        {
            #region 赋值Sql参数
            MySqlParameter[] result = new MySqlParameter[]
            {
                    //记录编号
                     new MySqlParameter("recordId",MySqlDbType.Int64,0)
                     {
                        Value=model.recordId==null?0:Convert.ToInt64(model.recordId)
                     },
                    //用户编号
                     new MySqlParameter("userId",MySqlDbType.Int64,0)
                     {
                        Value=model.userId==null?0:Convert.ToInt64(model.userId)
                     },
                    //好友用户编号
                     new MySqlParameter("friendUserId",MySqlDbType.Int64,0)
                     {
                        Value=model.friendUserId==null?0:Convert.ToInt64(model.friendUserId)
                     },
                    //歌曲编号
                     new MySqlParameter("songId",MySqlDbType.Int64,0)
                     {
                        Value=model.songId==null?0:Convert.ToInt64(model.songId)
                     },
                    //创建时间
                     new MySqlParameter("createddatetime",MySqlDbType.Datetime,0)
                     {
                        Value=model.createddatetime==null?Convert.ToDateTime("1000-01-01 00:00:00"):Convert.ToDateTime(model.createddatetime)
                     },
                    //备用字段01
                     new MySqlParameter("backup01",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup01)?string.Empty:FilteSQLStr(Convert.ToString(model.backup01))
                     },
                    //备用字段02
                     new MySqlParameter("backup02",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup02)?string.Empty:FilteSQLStr(Convert.ToString(model.backup02))
                     },
                    //备用字段03
                     new MySqlParameter("backup03",MySqlDbType.VarChar,1020)
                     {
                        Value=string.IsNullOrEmpty(model.backup03)?string.Empty:FilteSQLStr(Convert.ToString(model.backup03))
                     },
            };
            #endregion

            return result;
        }

        ///<summary>
        ///生成插入Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<returns>插入Sql语句字符串数组</returns>
        private ArrayList MarkInsertSql(List<friends> lists)
        {
            ArrayList result = new ArrayList();
            foreach (friends model in lists)
            {
                #region 拼写Sql语句
                string Sql = "insert into friends(";
                Sql += "recordId,";
                Sql += "userId,";
                Sql += "friendUserId,";
                Sql += "songId,";
                Sql += "createddatetime,";
                Sql += "backup01,";
                Sql += "backup02,";
                Sql += "backup03";
                Sql += ") values(";
                Sql += "'" + FilteSQLStr(model.recordId) + "',";
                Sql += "'" + FilteSQLStr(model.userId) + "',";
                Sql += "'" + FilteSQLStr(model.friendUserId) + "',";
                Sql += "'" + FilteSQLStr(model.songId) + "',";
                Sql += "DATE_FORMAT('" + model.createddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "'" + FilteSQLStr(model.backup01) + "',";
                Sql += "'" + FilteSQLStr(model.backup02) + "',";
                Sql += "'" + FilteSQLStr(model.backup03) + "'";
                Sql += ")";
                #endregion
                result.Add(Sql);
            }
            return result;
        }

        ///<summary>
        ///生成更新Sql语句
        ///</summary>
        ///<param name="lists">数据List</param>
        ///<param name="SqlWhere">更新条件</param>
        ///<returns>更新Sql语句字符串数组</returns>
        private ArrayList MarkUpdateSql(List<friends> lists, string SqlWhere)
        {
            ArrayList result = new ArrayList();
            foreach (friends model in lists)
            {
                #region 拼写Sql语句
                string Sql = "update friends set ";
                Sql += "recordId='" + FilteSQLStr(model.recordId) + "',";
                Sql += "userId='" + FilteSQLStr(model.userId) + "',";
                Sql += "friendUserId='" + FilteSQLStr(model.friendUserId) + "',";
                Sql += "songId='" + FilteSQLStr(model.songId) + "',";
                Sql += "createddatetime=DATE_FORMAT('" + model.createddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s'),";
                Sql += "backup01='" + FilteSQLStr(model.backup01) + "',";
                Sql += "backup02='" + FilteSQLStr(model.backup02) + "',";
                Sql += "backup03='" + FilteSQLStr(model.backup03) + "'";
                if (!string.IsNullOrEmpty(SqlWhere))
                    Sql += " Where " + SqlWhere;
                #endregion
                result.Add(Sql);
            }
            return result;
        }
        #endregion

        #region 封装方法

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 过滤不安全的字符串
        /// </summary>
        /// <param name="Str">要过滤的值</param>
        /// <returns>返回结果</returns>
        private static string FilteSQLStr(object str)
        {
            if (str == null)
                return string.Empty;
            if (IsNumeric(str))
                return Convert.ToString(str);
            string Str = Convert.ToString(str);
            if (!string.IsNullOrEmpty(Str))
            {
                Str = Str.Replace("'", "");
                Str = Str.Replace("\"", "");
                Str = Str.Replace("&", "&amp");
                Str = Str.Replace("<", "&lt");
                Str = Str.Replace(">", "&gt");

                Str = Str.Replace("delete", "");
                Str = Str.Replace("update", "");
                Str = Str.Replace("insert", "");
            }
            return Str;
        }

        /// <summary>
        /// 判断object是否数字
        /// </summary>
        /// <param name="AObject">要判断的Object</param>
        /// <returns>是否数字</returns>       
        public static bool IsNumeric(object AObject)
        {
            return AObject is sbyte || AObject is byte ||
                AObject is short || AObject is ushort ||
                AObject is int || AObject is uint ||
                AObject is long || AObject is ulong ||
                AObject is double || AObject is char ||
                AObject is decimal || AObject is float ||
                AObject is double;
        }
        #endregion
    }

    /// <summary>
    /// 用户好友信息
    /// </summary>
    public partial class vw_friends_DAL
    {
        /// <summary>
        /// 数据库连接类
        /// </summary>
        private MySqlProvider sqlPro;

        #region 构造函数
        /// <summary>
        /// 默认构造函数WebService调用
        /// </summary>
        public vw_friends_DAL()
        {
            sqlPro = new MySqlProvider();
        }

        /// <summary>
        /// 重载构造函数同步工具调用
        /// </summary>
        /// <param name="DBName">配置文件连接字符串</param>
        public vw_friends_DAL(string DBName)
        {
            sqlPro = new MySqlProvider(DBName);
        }
        #endregion

        #region 增删改

        #region 查询方法
        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_friends> Query(string SqlWhere, out string message)
        {
            message = string.Empty;
            List<vw_friends> result = new List<vw_friends>();
            MySqlParameter[] sqlparms = new MySqlParameter[] {
                 sqlPro.CreateInputParam("@SqlWhere",MySqlDbType.VarChar,SqlWhere,4000)
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_friends", CommandType.StoredProcedure, sqlparms, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            foreach (DataRow dr in dt.Rows)
            {
                vw_friends model = new vw_friends();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }

        /// <summary>
        /// 分页查询方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="SortField">排序字段名</param>
        /// <param name="SortMethod">排序方法[ASC|DESC]</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageCount">总页数</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_friends> Query(string SqlWhere, string SortField, string SortMethod, int PageSize, int CurPage, out int PageCount, out string message)
        {
            message = string.Empty;
            PageCount = 0;
            List<vw_friends> result = new List<vw_friends>();
            MySqlParameter[] sqlparm = new MySqlParameter[] {
                new MySqlParameter("StartRow",MySqlDbType.Int32,4){Value=((CurPage - 1) * PageSize + 1)},
                new MySqlParameter("EndRow",MySqlDbType.Int32,4){Value=(CurPage * PageSize)},
                new MySqlParameter("TotalNumber",MySqlDbType.Int32,4){Direction=ParameterDirection.Output},
                new MySqlParameter("SortMethod",MySqlDbType.VarChar,8000){Value=SortMethod},
                new MySqlParameter("SortField",MySqlDbType.VarChar,8000){Value=SortField},
                new MySqlParameter("SqlWhere",MySqlDbType.VarChar,8000){Value=SqlWhere}
            };
            DataTable dt = sqlPro.ExecuteDataSet("Query_vw_friends_Page", CommandType.StoredProcedure, sqlparm, out message);
            if (dt == null)
                return result;
            if (dt.Rows.Count == 0)
                return result;
            PageCount = Convert.ToInt32(sqlparm[2].Value);
            foreach (DataRow dr in dt.Rows)
            {
                vw_friends model = new vw_friends();
                this.ReadDataRow(ref model, dr);
                result.Add(model);
            }
            return result;
        }
        #endregion

        #endregion

        #region 基础方法

        /// <summary>
        /// 读取数据行到model
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="dr">数据行</param>
        private void ReadDataRow(ref vw_friends model, DataRow dr)
        {
            //记录编号
            model.RecordId = Convert.IsDBNull(dr["RecordId"]) ? 0 : Convert.ToInt64(dr["RecordId"]);
            //用户编号
            model.UserId = Convert.IsDBNull(dr["UserId"]) ? 0 : Convert.ToInt64(dr["UserId"]);
            //好友用户编号
            model.FriendUserId = Convert.IsDBNull(dr["FriendUserId"]) ? 0 : Convert.ToInt64(dr["FriendUserId"]);
            //歌曲编号
            model.SongId = Convert.IsDBNull(dr["SongId"]) ? 0 : Convert.ToInt64(dr["SongId"]);
            //创建时间
            model.Createddatetime = Convert.IsDBNull(dr["Createddatetime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["Createddatetime"]);
            //备用字段01
            model.Backup01 = Convert.IsDBNull(dr["Backup01"]) ? string.Empty : Convert.ToString(dr["Backup01"]).Trim();
            //备用字段02
            model.Backup02 = Convert.IsDBNull(dr["Backup02"]) ? string.Empty : Convert.ToString(dr["Backup02"]).Trim();
            //备用字段03
            model.Backup03 = Convert.IsDBNull(dr["Backup03"]) ? string.Empty : Convert.ToString(dr["Backup03"]).Trim();
            //歌曲名称
            model.Title = Convert.IsDBNull(dr["Title"]) ? string.Empty : Convert.ToString(dr["Title"]).Trim();
            //专辑封面
            model.Cover = Convert.IsDBNull(dr["Cover"]) ? string.Empty : Convert.ToString(dr["Cover"]).Trim();
            //歌手名
            model.Artist = Convert.IsDBNull(dr["Artist"]) ? string.Empty : Convert.ToString(dr["Artist"]).Trim();
            //年份
            model.Year = Convert.IsDBNull(dr["Year"]) ? string.Empty : Convert.ToString(dr["Year"]).Trim();
            //注释
            model.Comment = Convert.IsDBNull(dr["Comment"]) ? string.Empty : Convert.ToString(dr["Comment"]).Trim();
            //用户名
            model.Username = Convert.IsDBNull(dr["Username"]) ? string.Empty : Convert.ToString(dr["Username"]).Trim();
            //用户头像
            model.Userface = Convert.IsDBNull(dr["Userface"]) ? string.Empty : Convert.ToString(dr["Userface"]).Trim();
            //用户名
            model.FriendUserName = Convert.IsDBNull(dr["FriendUserName"]) ? string.Empty : Convert.ToString(dr["FriendUserName"]).Trim();
            //用户头像
            model.FriendUserFace = Convert.IsDBNull(dr["FriendUserFace"]) ? string.Empty : Convert.ToString(dr["FriendUserFace"]).Trim();
            //签名
            model.FriendSignature = Convert.IsDBNull(dr["FriendSignature"]) ? string.Empty : Convert.ToString(dr["FriendSignature"]).Trim();
            //创建时间
            model.FriendRegistrationTime = Convert.IsDBNull(dr["FriendRegistrationTime"]) ? (DateTime)SqlDateTime.MinValue : Convert.ToDateTime(dr["FriendRegistrationTime"]);
        }
        #endregion
    }
}
