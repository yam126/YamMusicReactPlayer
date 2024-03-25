using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Shell32;
using Snowflake.Net;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 用户好友信息
    /// </summary>
    [ApiController]
    [Route("api/Friends")]
    public class FriendsController : Controller
    {
        /// <summary>
        /// 分页查询
        /// </summary>
        /// <param name="SqlWhere">查询条件</param>
        /// <param name="CurPage">当前页</param>
        /// <param name="PageSize">每页记录数</param>
        /// <param name="SortField">排序字段</param>
        /// <param name="SortMethod">排序方法[DESC|ASC]</param>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("Page")]
        public PageResult<vwFriends> QueryPage(
            string? SqlWhere = "",
            string? UserId = "",
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
            var PageData = new List<vw_friends>();

            //总记录数
            int TotalRecordNumber = 0;

            //总页数
            int PageCount;

            //分页参数
            var argument = new PageingArgument();

            //Api返回数据
            var resultData = new List<vwFriends>();

            //返回值
            var result = new PageResult<vwFriends>();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(UserId))
                checkEmptyMessage += "用户编号不能为空、";
            if (string.IsNullOrEmpty(SortField))
                checkEmptyMessage += "排序字段不能为空、";
            if (string.IsNullOrEmpty(SortMethod))
                checkEmptyMessage += "排序方法不能为空、";
            if (CurPage <= 0)
                checkEmptyMessage += "当前页不能为0、";
            if (PageSize <= 0)
                checkEmptyMessage += "每页记录数不能为0、";
            if (!string.IsNullOrEmpty(checkEmptyMessage))
            {
                checkEmptyMessage += checkEmptyMessage.Substring(0, checkEmptyMessage.Length - 1);
                result = new PageResult<vwFriends>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkEmptyMessage}]"
                };
                return result;
            }
            #endregion

            #region 拼接查询条件
            if (!string.IsNullOrEmpty(SqlWhere))
            {
                SearchWhere = $" Title like '%{SqlWhere}%' Or ";
                SearchWhere += $" Artist like '%{SqlWhere}%' Or ";
                SearchWhere += $" Comment like '%{SqlWhere}%' Or ";
                SearchWhere += $" Username like '%{SqlWhere}%' Or ";
                SearchWhere += $" FriendUserName like '%{SqlWhere}%' ";
                if (!string.IsNullOrEmpty(UserId))
                    SearchWhere = $" UserId='{UserId}' and ({SearchWhere}) ";
            }
            else if (!string.IsNullOrEmpty(UserId))
            {
                SearchWhere = $" UserId='{UserId}' ";
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

            #region 读取分页数据
            PageData = new vw_friends_BLL().Query(
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
                    result = new PageResult<vwFriends>()
                    {
                        Status = -1,
                        Msg = $"读取数据出错,原因[{message}]"
                    };
                    return result;
                }
                else
                {
                    result = new PageResult<vwFriends>()
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
                resultData.Add(ConvertApiResult(item, Request));
            });

            #region 赋值返回值
            result = new PageResult<vwFriends>()
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
        /// 删除好友
        /// </summary>
        /// <param name="UserId">用户编号</param>
        /// <param name="FriendId">好友编号</param>
        /// <returns>返回值</returns>
        [HttpDelete]
        [Route("Delete")]
        public Result DeleteFriend(string UserId, string FriendId)
        {
            #region 声明变量

            //数据库返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //用户信息
            var users = new List<userinfo>();

            //好友用户信息
            var friend = new List<userinfo>();

            //好友信息
            var friendInfo = new List<friends>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(UserId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(FriendId))
                checkMessage += "好友编号、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 验证用户信息
            users = new userinfo_BLL().Query($" userid='{UserId}' ", out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户信息出错,原因[{message}]";
                else
                    message = "读取用户信息出错,原因[没有读取到用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 验证好友用户信息
            friend = new userinfo_BLL().Query($" userid='{FriendId}' ", out message);
            if (friend == null || friend.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取好友用户信息出错,原因[{message}]";
                else
                    message = "读取好友用户信息出错,原因[没有读取到好友用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 验证好友信息
            friendInfo = new friends_BLL().Query($" userId='{UserId}' and friendUserId='{FriendId}' ", out message);
            if (friendInfo == null || friendInfo.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取好友信息出错,原因[{message}]";
                else
                    message = "读取好友信息出错,原因[好友信息已经删除]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 删除数据
            resultDbState = new friends_BLL().Delete($" userId='{UserId}' and friendUserId='{FriendId}' ", out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"删除数据出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = string.Empty,
            };
            return result;
        }

        /// <summary>
        /// 添加好友
        /// </summary>
        /// <param name="args">参数</param>
        /// <returns>返回值</returns>
        [HttpPost]
        [Route("Add/Friend")]
        public Result AddFriend(AddFriendArgument args)
        {
            #region 声明变量

            //数据库返回状态
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //雪花ID
            var snowId = new IdWorker(1, 1);

            //用户信息
            var users = new List<userinfo>();

            //好友用户信息
            var friend = new List<userinfo>();

            //好友信息
            var friendInfo = new List<friends>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (args == null)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = string.Empty
                };
                return result;
            }
            if (string.IsNullOrEmpty(args.UserId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(args.FriendId))
                checkMessage += "好友编号、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                checkMessage = checkMessage.Substring(0, checkMessage.Length - 1);
                result = new Result()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 验证用户信息
            users = new userinfo_BLL().Query($" userid='{args.UserId}' ", out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户信息出错,原因[{message}]";
                else
                    message = "读取用户信息出错,原因[没有读取到用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 验证好友用户信息
            friend = new userinfo_BLL().Query($" userid='{args.FriendId}' ", out message);
            if (friend == null || friend.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取好友用户信息出错,原因[{message}]";
                else
                    message = "读取好友用户信息出错,原因[没有读取到好友用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 验证好友信息
            friendInfo = new friends_BLL().Query($" userId='{args.UserId}' and friendUserId='{args.FriendId}' ", out message);
            if (friendInfo == null || friendInfo.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    message = $"读取好友信息出错,原因[{message}]";
                    result = new Result()
                    {
                        Status = -1,
                        Msg = message
                    };
                    return result;
                }
            }
            else 
            {
                result = new Result() 
                {
                    Status= -1,
                    Msg = "已经是好友"
                };
                return result;
            }
            #endregion

            #region 赋值数据
            friendInfo.Add(new friends()
            {
                recordId = snowId.NextId(),
                userId = users[0].userid.GetValueOrDefault(),
                friendUserId = friend[0].userid.GetValueOrDefault(),
                createddatetime = DateTime.Now,
            });
            #endregion

            #region 添加数据
            resultDbState = new friends_BLL().Insert(friendInfo, out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"添加好友数据出错,原因[{message}]"
                };
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
        /// Api返回值转换
        /// </summary>
        /// <param name="args">参数值</param>
        /// <param name="Request">Http请求对象</param>
        /// <returns>返回值</returns>
        private vwFriends ConvertApiResult(vw_friends args, HttpRequest Request)
        {
            string cover = string.Empty;
            string host = PublicFunction.GetRequestHost(Request);
            if (!string.IsNullOrEmpty(args.Cover))
            {
                cover = PublicFunction.ConvertCover(args.Cover);
                cover = $"{host}/{cover}";
            }
            var result = new vwFriends()
            {
                RecordId = args.RecordId.ToString(),
                UserId = args.UserId.ToString(),
                SongId = args.SongId.ToString(),
                FriendUserId = args.FriendUserId.ToString(),
                Username = args.Username,
                Userface = args.Userface,
                Cover = cover,
                Comment = args.Comment,
                FriendUserName = args.FriendUserName,
                FriendUserFace = args.FriendUserFace,
                Title = args.Title,
                Artist = args.Artist,
                Createddatetime = args.Createddatetime.ToString("yyyy-MM-dd HH:mm:ss"),
                Year = args.Year,
                Backup01 = args.Backup01,
                Backup02 = args.Backup02,
                Backup03 = args.Backup03,
                FriendSignature = args.FriendSignature,
                FriendRegistrationTime = args.FriendRegistrationTime.ToString("yyyy-MM-dd HH:mm:ss")
            };
            return result;
        }
    }
}
