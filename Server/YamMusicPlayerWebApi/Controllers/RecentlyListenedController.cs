using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 常听信息
    /// </summary>
    [ApiController]
    [Route("api/Recently/Listened")]
    public class RecentlyListenedController : Controller
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
        public PageResult<vwRecentlyListened> QueryPage(
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
            var PageData = new List<vw_recentlylistened>();

            //总记录数
            int TotalRecordNumber = 0;

            //总页数
            int PageCount;

            //分页参数
            var argument = new PageingArgument();

            //返回数据
            var resultData = new List<vwRecentlyListened>();

            //返回值
            var result = new PageResult<vwRecentlyListened>();
            #endregion

            #region 拼接查询条件
            if (!string.IsNullOrEmpty(UserId))
            {
                SearchWhere = $" UserID='{UserId}' ";
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
                result = new PageResult<vwRecentlyListened>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkEmptyMessage}]"
                };
                return result;
            }
            #endregion

            #region 读取分页数据
            PageData = new vw_recentlylistened_BLL().Query(
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
                    result = new PageResult<vwRecentlyListened>()
                    {
                        Status = -1,
                        Msg = $"读取数据出错,原因[{message}]"
                    };
                    return result;
                }
                else
                {
                    result = new PageResult<vwRecentlyListened>()
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
            result = new PageResult<vwRecentlyListened>()
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
        /// 参数转换
        /// </summary>
        /// <param name="args">参数</param>
        /// <param name="Request">Http请求</param>
        /// <returns>转换后的参数</returns>
        private vwRecentlyListened ConvertApi(vw_recentlylistened args, HttpRequest Request) 
        {
            string cover = string.Empty;
            string AlbumCover = string.Empty;
            string host = PublicFunction.GetRequestHost(Request);
            if (!string.IsNullOrEmpty(args.Cover))
            {
                cover = PublicFunction.ConvertCover(args.Cover);
                cover = $"{host}/{cover}";
            }
            if (!string.IsNullOrEmpty(args.AlbumCover))
            {
                AlbumCover = PublicFunction.ConvertCover(args.AlbumCover);
                AlbumCover = $"{host}/{AlbumCover}";
            }
            var result=new vwRecentlyListened() 
            {
                Comment = args.Comment,
                Cover = cover,
                AlbumCover= AlbumCover,
                AlbumAuthor=args.AlbumAuthor,
                AlbumId=args.AlbumId.ToString(),
                AlbumIntro=args.AlbumIntro,
                AlbumName=args.AlbumName,
                Artist=args.Artist,
                CreatedDataTime=args.CreatedDataTime.ToString("yyyy-MM-dd HH:mm:ss"),
                Duration=args.Duration.ToString(),
                RecordID=args.RecordID.ToString(),
                FileName=args.FileName,
                Userface=args.Userface,
                FileSize=args.FileSize,
                FileType=args.FileType,
                ShareCount=args.ShareCount.ToString(),
                SongId=args.SongId.ToString(),
                Title=args.Title,
                UserID=args.UserID.ToString(),
                Username=args.Username,
                Year=args.Year,
                SongLength=args.SongLength.ToString(),
                ViewCount=args.ViewCount.ToString(),
            };
            return result;
        }
    }
}
