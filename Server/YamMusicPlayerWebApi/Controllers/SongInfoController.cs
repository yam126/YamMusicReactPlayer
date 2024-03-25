using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;
using System.IO;
using Snowflake.Net;
using PublicLibrary;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 歌曲信息控制器
    /// </summary>
    [ApiController]
    [Route("api/SongInfo")]
    public class SongInfoController : Controller
    {
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
        public PageResult<songinfoResult> QueryPage(
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
            List<songinfo> PageData = new List<songinfo>();

            //总记录数
            int TotalRecordNumber = 0;

            //总页数
            int PageCount;

            //分页参数
            var argument = new PageingArgument();

            //Api返回数据
            var resultData = new List<songinfoResult>();

            //返回值
            var result = new PageResult<songinfoResult>();
            #endregion

            #region 拼接查询条件
            if (!string.IsNullOrEmpty(SqlWhere))
            {
                if (SqlWhere.IndexOf("albumId") == -1 && SqlWhere.IndexOf("userid") == -1)
                {
                    SearchWhere = $" title like '%{SqlWhere}%' Or ";
                    SearchWhere += $" artist like '%{SqlWhere}%' Or ";
                    SearchWhere += $" comment like '%{SqlWhere}%' ";
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
                result = new PageResult<songinfoResult>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkEmptyMessage}]"
                };
                return result;
            }
            #endregion

            #region 读取分页数据
            PageData = new songinfo_BLL().Query(
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
                    result = new PageResult<songinfoResult>()
                    {
                        Status = -1,
                        Msg = $"读取数据出错,原因[{message}]"
                    };
                    return result;
                }
                else
                {
                    result = new PageResult<songinfoResult>()
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

            PageData.ForEach(item =>
            {
                resultData.Add(PublicFunction.ConvertApiResult(item,Request));
            });

            #region 赋值返回值
            result = new PageResult<songinfoResult>()
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
        /// 获得专辑指定数量的歌曲
        /// </summary>
        /// <param name="albumId">专辑编号</param>
        /// <param name="limit">限制条数</param>
        /// <returns>专辑的歌曲信息</returns>
        [HttpGet]
        [Route("Album/SongInfos")]
        public EntityResult<List<songinfoResult>> GetSongInfoByAlbumLimit(System.Int64? albumId, int limit = 10)
        {
            #region 声明变量

            //错误信息
            string message = string.Empty;

            //查询条件
            string SqlWhere = string.Empty;

            //数据库返回List
            var resultDb = new List<songinfo>();

            //Api返回数据
            var resultData = new List<songinfoResult>();

            //返回值
            var result = new EntityResult<List<songinfoResult>>();
            #endregion

            #region 参数非空验证
            if (albumId == null || albumId == 0)
            {
                result = new EntityResult<List<songinfoResult>>()
                {
                    Status = -1,
                    Msg = "专辑编号不能为空",
                };
                return result;
            }
            #endregion

            #region 读取数据
            SqlWhere = $" albumId={albumId} limit {limit} ";
            resultDb = new songinfo_BLL().Query(SqlWhere, out message);
            if (resultDb == null || resultDb.Count == 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    result = new EntityResult<List<songinfoResult>>()
                    {
                        Status = -1,
                        Msg = $"读取专辑编号为[{albumId}]的歌曲信息出错,原因[{message}]"
                    };
                    return result;
                }
            }
            #endregion

            resultDb.ForEach(item =>
            {
                resultData.Add(PublicFunction.ConvertApiResult(item,Request));
            });

            result = new EntityResult<List<songinfoResult>>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = resultData
            };
            return result;
        }

        /// <summary>
        /// 上传歌曲文件
        /// </summary>
        /// <param name="userid">用户编号</param>
        /// <param name="albumId">专辑编号</param>
        /// <param name="fileIndex">当前文件序号</param>
        /// <param name="fileCount">文件总数量</param>
        /// <returns>Api返回值</returns>
        [HttpPost]
        [Route("Upload/Song")]
        public async Task<Result> UploadSongFile(string userid="",string albumId="")
        {
            #region 声明变量

            //专辑编号
            long albumIdLong = 0;

            //数据库返回值
            int resultDBState = -1;

            //错误消息
            string message = string.Empty;

            //非空验证
            string checkMessage = string.Empty;

            //上传路径
            string UploadPath = string.Empty;

            //返回值
            var result = new Result();

            //上传的文件
            var formFile = Request.Form.Files;

            //上传文件集合
            var formFiles = new List<IFormFile>();

            //文件保存结果
            var resultSave = new ReturnDataMessage();

            //返回文件列表
            var resultFileList = new List<ResultFile>();

            //雪花ID
            var snowId = new IdWorker(1,1);

            //MP3数据列表
            var mp3List = new List<songinfo>();
            #endregion

            #region 非空验证
            if (formFile == null || formFile.Count <= 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "没有上传任何文件"
                };
                return result;
            }
            #endregion

            #region 保存文件
            UploadPath= AppSetting.GetAppSetting("SongFilePath");
            foreach (var file in formFile)
                formFiles.Add(file);
            resultSave = await PublicFunction.SaveUploadFile(formFiles, UploadPath, @"audio/mp3");
            if (resultSave.State != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"保存文件失败,原因[{resultSave.Message}]"
                };
                return result;
            }
            resultFileList = (List<ResultFile>)resultSave.Data;
            #endregion

            #region 循环分析mp3文件
            foreach (var resultFile in resultFileList) 
            {
                if (System.IO.File.Exists(resultFile.AbsolutePath)) 
                {
                    #region 分析mp3文件
                    FileInfo mp3File = new FileInfo(resultFile.AbsolutePath);
                    Mp3FileNewHelper mp3Helper = new Mp3FileNewHelper(resultFile.AbsolutePath);
                    songinfo mp3Info = mp3Helper.AnalyseMp3File();
                    if (string.IsNullOrEmpty(albumId))
                    {
                        #region 分析专辑信息
                        if (!string.IsNullOrEmpty(mp3Info.Album))
                        {
                            var albumList = new albuminfo_BLL().Query($" albumName like '%{mp3Info.Album}%' ", out message);
                            if (albumList == null && albumList.Count <= 0)
                            {
                                albumIdLong = snowId.NextId();
                                albumList.Add(new albuminfo()
                                {
                                    albumId = albumIdLong,
                                    albumName = mp3Info.Album,
                                    albumAuthor = mp3Info.artist,
                                    albumCover = mp3Info.cover,
                                    albumIntro = mp3Info.Album,
                                    createdatetime = DateTime.Now,
                                    modifieddatetime = DateTime.Now,
                                    userid = Utils.StrToLong(userid),
                                    shareCount = 0,
                                    modifierId = Utils.StrToLong(userid),
                                    viewCount = 0,
                                    songLength = 1,
                                });
                                resultDBState = new albuminfo_BLL().Insert(albumList, out message);
                            }
                            else
                            {
                                albumIdLong = albumList[0].albumId.GetValueOrDefault();
                            }

                        }
                        else
                        {
                            var albumList = new albuminfo_BLL().Query($" albumName='noname'", out message);
                            if (albumList == null && albumList.Count <= 0)
                            {
                                albumIdLong = snowId.NextId();
                                albumList.Add(new albuminfo()
                                {
                                    albumId = albumIdLong,
                                    albumName = "noname",
                                    albumAuthor = mp3Info.artist,
                                    albumCover = mp3Info.cover,
                                    albumIntro = "noname",
                                    createdatetime = DateTime.Now,
                                    modifieddatetime = DateTime.Now,
                                    userid = Utils.StrToLong(userid),
                                    shareCount = 0,
                                    modifierId = Utils.StrToLong(userid),
                                    viewCount = 0,
                                    songLength = 1,
                                });
                                resultDBState = new albuminfo_BLL().Insert(albumList, out message);
                            }
                            else
                            {
                                albumIdLong = albumList[0].albumId.GetValueOrDefault();
                            }

                        }
                        mp3Info.albumId = albumIdLong;
                        #endregion
                    }
                    else
                        mp3Info.albumId = Utils.StrToLong(albumId);
                    mp3Info.userid = Utils.StrToLong(userid);
                    mp3Info.modifierId = Utils.StrToLong(userid);
                    mp3Info.createdatetime = DateTime.Now;
                    mp3Info.modifieddatetime = DateTime.Now;
                    mp3List.Add(mp3Info);
                    #endregion
                }
            }
            #endregion

            #region 保存文件信息
            resultDBState=new songinfo_BLL().Insert(mp3List,out message);
            if (resultDBState != 0) 
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"保存文件数据到数据库失败,原因[{message}]"
                };
                return result;
            }
            #endregion

            #region 更新专辑歌曲数量
            resultDBState = new albuminfo_BLL().UpadteAlbumSongData(out message, Utils.StrToLong(albumId));
            if (resultDBState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"更新专辑歌曲数量出错,原因[{message}]"
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
        /// 更改歌曲的专辑信息
        /// </summary>
        /// <param name="albumId">专辑编号</param>
        /// <param name="songId">歌曲列表</param>
        /// <param name="userid">用户编号</param>
        /// <returns>返回值</returns>
        [HttpPut]
        [Route("Change/Album")]
        public Result ChangeSongAlbum(string? albumId,List<string> songId,string userid = "") 
        {
            #region 声明变量

            //数据库状态
            int state = -1;

            //错误消息
            string message = string.Empty;

            //非空验证
            string checkMessage = string.Empty;

            //歌曲编号字符串
            string songIdStr = string.Empty;

            //专辑信息
            List<albuminfo> albuminfos = new List<albuminfo>();

            //雪花ID
            IdWorker snowId = new IdWorker(1,1);

            //用户信息
            List<userinfo> userinfo = new List<userinfo>();

            //歌曲信息
            List<songinfo> songinfos = new List<songinfo>();

            //返回值
            var result = new Result();
            #endregion

            #region 参数非空验证
            if (string.IsNullOrEmpty(albumId))
                checkMessage += "专辑编号、";
            if (songId == null || songId.Count <= 0)
                checkMessage += "歌曲编号、";
            if (!string.IsNullOrEmpty(checkMessage)) 
            {
                checkMessage=checkMessage.Substring(0,checkMessage.Length - 1);
                result = new Result()
                {
                    Status = -1,
                    Msg = $"参数非空验证出错,原因[{checkMessage}]不能为空"
                };
                return result;
            }
            #endregion

            #region 有效验证
            if (!string.IsNullOrEmpty(userid)) 
            {
                userinfo = new userinfo_BLL().Query($" userid='{userid}' ", out message);
                if(userinfo==null|| userinfo.Count<=0) 
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"读取用户编号为[{userid}]的数据出错,原因[{message}]";
                    else
                        message = $"读取用户编号为[{userid}]的数据出错,原因[没有找到用户数据]";
                    result = new Result() 
                    {
                        Status = -1,
                        Msg=message
                    };
                    return result;
                }
            }
            albuminfos = new albuminfo_BLL().Query($" albumId='{albumId}' ", out message);
            if(albuminfos==null|| albuminfos.Count<=0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取专辑编号为[{albumId}]的数据出错,原因[{message}]";
                else
                    message = $"读取专辑编号为[{albumId}]的数据出错,原因[没有找到专辑数据]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 读取歌曲信息
            songIdStr = $"'{string.Join("','", songId)}'";
            songinfos = new songinfo_BLL().Query($" songId in ({songIdStr})", out message);
            if(songinfos==null|| songinfos.Count<=0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取歌曲数据出错,原因[{message}]";
                else
                    message = $"读取歌曲数据出错,原因[没有找到歌曲数据]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 循环修改歌曲专辑信息
            for(var i = 0; i < songinfos.Count; i++) 
            {
                songinfos[i].songId = snowId.NextId();
                songinfos[i].albumId = Utils.StrToLong(albumId);
                songinfos[i].userid = Utils.StrToLong(userid);
                songinfos[i].modifierId= Utils.StrToLong(userid);
                songinfos[i].Album = albuminfos[0].albumName;
                songinfos[i].createdatetime = DateTime.Now;
                songinfos[i].modifieddatetime = DateTime.Now;
            }
            #endregion

            #region 保存数据
            state = new songinfo_BLL().Insert(songinfos, out message);
            if (state != 0) 
            {
                result = new Result() 
                {
                    Status = -1,
                    Msg=$"保存数据出错,原因[{message}]"
                };
                return result;
            }
            state = new albuminfo_BLL().UpadteAlbumSongData(out message, Utils.StrToLong(albumId));
            if (state != 0) 
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"更新专辑歌曲数量出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result() 
            {
                Status=0,
                Msg=string.Empty
            };
            return result;
        }

        /// <summary>
        /// 删除歌曲
        /// </summary>
        /// <param name="songId">歌曲编号</param>
        /// <returns>返回值</returns>
        [HttpDelete]
        [Route("Delete")]
        public Result DeleteSong(string songId) 
        {
            #region 声明变量

            //数据库状态
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //是否存在
            var isHave = new List<songinfo>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(songId)) 
            {
                result = new Result() 
                {
                    Status = -1,
                    Msg="歌曲编号参数不能为空"
                };
                return result;
            }
            #endregion

            #region 数据验证
            isHave = new songinfo_BLL().Query($" songId='{songId}' ", out message);
            if (isHave == null || isHave.Count <= 0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取歌曲数据出错,原因[{message}]";
                else
                    message = $"读取歌曲数据出错,原因[没有找到歌曲编号为[{songId}]的数据]";
                result = new Result() 
                {
                    Status = -1,
                    Msg=message
                };
                return result;
            }
            #endregion

            #region 删除数据
            resultDbState = new songinfo_BLL().Delete($" songId='{songId}' ", out message);
            if (resultDbState != 0) 
            {
                result = new Result() 
                {
                    Status = -1,
                    Msg=$"删除编号为[{songId}]的歌曲出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            #region 更新专辑歌曲数量
            resultDbState = new albuminfo_BLL().UpadteAlbumSongData(out message, isHave[0].albumId.GetValueOrDefault());
            if (resultDbState != 0) 
            {
                result = new Result() 
                {
                    Status = -1,
                    Msg=$"更新专辑歌曲数量出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result() 
            {
                Status = 0, 
                Msg=string.Empty
            };
            return result;
        }
    }
}
