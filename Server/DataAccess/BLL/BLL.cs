using DataAccess.DAL;
using DataAccess.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.BLL
{
    /// <summary>
    ///  
    /// </summary>
    public partial class albuminfo_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        albuminfo_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public albuminfo_BLL()
        {
            dal = new albuminfo_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public albuminfo_BLL(string DBName)
        {
            dal = new albuminfo_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(albuminfo model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<albuminfo> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(albuminfo model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 更新专辑歌曲数量信息
        /// </summary>
        /// <param name="message">错误消息</param>
        /// <param name="albumId">歌曲编号[默认0更新所有专辑的歌曲数量]</param>
        /// <returns>0成功、非0失败</returns>
        public int UpadteAlbumSongData(out string message, long albumId = 0) 
        {
            return dal.UpadteAlbumSongData(out message, albumId);
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>0成功、非0失败</returns>
        public int Delete(string SqlWhere, out string message) 
        {
            return dal.Delete(SqlWhere, out message);
        }

        /// <summary>
        /// 查询前几条专辑编号
        /// </summary>
        /// <param name="limit">条数</param>
        /// <param name="message">错误消息</param>
        /// <returns>专辑编号</returns>
        public List<string> QueryIDLimit(int limit, out string message) 
        {
            return dal.QueryIDLimit(limit, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<albuminfo> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    ///  
    /// </summary>
    public partial class appdevicerecord_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        appdevicerecord_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public appdevicerecord_BLL()
        {
            dal = new appdevicerecord_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public appdevicerecord_BLL(string DBName)
        {
            dal = new appdevicerecord_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(appdevicerecord model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<appdevicerecord> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(appdevicerecord model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<appdevicerecord> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }

        /// <summary>
        /// 同步数据
        /// </summary>
        /// <param name="data">要同步数据</param>
        /// <returns>是否同步成功</returns>
        public bool SynchronizationData(appdevicerecord data,out string message) 
        {
            bool result = false;
            int resultState = -1;
            List<appdevicerecord> dbList = new List<appdevicerecord>();
            message = string.Empty;
            string SqlWhere = string.Empty;
            SqlWhere = $" userid='{data.userid}' and deviceid='{data.deviceid}' ";
            dbList = Query(SqlWhere, out message);
            if (!string.IsNullOrEmpty(message))
                return result;
            if(dbList==null || dbList.Count<=0)
            {
                dbList.Add(new appdevicerecord() {
                    userid=data.userid,
                    deviceid=data.deviceid,
                    DeviceType=3,
                    token=data.token,
                    createdatetime=DateTime.Now,
                    modifieddatetime=DateTime.Now,
                });
                resultState=Insert(dbList, out message);
            }
            else 
            {
                dbList[0].token = data.token;
                dbList[0].modifieddatetime = DateTime.Now;
                resultState = Update(dbList[0], SqlWhere, out message);
            }
            result = resultState == 0 ? true : false;
            return result;
        }
    }

    /// <summary>
    ///  歌曲信息
    /// </summary>
    public partial class songinfo_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        songinfo_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public songinfo_BLL()
        {
            dal = new songinfo_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public songinfo_BLL(string DBName)
        {
            dal = new songinfo_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(songinfo model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<songinfo> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>0成功、非0失败</returns>
        public int Delete(string SqlWhere, out string message) 
        {
            return dal.Delete(SqlWhere, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(songinfo model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询前几条歌曲编号
        /// </summary>
        /// <param name="limit">条数</param>
        /// <param name="message">错误消息</param>
        /// <returns>歌曲编号</returns>
        public List<string> QuerySongIDLimit(int limit, out string message)
        {
            return dal.QuerySongIDLimit(limit, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<songinfo> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    ///  用户信息
    /// </summary>
    public partial class userinfo_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        userinfo_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public userinfo_BLL()
        {
            dal = new userinfo_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public userinfo_BLL(string DBName)
        {
            dal = new userinfo_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(userinfo model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<userinfo> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(userinfo model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<userinfo> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    /// 用户设备视图
    /// </summary>
    public partial class vw_userdeviceinfo_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        vw_userdeviceinfo_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public vw_userdeviceinfo_BLL()
        {
            dal = new vw_userdeviceinfo_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public vw_userdeviceinfo_BLL(string DBName)
        {
            dal = new vw_userdeviceinfo_DAL(DBName);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_userdeviceinfo> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }

        /// <summary>
        /// 验证是否登陆
        /// </summary>
        /// <param name="parameter">参数</param>
        /// <param name="message">错误消息</param>
        /// <returns>是否登陆</returns>
        public bool CheckLogin(ref vw_userdeviceinfo parameter, out string message)
        {
            bool result = true;
            message = string.Empty;
            List<vw_userdeviceinfo> list = new List<vw_userdeviceinfo>();
            list = Query($" username='{parameter.Username}' and password='{parameter.Password}' ", out message);
            if (list == null || list.Count <= 0)
                result = false;
            if (!string.IsNullOrEmpty(message))
                result = false;
            if (result && list != null && list.Count > 0)
                parameter = list[0];
            return result;
        }
    }

    /// <summary>
    /// 最近收听记录
    /// </summary>
    public partial class recentlylistened_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        recentlylistened_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public recentlylistened_BLL()
        {
            dal = new recentlylistened_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public recentlylistened_BLL(string DBName)
        {
            dal = new recentlylistened_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(recentlylistened model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<recentlylistened> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(recentlylistened model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<recentlylistened> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
        }

        /// <summary>
        /// 查询并过滤重复专辑编号
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>返回专辑编号数据</returns>
        public List<string> QueryDistinctAlbumId(string SqlWhere, out string message) 
        {
            return dal.QueryDistinctAlbumId(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    ///  歌曲评论
    /// </summary>
    public partial class songcomment_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        songcomment_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public songcomment_BLL()
        {
            dal = new songcomment_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public songcomment_BLL(string DBName)
        {
            dal = new songcomment_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(songcomment model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<songcomment> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(songcomment model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<songcomment> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    ///  收听历史
    /// </summary>
    public partial class listeninghistory_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        listeninghistory_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public listeninghistory_BLL()
        {
            dal = new listeninghistory_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public listeninghistory_BLL(string DBName)
        {
            dal = new listeninghistory_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(listeninghistory model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<listeninghistory> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(listeninghistory model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<listeninghistory> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    /// 歌曲评论视图
    /// </summary>
    public partial class vw_songcomment_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        vw_songcomment_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public vw_songcomment_BLL()
        {
            dal = new vw_songcomment_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public vw_songcomment_BLL(string DBName)
        {
            dal = new vw_songcomment_DAL(DBName);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_songcomment> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    /// 歌曲收听记录
    /// </summary>
    public partial class vw_recentlylistened_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        vw_recentlylistened_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public vw_recentlylistened_BLL()
        {
            dal = new vw_recentlylistened_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public vw_recentlylistened_BLL(string DBName)
        {
            dal = new vw_recentlylistened_DAL(DBName);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_recentlylistened> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    /// 分享历史
    /// </summary>
    public partial class sharinghistory_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        sharinghistory_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public sharinghistory_BLL()
        {
            dal = new sharinghistory_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public sharinghistory_BLL(string DBName)
        {
            dal = new sharinghistory_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(sharinghistory model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<sharinghistory> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(sharinghistory model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<sharinghistory> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    /// 分享历史视图
    /// </summary>
    public partial class vw_sharinghistory_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        vw_sharinghistory_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public vw_sharinghistory_BLL()
        {
            dal = new vw_sharinghistory_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public vw_sharinghistory_BLL(string DBName)
        {
            dal = new vw_sharinghistory_DAL(DBName);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_sharinghistory> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }

    /// <summary>
    /// 用户好友信息
    /// </summary>
    public partial class friends_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        friends_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public friends_BLL()
        {
            dal = new friends_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public friends_BLL(string DBName)
        {
            dal = new friends_DAL(DBName);
        }

        /// <summary>
        /// 单条增加
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="message">消息</param>
        /// <returns>添加条数</returns>
        public int Insert(friends model, out string message)
        {
            return dal.Insert(model, out message);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="lists">批量数据</param>
        /// <param name="message">错误消息</param>
        /// <returns>添加条数</returns>
        public int Insert(List<friends> lists, out string message)
        {
            return dal.Insert(lists, out message);
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>0成功、非0失败</returns>
        public int Delete(string SqlWhere, out string message) 
        {
            return dal.Delete(SqlWhere, out message);
        }

        /// <summary>
        /// 单条修改
        /// </summary>
        /// <param name="model">model</param>
        /// <param name="SqlWhere">更新条件</param>
        /// <param name="message">消息</param>
        /// <returns>修改条数</returns>
        public int Update(friends model, string SqlWhere, out string message)
        {
            return dal.Update(model, SqlWhere, out message);
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
            return dal.Update(lists, SqlWhere, out message);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<friends> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }

        /// <summary>
        /// 是否好友
        /// </summary>
        /// <param name="userId">用户编号</param>
        /// <param name="friendUserId">好友编号</param>
        /// <param name="message">错误消息</param>
        /// <returns>是否好友</returns>
        public bool IsFriend(long userId, long friendUserId, out string message) 
        {
            return dal.IsFriend(userId, friendUserId, out message);
        }
    }

    /// <summary>
    /// 用户好友信息
    /// </summary>
    public partial class vw_friends_BLL
    {
        /// <summary>
        /// DAL
        /// </summary>
        vw_friends_DAL dal = null;

        /// <summary>
        /// 默认构造函数
        /// </summary>        
        public vw_friends_BLL()
        {
            dal = new vw_friends_DAL();
        }

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="DBName">数据库名</param>       
        public vw_friends_BLL(string DBName)
        {
            dal = new vw_friends_DAL(DBName);
        }

        /// <summary>
        /// 查询单表方法
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="message">错误消息</param>
        /// <returns>查询结果</returns>
        public List<vw_friends> Query(string SqlWhere, out string message)
        {
            return dal.Query(SqlWhere, out message);
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
            return dal.Query(SqlWhere, SortField, SortMethod, PageSize, CurPage, out PageCount, out message);
        }
    }
}
