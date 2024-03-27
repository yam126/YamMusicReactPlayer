using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Snowflake.Net;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;
using Result = YamMusicPlayerWebApi.Model.Result;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 播放页面控制层
    /// </summary>
    [ApiController]
    [Route("api/PlayPage")]
    public class PlayPageController : Controller
    {
        /// <summary>
        /// 获取播放数据
        /// </summary>
        /// <param name="albumId">专辑编号</param>
        /// <param name="songId">歌曲编号</param>
        /// <returns>播放页数据</returns>
        [HttpGet]
        [Route("Data")]
        public EntityResult<PlayData> GetPlayerData(string albumId = "", string songId = "",string userId="")
        {

            #region 声明变量

            //错误消息
            string message = string.Empty;

            //host地址
            string host = PublicFunction.GetRequestHost(Request);

            //歌曲信息
            var songInfo = new List<songinfo>();

            //专辑信息
            var albums = new List<albuminfo>();

            //创建者
            var creater = new List<userinfo>();

            //专辑歌曲列表
            var albumSongList = new List<songinfo>();

            //返回数据
            var resultData = new PlayData();

            //返回值
            var result = new EntityResult<PlayData>();
            #endregion

            #region 初始化返回值
            result = new EntityResult<PlayData>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = null
            };
            #endregion

            #region 获取专辑信息
            if (!string.IsNullOrEmpty(albumId) && albumId != "null")
            {
                albums = new albuminfo_BLL().Query($" albumId='{albumId}' ", out message);
                if (albums == null || albums.Count <= 0)
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"专辑信息读取报错,{message}";
                    else
                        message = "没有读取到专辑信息";
                    result.Status = -1;
                    result.Msg = $"专辑信息读取出错,原因[{message}]";
                    return result;
                }

                albumSongList = new songinfo_BLL().Query($" albumId='{albumId}' ", out message);
                if (albumSongList == null || albumSongList.Count <= 0)
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"获取专辑歌曲列表出错,{message}";
                    else
                        message = "没有获取到专辑歌曲列表";
                    result.Status = -1;
                    result.Msg = message;
                    return result;
                }

                #region 读取创建人
                creater = new userinfo_BLL().Query($" userid='{albumSongList[0].userid.GetValueOrDefault().ToString()}' ", out message);
                if (creater == null || creater.Count <= 0)
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"获取歌曲上传者出错,{message}";
                    else
                        message = "没有获取到歌曲上传";
                    result.Status = -1;
                    result.Msg = message;
                    return result;
                }
                #endregion

                ConvertApiReult(ref resultData,host, Request, albums[0], albumSongList, creater[0], albumSongList[0]);
                result.Status = 0;
                result.Msg = string.Empty;
                result.Result = resultData;
                //return result;
            }
            #endregion

            #region 获取歌曲信息
            if (!string.IsNullOrEmpty(songId) && songId != "null")
            {
                songInfo = new songinfo_BLL().Query($" songId='{songId}' ", out message);
                if (songInfo == null || songInfo.Count <= 0)
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"歌曲信息读取报错,{message}";
                    else
                        message = "没有读取到歌曲信息";
                    result.Status = -1;
                    result.Msg = message;
                    return result;
                }

                albums = new albuminfo_BLL().Query($" albumId='{songInfo[0].albumId}' ", out message);
                if (albums == null || albums.Count <= 0)
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"专辑信息读取报错,{message}";
                    else
                        message = "没有读取到专辑信息";
                    result.Status = -1;
                    result.Msg = $"专辑信息读取出错,原因[{message}]";
                    return result;
                }

                albumSongList = new songinfo_BLL().Query($" albumId='{albums[0].albumId}' ", out message);
                if (albumSongList == null || albumSongList.Count <= 0)
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"获取专辑歌曲列表出错,{message}";
                    else
                        message = "没有获取到专辑歌曲列表";
                    result.Status = -1;
                    result.Msg = message;
                    return result;
                }

                #region 读取创建人
                creater = new userinfo_BLL().Query($" userid='{songInfo[0].userid.GetValueOrDefault().ToString()}' ",out message);
                if(creater==null || creater.Count <= 0) 
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"获取歌曲上传者出错,{message}";
                    else
                        message = "没有获取到歌曲上传";
                    result.Status = -1;
                    result.Msg = message;
                    return result;
                }
                #endregion
                
                ConvertApiReult(ref resultData,host,Request,albums[0],albumSongList,creater[0],songInfo[0]);
                result.Status = 0;
                result.Msg = string.Empty;
                result.Result = resultData;
                //return result;
            }
            #endregion

            #region 保存常听歌曲信息
            if(!string.IsNullOrEmpty(userId)&&userId!="null")
                RecordRecentlyListend(userId, result.Result.songinfo.songId);
            #endregion

            return result;
        }

        /// <summary>
        /// 记录常听专辑
        /// </summary>
        /// <param name="UserId">歌曲编号</param>
        /// <param name="SongId">歌曲编号</param>
        /// <returns>返回值</returns>
        private Result RecordRecentlyListend(string UserId,string SongId) 
        {
            #region 声明变量

            //数据库状态返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //验证信息
            string checkMessage = string.Empty;

            //用户信息
            var user = new List<userinfo>();

            //歌曲信息
            var song = new List<songinfo>();

            //雪花IDD
            var snowId = new IdWorker(1, 1);

            //要添加的数据
            var insertData = new List<recentlylistened>();

            //返回值
            var result=new Result();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(UserId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(SongId))
                checkMessage += "歌曲编号、";
            if (!string.IsNullOrEmpty(checkMessage)) 
            {
                checkMessage=checkMessage.Substring(0,checkMessage.Length-1);
                result = new Result() 
                {
                    Status = -1,
                    Msg=$"非空验证出错,原因[{checkMessage}]"
                };
            }
            #endregion

            #region 用户信息
            user = new userinfo_BLL().Query($" userid='{UserId}' ", out message);
            if (user == null || user.Count <= 0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户信息出错,原因[{message}]";
                else
                    message = $"读取用户信息出错,原因[没有读取到用户信息]";
                result = new Result() 
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 歌曲信息
            song = new songinfo_BLL().Query($" songId='{SongId}' ", out message);
            if(song==null || song.Count <= 0) 
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取歌曲信息出错,原因[{message}]";
                else
                    message = $"读取歌曲信息出错,原因[没有读取到歌曲信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 赋值数据
            insertData.Add(new recentlylistened() 
            {
                RecordID=snowId.NextId(),
                SongId = song[0].songId.GetValueOrDefault(),
                AlbumId = song[0].albumId.GetValueOrDefault(),
                UserID = user[0].userid.GetValueOrDefault(),
                CreatedDataTime=DateTime.Now
            });
            #endregion

            #region 保存数据
            resultDbState = new recentlylistened_BLL().Insert(insertData, out message);
            if (resultDbState != 0) 
            {
                result = new Result() 
                {
                    Status=-1,
                    Msg=$"保存数据出错,原因[{message}]"
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
        /// 转换播放页返回值
        /// </summary>
        /// <param name="resultData">返回数据</param>
        /// <param name="host">host</param>
        /// <param name="Request">request</param>
        /// <param name="albuminfo">专辑信息</param>
        /// <param name="albumSongList">专辑歌曲列表</param>
        /// <param name="creater">创建者</param>
        /// <param name="songinfo">歌曲信息</param>
        private void ConvertApiReult(ref PlayData resultData,
            string host,
            HttpRequest Request,
            albuminfo albuminfo,
            List<songinfo> albumSongList,
            userinfo creater,
            songinfo songinfo)
        {
            resultData.albuminfo = albuminfo;
            resultData.songinfo = PublicFunction.ConvertApiResult(songinfo, Request);
            resultData.albumSongList = new List<songinfoResult>();
            foreach (var item in albumSongList)
                resultData.albumSongList.Add(PublicFunction.ConvertApiResult(item, Request));
            resultData.creater = PublicFunction.ConvertApi(creater,Request);
            resultData.songinfo.cover =resultData.songinfo.cover;
            resultData.songinfo.fileName = $"{PublicFunction.GetRequestHost(Request)}/Files/SondFiles/{resultData.songinfo.fileName}";
            resultData.albuminfo.albumCover = $"{host}/{PublicFunction.ConvertCover(resultData.albuminfo.albumCover)}";
            for (var i = 0; i < resultData.albumSongList.Count; i++)
            {
                var cover = resultData.albumSongList[i].cover;
                var fileName = resultData.albumSongList[i].fileName;
                fileName = $"{PublicFunction.GetRequestHost(Request)}/Files/SondFiles/{fileName}";
                resultData.albumSongList[i].fileName = fileName;
                resultData.albumSongList[i].cover = cover;
            }
        }
    }
}
