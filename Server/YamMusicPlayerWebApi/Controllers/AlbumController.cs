using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1;
using PublicLibrary;
using Snowflake.Net;
using System.Linq.Expressions;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 专辑信息
    /// </summary>
    [ApiController]
    [Route("api/Album")]
    public class AlbumController : Controller
    {
        /// <summary>
        /// 查看常听专辑页
        /// </summary>
        /// <param name="UserId">用户编号</param>
        /// <param name="SortField">排序字段</param>
        /// <param name="SortMethod">排序方法</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="CurPage">当前页</param>
        /// <returns></returns>
        [HttpGet]
        [Route("Recently/Listened/Page")]
        public PageResult<albuminfoResult> QueryRecentlyListenedPage(
            string UserId = "", 
            string? SortField = "createdatetime",
            string? SortMethod = "desc",
            int? PageSize = 10,
            int? CurPage = 1) 
        {
            #region 声明变量

            //错误消息
            string message = string.Empty;

            //验证是否为空
            string checkEmptyMessage = string.Empty;

            //搜索条件
            string SearchWhere = string.Empty;

            //分页数据
            var PageData = new List<albuminfo>();

            //总记录数
            int TotalRecordNumber = 0;

            //总页数
            int PageCount;

            //分页参数
            var argument = new PageingArgument();

            //用户信息
            var users=new List<userinfo>();

            //返回数据
            var resultData = new List<albuminfoResult>();

            //返回值
            var result = new PageResult<albuminfoResult>();
            #endregion

            #region 验证用户
            if (string.IsNullOrEmpty(UserId)) 
            {
                result = new PageResult<albuminfoResult>() 
                {
                    Status=-1,
                    Msg="用户编号不能为空"
                };
                return result;
            }
            #endregion

            #region 读取用户信息
            users = new userinfo_BLL().Query($" userid='{UserId}' ", out message);
            if(users==null || users.Count<=0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message += $"读取用户编号[{UserId}]的数据出错,原因[{message}]";
                else
                    message += $"读取用户编号[{UserId}]的数据出错,原因[没有读取到用户数据]";
                result = new PageResult<albuminfoResult>()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            SearchWhere = $" albumId in (select DISTINCT AlbumId from vw_recentlylistened vrl where vrl.UserID='{UserId}') ";

            #region 参数赋值
            argument = new PageingArgument()
            {
                SortField = SortField,
                SortMethod = SortMethod,
                SqlWhere = SearchWhere,
                PageSize = PageSize.GetValueOrDefault(),
                CurPage = CurPage.GetValueOrDefault(),
            };
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(argument.SortField))
                checkEmptyMessage += "排序字段不能为空、";
            if (string.IsNullOrEmpty(argument.SortMethod))
                checkEmptyMessage += "排序方法不能为空、";
            if (argument.CurPage <= 0)
                checkEmptyMessage += "当前页不能为0、";
            if (argument.PageSize <= 0)
                checkEmptyMessage += "每页记录数不能为0、";
            if (!string.IsNullOrEmpty(checkEmptyMessage))
            {
                checkEmptyMessage += checkEmptyMessage.Substring(0, checkEmptyMessage.Length - 1);
                result = new PageResult<albuminfoResult>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkEmptyMessage}]"
                };
                return result;
            }
            #endregion

            #region 读取分页数据
            PageData = new albuminfo_BLL().Query(
                argument.SqlWhere ?? "",
                argument.SortField ?? "",
                argument.SortMethod ?? "",
                argument.PageSize,
                argument.CurPage,
                out TotalRecordNumber,
                out message
                );
            if (PageData == null || PageData.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    result = new PageResult<albuminfoResult>()
                    {
                        Status = -1,
                        Msg = $"读取数据出错,原因[{message}]"
                    };
                    return result;
                }
                else
                {
                    result = new PageResult<albuminfoResult>()
                    {
                        Status = 0,
                        Msg = string.Empty,
                    };
                    return result;
                }
            }
            #endregion

            #region 计算总页数和赋值总记录数
            if (TotalRecordNumber % argument.PageSize == 0)
                PageCount = Convert.ToInt32(TotalRecordNumber / argument.PageSize);
            else
                PageCount = Convert.ToInt32(TotalRecordNumber / argument.PageSize) + 1;
            #endregion

            #region 循环处理返回值数据
            for (var i = 0; i < PageData.Count; i++)
            {
                PageData[i].albumCover = $"{PublicFunction.GetRequestHost(Request)}/{PublicFunction.ConvertCover(PageData[i].albumCover)}";
                resultData.Add(new albuminfoResult()
                {
                    albumAuthor = PageData[i].albumAuthor,
                    albumCover = PageData[i].albumCover,
                    albumId = PageData[i].albumId.GetValueOrDefault().ToString(),
                    albumIntro = PageData[i].albumIntro,
                    albumName = PageData[i].albumName,
                    createdatetime = PageData[i].createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                    modifieddatetime = PageData[i].modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                    modifierId = PageData[i].modifierId.GetValueOrDefault().ToString(),
                    shareCount = PageData[i].shareCount.GetValueOrDefault().ToString(),
                    songLength = PageData[i].songLength.GetValueOrDefault().ToString(),
                    userid = PageData[i].userid.GetValueOrDefault().ToString(),
                    viewCount = PageData[i].viewCount.GetValueOrDefault().ToString()
                });
            }
            #endregion

            #region 赋值返回值
            result = new PageResult<albuminfoResult>()
            {
                Status = 0,
                Msg = string.Empty,
                RecordCount = TotalRecordNumber,
                PageCount = PageCount,
                Result = resultData
            };
            #endregion

            return result;
        }

        /// <summary>
        /// 分页查询歌曲
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="SortField">排序字段</param>
        /// <param name="SortMethod">排序方法[DESC|ASC]</param>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("Page")]
        public JsonResult QueryPage(
            string? SqlWhere = "",
            string? SortField = "createdatetime",
            string? SortMethod = "desc",
            int? PageSize = 10,
            int? CurPage = 1
            )
        {
            #region 声明变量

            //错误消息
            string message = string.Empty;

            //验证是否为空
            string checkEmptyMessage = string.Empty;

            //搜索条件
            string SearchWhere = string.Empty;

            //分页数据
            var PageData = new List<albuminfo>();

            //总记录数
            int TotalRecordNumber = 0;

            //总页数
            int PageCount;

            //分页参数
            var argument = new PageingArgument();

            //返回数据
            var resultData=new List<albuminfoResult>();

            //返回值
            var result = new PageResultNew<List<albuminfoResult>>();
            #endregion

            #region 拼接查询条件
            if (!string.IsNullOrEmpty(SqlWhere))
            {
                if (SqlWhere.IndexOf("userid") == -1)
                {
                    SearchWhere = $" albumName like '%{SqlWhere}%' Or ";
                    SearchWhere += $" albumAuthor like '%{SqlWhere}%' Or ";
                    SearchWhere += $" albumIntro like '%{SqlWhere}%' ";
                }
                else
                {
                    SqlWhere = SqlWhere.Replace("|", "=");
                    SqlWhere = SqlWhere.Replace("[", "'");
                    SqlWhere = SqlWhere.Replace("]", "'");
                    SearchWhere = " " + SqlWhere + " ";
                }
            }
            #endregion

            #region 参数赋值
            argument = new PageingArgument()
            {
                SortField = SortField,
                SortMethod = SortMethod,
                SqlWhere = SearchWhere,
                PageSize = PageSize.GetValueOrDefault(),
                CurPage = CurPage.GetValueOrDefault(),
            };
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(argument.SortField))
                checkEmptyMessage += "排序字段不能为空、";
            if (string.IsNullOrEmpty(argument.SortMethod))
                checkEmptyMessage += "排序方法不能为空、";
            if (argument.CurPage <= 0)
                checkEmptyMessage += "当前页不能为0、";
            if (argument.PageSize <= 0)
                checkEmptyMessage += "每页记录数不能为0、";
            if (!string.IsNullOrEmpty(checkEmptyMessage))
            {
                checkEmptyMessage += checkEmptyMessage.Substring(0, checkEmptyMessage.Length - 1);
                result = new PageResultNew<List<albuminfoResult>>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkEmptyMessage}]"
                };
                return new JsonResult(result);
            }
            #endregion

            #region 读取分页数据
            PageData = new albuminfo_BLL().Query(
                argument.SqlWhere ?? "",
                argument.SortField ?? "",
                argument.SortMethod ?? "",
                argument.PageSize,
                argument.CurPage,
                out TotalRecordNumber,
                out message
                );
            if (PageData == null || PageData.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    result = new PageResultNew<List<albuminfoResult>>()
                    {
                        Status = -1,
                        Msg = $"读取数据出错,原因[{message}]"
                    };
                    return new JsonResult(result);
                }
                else
                {
                    result = new PageResultNew<List<albuminfoResult>>()
                    {
                        Status = 0,
                        Msg = string.Empty,
                    };
                    return new JsonResult(result);
                }
            }
            #endregion

            #region 计算总页数和赋值总记录数
            if (TotalRecordNumber % argument.PageSize == 0)
                PageCount = Convert.ToInt32(TotalRecordNumber / argument.PageSize);
            else
                PageCount = Convert.ToInt32(TotalRecordNumber / argument.PageSize) + 1;
            #endregion

            #region 循环处理返回值数据
            for (var i = 0; i < PageData.Count; i++)
            {
                PageData[i].albumCover = $"{PublicFunction.GetRequestHost(Request)}/{PageData[i].albumCover}";
                resultData.Add(new albuminfoResult()
                {
                    albumAuthor = PageData[i].albumAuthor,
                    albumCover = PageData[i].albumCover,
                    albumId = PageData[i].albumId.GetValueOrDefault().ToString(),
                    albumIntro = PageData[i].albumIntro,
                    albumName = PageData[i].albumName,
                    createdatetime = PageData[i].createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                    modifieddatetime = PageData[i].modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                    modifierId = PageData[i].modifierId.GetValueOrDefault().ToString(),
                    shareCount = PageData[i].shareCount.GetValueOrDefault().ToString(),
                    songLength = PageData[i].songLength.GetValueOrDefault().ToString(),
                    userid = PageData[i].userid.GetValueOrDefault().ToString(),
                    viewCount = PageData[i].viewCount.GetValueOrDefault().ToString()
                });
            }
            #endregion

            #region 赋值返回值
            result = new PageResultNew<List<albuminfoResult>>()
            {
                Status = 0,
                Msg = string.Empty,
                RecordCount = TotalRecordNumber,
                PageCount = PageCount,
                Result = resultData
            };
            #endregion

            return new JsonResult(result);
        }


        /// <summary>
        /// 编辑专辑
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("EditAsync")]
        public async Task<EntityResult<albuminfo>> EditAlbumAsync() 
        {
            #region 声明变量

            //存储状态
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //操作指令
            string action = string.Empty;

            //专辑编号
            string albumId = string.Empty;

            //专辑名称
            string albumName = string.Empty;

            //专辑作者
            string albumAuthor = string.Empty;

            //专辑简介
            string albumIntro = string.Empty;

            //专辑封面
            string albumCover= string.Empty;

            //专辑封面Form
            string albumCoverForm= string.Empty;

            //用户编号
            string userId = string.Empty;

            //封面保存路径
            string coverPath = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //保存数据
            var saveAlbumsData = new albuminfo();

            //专辑信息
            var albums = new List<albuminfo>();

            //返回值
            var result = new EntityResult<albuminfo>();

            //上传的文件
            var formFile = Request.Form.Files;

            //上传文件集合
            var formFiles = new List<IFormFile>();

            //返回文件列表
            var resultFileList = new List<ResultFile>();

            //文件保存结果
            var resultSave = new ReturnDataMessage();

            //用户信息
            var userInfo = new List<userinfo>();

            //雪花ID
            var snowId = new IdWorker(1, 1);
            #endregion

            #region 获取数据
            action= Request.Form["action"];
            albumId = Request.Form["albumId"];
            albumName = Request.Form["albumName"];
            albumAuthor = Request.Form["albumAuthor"];
            albumIntro= Request.Form["albumIntro"];
            albumCoverForm = Request.Form["albumCover"];
            userId = Request.Form["userId"];
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(action))
                checkMessage += "操作指令、";
            if (action == "Edit" && string.IsNullOrEmpty(albumId))
                checkMessage += "专辑编号、";
            if (string.IsNullOrEmpty(albumName))
                checkMessage += "专辑名称、";
            if (string.IsNullOrEmpty(albumAuthor))
                checkMessage += "专辑作者、";
            if (string.IsNullOrEmpty(albumIntro))
                checkMessage += "专辑简介、";
            if (!string.IsNullOrEmpty(checkMessage)) 
            {
                result = new EntityResult<albuminfo>() 
                {
                    Status=-1,
                    Msg=$"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 有效验证
            if (action != "Edit" && action != "Add")
                checkMessage += "操作指令只能是Edit或Add、";
            if (action == "Edit") 
            {
                albums = new albuminfo_BLL().Query($" albumId='{albumId}' ", out message);
                if(albums==null||albums.Count<=0)
                {
                    if (!string.IsNullOrEmpty(message))
                        checkMessage += $"查找专辑编号为[{albumId}]的专辑信息出错,原因[{message}]、";
                    else
                        checkMessage += $"查找专辑编号为[{albumId}]的专辑信息出错,原因[专辑信息为空]、";
                }
            }
            if (!string.IsNullOrEmpty(userId)) 
            {
                userInfo=new userinfo_BLL().Query($" userid='{userId}' ",out message);
                if (userInfo == null || userInfo.Count <= 0) 
                {
                    if (!string.IsNullOrEmpty(message))
                        checkMessage += $"查询用户编号为[{userId}]的数据出错,原因[{message}]、";
                    else
                        checkMessage += $"查询用户编号为[{userId}]的数据出错,原因[没有找到用户]、";
                }
            }
            if (!string.IsNullOrEmpty(checkMessage))
            {
                result = new EntityResult<albuminfo>()
                {
                    Status = -1,
                    Msg = $"有效验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 保存文件
            if (formFile != null && formFile.Count > 0)
            {
                coverPath = AppSetting.GetAppSetting("Mp3CoverPath");
                foreach (var file in formFile)
                    formFiles.Add(file);
                resultSave = await PublicFunction.SaveUploadFile(formFiles, coverPath, @"image");
                if (resultSave.State != 0)
                {
                    result = new EntityResult<albuminfo>()
                    {
                        Status = -1,
                        Msg = $"保存文件失败,原因[{resultSave.Message}]"
                    };
                    return result;
                }
                resultFileList = (List<ResultFile>)resultSave.Data;
                albumCover = $"{coverPath}/{resultFileList[0].NewFileName}";
            }
            else if(!string.IsNullOrEmpty(albumCoverForm)) 
            {
                string host = PublicFunction.GetRequestHost(Request);
                albumCover = albumCoverForm.Replace(host, "");
            }
            else 
            {
                albumCover = "Images/NoCover.png";
            }
            #endregion

            #region 赋值数据
            if (albums.Count <= 0)
            {
                saveAlbumsData.albumId = snowId.NextId();
                saveAlbumsData.userid= Utils.StrToLong(userId);
                saveAlbumsData.createdatetime = DateTime.Now;
                saveAlbumsData.modifieddatetime = DateTime.Now;
                saveAlbumsData.modifierId = Utils.StrToLong(userId);
            }
            else 
            {
                saveAlbumsData.songLength = albums[0].songLength;
                saveAlbumsData.albumId = albums[0].albumId;
                saveAlbumsData.createdatetime = albums[0].createdatetime;
                saveAlbumsData.modifieddatetime = DateTime.Now;
                saveAlbumsData.modifierId = Utils.StrToLong(userId);
            }
            saveAlbumsData.albumName = albumName;
            saveAlbumsData.albumIntro = albumIntro;
            saveAlbumsData.albumAuthor = albumAuthor;
            saveAlbumsData.albumCover = albumCover;
            saveAlbumsData.userid = Utils.StrToLong(userId);
            #endregion

            #region 保存数据
            if (action == "Edit")
                resultDbState = new albuminfo_BLL().Update(new List<albuminfo>() { saveAlbumsData }, $" albumId='{albums[0].albumId}' ", out message);
            else
                resultDbState = new albuminfo_BLL().Insert(new List<albuminfo>() { saveAlbumsData }, out message);
            if (resultDbState != 0) 
            {
                result = new EntityResult<albuminfo>() 
                {
                    Status=-1,
                    Msg=$"保存数据出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            #region 更新专辑歌曲数量
            resultDbState = new albuminfo_BLL().UpadteAlbumSongData(out message, saveAlbumsData.albumId.GetValueOrDefault());
            if (resultDbState != 0) 
            {
                result = new EntityResult<albuminfo>() 
                {
                    Status=-1,
                    Msg=$"更新专辑歌曲数量出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            saveAlbumsData.albumCover = $"{PublicFunction.GetRequestHost(Request)}/{albumCover}";
            result = new EntityResult<albuminfo>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = saveAlbumsData
            };
            return result;
        }

        /// <summary>
        /// 添加专辑浏览次数
        /// </summary>
        /// <param name="albumId">专辑编号</param>
        /// <returns>返回值</returns>
        [HttpPost]
        [Route("Add/ViewCount")]
        public EntityResult<int> AddViewCount(string albumId) 
        {
            #region 声明变量

            //数据库操作返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //专辑信息
            var album=new List<albuminfo>();

            //返回值
            var result = new EntityResult<int>();
            #endregion

            if (string.IsNullOrEmpty(albumId)) 
            {
                result = new EntityResult<int>() 
                {
                    Status=-1,
                    Msg="专辑编号不能为空"
                };
                return result;
            }

            album = new albuminfo_BLL().Query($" albumId='{albumId}' ", out message);
            if (album == null || album.Count <= 0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取专辑数据出错,原因[{message}]";
                else
                    message = $"读取专辑数据出错,原因[没有读取到专辑信息]";
                result = new EntityResult<int>() 
                {
                    Status=-1,
                    Msg=message
                };
                return result;
            }

            album[0].viewCount += 1;
            resultDbState=new albuminfo_BLL().Update(album,$" albumId='{albumId}' ",out message);
            if(resultDbState!=0) 
            {
                result = new EntityResult<int>() 
                {
                    Status=-1,
                    Msg=$"更新专辑浏览次数出错,原因[{message}]"
                };
                return result;
            }

            result = new EntityResult<int>() 
            {
                Status=0,
                Msg=string.Empty,
                Result= album[0].viewCount.GetValueOrDefault(),
            };
            return result;
        }

        /// <summary>
        /// 清空专辑里的歌曲
        /// </summary>
        /// <param name="albumId">专辑编号</param>
        /// <returns>返回值</returns>
        [HttpDelete]
        [Route("Clear/Song")]
        public Result ClearAlbumSong(string albumId) 
        {
            #region 声明变量

            //数据状态返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //是否存在
            var isHave = new List<albuminfo>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(albumId)) 
            {
                result = new Result() 
                {
                    Status=-1,
                    Msg=$"专辑编号不能为空"
                };
                return result;
            }
            #endregion

            #region 验证专辑是否存在
            isHave = new albuminfo_BLL().Query($" albumId='{albumId}' ", out message);
            if (isHave == null || isHave.Count <= 0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取专辑编号为[{albumId}]的数据出错,原因[{message}]";
                else
                    message = $"读取专辑编号为[{albumId}]的数据出错,原因[没有读取到数据]";
                result = new Result() 
                {
                    Status=-1,
                    Msg=message
                };
                return result;
            }
            #endregion

            #region 清空专辑歌曲
            resultDbState = new songinfo_BLL().Delete($" albumId='{albumId}' ", out message);
            if (resultDbState != 0) 
            {
                result = new Result() 
                {
                    Status=-1,
                    Msg=$"清空专辑编号为[{albumId}]的专辑内歌曲出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = string.Empty
            };
            return result;
        }

        /// <summary>
        /// 删除专辑
        /// </summary>
        /// <param name="albumId">专辑编号</param>
        /// <returns>返回值</returns>
        [HttpDelete]
        [Route("Delete")]
        public Result DeleteAlbum(string albumId) 
        {
            #region 声明变量

            //数据状态返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //是否存在
            var isHave = new List<albuminfo>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(albumId))
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"专辑编号不能为空"
                };
                return result;
            }
            #endregion

            #region 验证专辑是否存在
            isHave = new albuminfo_BLL().Query($" albumId='{albumId}' ", out message);
            if (isHave == null || isHave.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取专辑编号为[{albumId}]的数据出错,原因[{message}]";
                else
                    message = $"读取专辑编号为[{albumId}]的数据出错,原因[没有读取到数据]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 清空专辑歌曲
            resultDbState = new songinfo_BLL().Delete($" albumId='{albumId}' ", out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"清空专辑编号为[{albumId}]的专辑内歌曲出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            #region 删除专辑
            resultDbState = new albuminfo_BLL().Delete($" albumId='{albumId}' ", out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"删除专辑编号为[{albumId}]的专辑出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = string.Empty
            };
            return result;
        }
    }
}
