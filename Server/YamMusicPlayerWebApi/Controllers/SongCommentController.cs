using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using Snowflake.Net;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 歌曲评论
    /// </summary>
    [ApiController]
    [Route("api/SongComment")]
    public class SongCommentController : Controller
    {
        /// <summary>
        /// 分页查询歌曲
        /// </summary>
        /// <param name="SongId">歌曲编号</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="SortField">排序字段</param>
        /// <param name="SortMethod">排序方法[DESC|ASC]</param>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("Page")]
        public PageResult<vwSongCommentResult> QueryPage(
            string? SongId = "",
            string? SortField = "createddatetime",
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
            List<vw_songcomment> PageData = new List<vw_songcomment>();

            //总记录数
            int TotalRecordNumber = 0;

            //总页数
            int PageCount;

            //分页参数
            var argument = new PageingArgument();

            //返回数据
            var resultData=new List<vwSongCommentResult>();

            //返回值
            var result = new PageResult<vwSongCommentResult>();
            #endregion

            #region 拼接查询条件
            if (!string.IsNullOrEmpty(SongId))
            {
                SearchWhere = $" songId='{SongId}' ";
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
                result = new PageResult<vwSongCommentResult>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkEmptyMessage}]"
                };
                return result;
            }
            #endregion

            #region 读取分页数据
            PageData = new vw_songcomment_BLL().Query(
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
                    result = new PageResult<vwSongCommentResult>()
                    {
                        Status = -1,
                        Msg = $"读取数据出错,原因[{message}]"
                    };
                    return result;
                }
                else
                {
                    result = new PageResult<vwSongCommentResult>()
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
            PageData.ForEach(item => {
                resultData.Add(ConvertApi(item,Request));
            });
            #endregion

            #region 赋值返回值
            result = new PageResult<vwSongCommentResult>()
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
        /// 发布评论
        /// </summary>
        /// <param name="args">评论参数</param>
        /// <returns>返回值</returns>
        [HttpPost]
        [Route("Add")]
        public Result LeaveComment(LeaveCommentArgument args)
        {
            #region 声明变量

            //数据库发布状态
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //查询数据
            string SqlWhere = string.Empty;

            //雪花ID
            var sonwId = new IdWorker(1, 1);

            //用户信息
            var userInfos = new List<userinfo>();

            //歌曲信息
            var songInfo = new List<songinfo>();

            //添加数据
            var insertData = new List<songcomment>();

            //返回值
            var result = new Result();
            #endregion

            #region 参数验证
            if (args == null)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "参数为空"
                };
                return result;
            }
            if (string.IsNullOrEmpty(args.songId))
                checkMessage += "歌曲编号、";
            if (string.IsNullOrEmpty(args.userId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(args.content))
                checkMessage += "评论内容、";
            else if (args.content.Length > 355)
                checkMessage += "评论内容最多355个字、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]不能为空"
                };
                return result;
            }
            #endregion

            #region 验证用户信息
            userInfos = new userinfo_BLL().Query($" userid='{args.userId}' ", out message);
            if (userInfos == null || userInfos.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message += $"查找用户编号为[{args.userId}]的数据出错,原因[{message}]";
                else
                    message += $"查找用户编号为[{args.userId}]的数据出错,原因[没有查找到用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 验证歌曲信息
            songInfo = new songinfo_BLL().Query($" songId='{args.songId}' ", out message);
            if (songInfo == null || songInfo.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message += $"查找歌曲编号为[{args.userId}]的数据出错,原因[{message}]";
                else
                    message += $"查找歌曲编号为[{args.userId}]的数据出错,原因[没有查找到歌曲信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 赋值并保存数据
            insertData.Add(new songcomment()
            {
                commentId = sonwId.NextId(),
                songId = songInfo[0].songId,
                content = args.content,
                publisher = userInfos[0].userid,
                createddatetime = DateTime.Now
            });
            resultDbState = new songcomment_BLL().Insert(insertData, out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"保存歌曲评论出错,原因[{message}]"
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
        /// 转换Api返回参数
        /// </summary>
        /// <param name="args">数据库参数</param>
        /// <returns>转换后的值</returns>
        private vwSongCommentResult ConvertApi(vw_songcomment args,HttpRequest Request) 
        {
            var host = PublicFunction.GetRequestHost(Request);
            var result = new vwSongCommentResult()
            {
                CommentId = args.CommentId.ToString(),
                SongId = args.SongId.ToString(),
                Publisher = args.Publisher.ToString(),
                Username = args.Username,
                Userface = $"/{host}/{args.Userface}",
                Content=args.Content,
                Createddatetime=args.Createddatetime.ToString("yyyy-MM-dd HH:mm:ss"),
                State=args.State.ToString(),
                Backup01 = args.Backup01,
                Backup02 = args.Backup02,
                Backup03 = args.Backup03
            };
            return result;
        }
    }
}
