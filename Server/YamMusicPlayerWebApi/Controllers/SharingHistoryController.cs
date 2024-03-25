using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1;
using Shell32;
using Snowflake.Net;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 分享历史
    /// </summary>
    [ApiController]
    [Route("api/Share/History")]
    public class SharingHistoryController : Controller
    {
        /// <summary>
        /// 分页查询
        /// </summary>
        /// <param name="UserId">用户编号</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="SortField">排序字段</param>
        /// <param name="SortMethod">排序方法[DESC|ASC]</param>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("Page")]
        public PageResult<vwSharingHistory> QueryPage(
            string? UserId = "",
            string? SortField = "CreatedDataTime",
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
            var PageData = new List<vw_sharinghistory>();

            //总记录数
            int TotalRecordNumber = 0;

            //总页数
            int PageCount;

            //分页参数
            var argument = new PageingArgument();

            //返回数据
            var resultData = new List<vwSharingHistory>();

            //返回值
            var result = new PageResult<vwSharingHistory>();
            #endregion

            #region 拼接查询条件
            if (!string.IsNullOrEmpty(UserId))
            {
                SearchWhere = $" ShareUser='{UserId}' ";
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
                result = new PageResult<vwSharingHistory>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkEmptyMessage}]"
                };
                return result;
            }
            #endregion

            #region 读取分页数据
            PageData = new vw_sharinghistory_BLL().Query(
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
                    result = new PageResult<vwSharingHistory>()
                    {
                        Status = -1,
                        Msg = $"读取数据出错,原因[{message}]"
                    };
                    return result;
                }
                else
                {
                    result = new PageResult<vwSharingHistory>()
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

            #region 返回值转换
            PageData.ForEach(item =>
            {
                resultData.Add(ConvertApi(item, Request));
            });
            #endregion

            #region 赋值返回值
            result = new PageResult<vwSharingHistory>()
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
        /// 添加分享历史
        /// </summary>
        /// <param name="args">分享历史参数</param>
        /// <returns>返回值</returns>
        [HttpPost]
        [Route("Add")]
        public Result AddSharingHistory(AddSharingHistoryArgument args)
        {
            #region 声明变量

            //数据库返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //雪花ID
            var snowId = new IdWorker(1, 1);

            //歌曲信息
            var song = new List<songinfo>();

            //分享目标用户
            var shareTargetUser = new List<userinfo>();

            //分享用户
            var shareUser = new List<userinfo>();

            //添加数据
            var insertData = new List<sharinghistory>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (args == null)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "参数不能为空"
                };
                return result;
            }
            if (string.IsNullOrEmpty(args.songId))
                checkMessage += "歌曲编号、";
            if (string.IsNullOrEmpty(args.shareUser))
                checkMessage += "分享用户编号、";
            if (string.IsNullOrEmpty(args.shareTarget))
                checkMessage += "分享目标用户编号、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                checkMessage = checkMessage.Substring(0, checkMessage.Length - 1);
                result = new Result()
                {
                    Status = 1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 验证歌曲信息
            song = new songinfo_BLL().Query($" songId='{args.songId}' ", out message);
            if (song == null || song.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取歌曲出错,原因[{message}]";
                else
                    message = $"读取歌曲出错,原因[没有读取到歌曲信息]";
                result = new Result()
                {
                    Status = 1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 验证分享目标用户
            shareTargetUser = new userinfo_BLL().Query($" userid='{args.shareTarget}' ", out message);
            if (shareTargetUser == null || shareTargetUser.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取分享目标用户出错,原因[{message}]";
                else
                    message = $"读取分享目标用户出错,原因[没有读取到分享目标用户信息]";
                result = new Result()
                {
                    Status = 1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 验证分享用户
            shareUser = new userinfo_BLL().Query($" userid='{args.shareUser}' ", out message);
            if (shareUser == null || shareUser.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取分享用户出错,原因[{message}]";
                else
                    message = $"读取分享用户出错,原因[没有读取到分享用户信息]";
                result = new Result()
                {
                    Status = 1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 赋值要添加的数据
            insertData.Add(new sharinghistory()
            {
                recordId = snowId.NextId(),
                songId = song[0].songId.GetValueOrDefault(),
                shareUser = shareUser[0].userid.GetValueOrDefault(),
                shareTarget = shareTargetUser[0].userid.GetValueOrDefault(),
                CreatedDataTime = DateTime.Now
            });
            #endregion

            #region 保存数据
            resultDbState = new sharinghistory_BLL().Insert(insertData, out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = 1,
                    Msg = $"保存分享历史数据出错,原因[{message}]"
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
        /// 参数转换
        /// </summary>
        /// <param name="args">参数</param>
        /// <param name="Request">Http请求</param>
        /// <returns>转换后的参数</returns>
        private vwSharingHistory ConvertApi(vw_sharinghistory args, HttpRequest Request)
        {
            string message = string.Empty;
            string cover = string.Empty;
            string host = PublicFunction.GetRequestHost(Request);
            bool isFriend = false;
            if (!string.IsNullOrEmpty(args.Cover))
            {
                cover = PublicFunction.ConvertCover(args.Cover);
                cover = $"{host}/{cover}";
            }
            isFriend = new friends_BLL().IsFriend(args.ShareUser, args.ShareTarget, out message);
            var result = new vwSharingHistory()
            {
                RecordId = args.RecordId.ToString(),
                Artist = args.Artist,
                Cover = cover,
                Backup01 = args.Backup01,
                Backup02 = args.Backup02,
                Backup03 = args.Backup03,
                Comment = args.Comment,
                Duration = args.Duration.ToString(),
                CreatedDataTime = args.CreatedDataTime.ToString("yyyy-MM-dd HH:mm:ss"),
                FileName = args.FileName,
                ShareTarget = args.ShareTarget.ToString(),
                ShareTargetUserFace = args.ShareTargetUserFace,
                ShareTargetUserName = args.ShareTargetUserName,
                ShareUser = args.ShareUser.ToString(),
                ShareUserFace = args.ShareUserFace,
                ShareUserName = args.ShareUserName,
                SongId = args.SongId.ToString(),
                FileSize = args.FileSize.ToString(),
                FileType = args.FileType,
                Title = args.Title,
                Year = args.Year,
                IsFriend = isFriend ? "true" : "false"
            };
            return result;
        }
    }
}
