using Microsoft.AspNetCore.Mvc;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;
using System.IO;
using DataAccess.Model;
using Snowflake.Net;
using DataAccess.BLL;
using System.Runtime.InteropServices;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 测试数据控制器
    /// </summary>
    [ApiController]
    [Route("api/Test")]
    public class InsertTestController : Controller
    {
        /// <summary>
        /// 测试MP3文件
        /// </summary>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("InsertMP3Files")]
        public EntityResult<List<string>> InsertMP3Files()
        {
            int state = -1;
            string message = string.Empty;
            string Mp3FilePath = "D:\\mp3";
            string[] Files = Directory.GetFiles(Mp3FilePath, "*.mp3");
            long userId = 1745785293333729280;
            List<string> messageList = new List<string>();
            EntityResult<List<string>> result = new EntityResult<List<string>>();
            List<songinfo> mp3List = new List<songinfo>();
            List<albuminfo> albumList = new List<albuminfo>();
            List<songinfo> insertSongData = new List<songinfo>();
            List<albuminfo> insertAlbumData = new List<albuminfo>();
            IdWorker sonowId = new IdWorker(1, 1);
            result.Status = -1;
            result.Msg = string.Empty;
            foreach (string file in Files)
            {
                try
                {
                    if (System.IO.File.Exists(file))
                    {
                        #region 分析MP3文件
                        FileInfo mp3File = new FileInfo(file);
                        Mp3FileNewHelper mp3Helper = new Mp3FileNewHelper(file);
                        songinfo mp3Info = mp3Helper.AnalyseMp3File();
                        mp3List.Add(mp3Info);
                        #endregion
                    }
                }
                catch (Exception ex)
                {
                    message = $"文件[{file}]分析出错,原因[{ex.Message}]";
                    messageList.Add(message);
                }
            }

            #region 赋值数据
            if (mp3List.Count > 0)
            {
                #region 按专辑分类
                var mp3Grop = mp3List.GroupBy(g => g.Album)
                    .Select(g => new
                    {
                        Album = g.Key,
                        AlbumSong = g.ToList()
                    });
                #endregion

                foreach (var mp3GroupItem in mp3Grop)
                {
                    #region 专辑信息赋值
                    albuminfo albumData = new albuminfo();
                    albumData.albumId = sonowId.NextId();
                    albumData.userid = userId;
                    albumData.albumName = mp3GroupItem.Album;
                    albumData.albumIntro = mp3GroupItem.Album;
                    albumData.albumAuthor = mp3GroupItem.AlbumSong.First().artist;
                    albumData.albumCover = mp3GroupItem.AlbumSong.First().cover;
                    albumData.modifierId = userId;
                    albumData.createdatetime = DateTime.Now;
                    albumData.modifieddatetime = DateTime.Now;
                    #endregion
                    insertAlbumData.Add(albumData);
                    foreach (var songItem in mp3GroupItem.AlbumSong)
                    {
                        #region 歌曲信息
                        songinfo song = new songinfo();
                        song.userid = userId;
                        song.songId = songItem.songId;
                        song.albumId = albumData.albumId;
                        song.reserved1 = songItem.reserved1;
                        song.reserved2 = songItem.reserved2;
                        song.reserved3 = songItem.reserved3;
                        song.Album = albumData.albumName;
                        song.artist = mp3GroupItem.Album;
                        song.comment = songItem.comment;
                        song.title = songItem.title;
                        song.cover = songItem.cover;
                        song.fileSize = songItem.fileSize;
                        song.duration = songItem.duration;
                        song.createdatetime = DateTime.Now;
                        song.modifieddatetime = DateTime.Now;
                        song.year = songItem.year;
                        song.fileType = songItem.fileType;
                        song.fileName = songItem.fileName;
                        song.modifierId = userId;
                        #endregion
                        insertSongData.Add(song);
                    }
                }
            }
            #endregion

            #region 保存数据
            state = new albuminfo_BLL().Insert(insertAlbumData, out message);
            if (state != 0)
            {
                result.Msg = $"保存专辑数据失败,原因[{message}]";
                return result;
            }
            else
            {
                state = new songinfo_BLL().Insert(insertSongData, out message);
                if (state != 0)
                {
                    result.Msg = $"保存歌曲数据失败,原因[{message}]";
                    return result;
                }
            }
            #endregion

            result.Result = messageList;
            return result;
        }

        /// <summary>
        /// 更新专辑歌曲数量
        /// </summary>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("UpadteAlbumSongData")]
        public Result UpadteAlbumSongData()
        {
            var result = new Result();
            var albums = new List<albuminfo>();
            string message = string.Empty;
            albums = new albuminfo_BLL().Query(string.Empty, out message);
            if (albums.Count > 0)
            {
                foreach (albuminfo album in albums)
                {
                    var songList = new songinfo_BLL().Query($" albumId='{album.albumId}' ", out message);
                    album.songLength = songList.Count;
                    new albuminfo_BLL().Update(album, $" albumId='{album.albumId}' ", out message);
                }
            }
            return result;
        }

        /// <summary>
        /// 添加歌曲评论测试数据
        /// </summary>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("InsertSongCommentData")]
        public Result InsertSongCommentData()
        {
            #region 声明变量

            //数据库返回状态
            int resultDbState = -1;

            //添加测试数据数量
            int inserTestCount = 100;

            //评论数量
            int inserTestContent = 10;

            //错误消息
            string message = string.Empty;

            //歌曲列表
            var songinfos = new List<songinfo>();

            //用户列表
            var userinfos = new List<userinfo>();

            //歌曲评论要添加的数据
            var songcomments = new List<songcomment>();

            //雪花ID
            var sonwId = new IdWorker(1, 1);

            //返回值
            var result = new Result();
            #endregion

            #region 获取所有歌曲信息
            songinfos = new songinfo_BLL().Query(string.Empty, out message);
            if (songinfos == null || songinfos.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取歌曲信息出错,原因[{message}]";
                else
                    message = "获取歌曲信息出错,原因[歌曲信息为空]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 获取所有用户信息
            userinfos = new userinfo_BLL().Query(string.Empty, out message);
            if (userinfos == null || userinfos.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取用户信息出错,原因[{message}]";
                else
                    message = "获取用户信息出错,原因[没有获取到任何用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 循环准备数据
            foreach (var songinfo in songinfos)
            {
                for (var i = 0; i < inserTestCount; i++)
                {
                    var userinfo = userinfos[new Random().Next(0, userinfos.Count - 1)];
                    string content = string.Empty;
                    for (var j = 0; j < inserTestContent; j++)
                        content += $"测试评论内容{i}{j},";
                    songcomments.Add(new songcomment()
                    {
                        commentId = sonwId.NextId(),
                        content = content,
                        songId = songinfo.songId,
                        publisher = userinfo.userid,
                        createddatetime = DateTime.Now.AddSeconds(i)
                    });
                }
            }
            #endregion

            #region 添加数据
            resultDbState = new songcomment_BLL().Insert(songcomments, out message);
            if (resultDbState != 0)
            {
                message = $"添加歌曲评论数据出错,原因[{message}]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion


            result = new Result()
            {
                Status = 0,
                Msg = message
            };
            return result;
        }

        /// <summary>
        /// 添加最近收听数据
        /// </summary>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("InsertRecentlyListened")]
        public Result InsertRecentlyListened()
        {
            #region 声明变量

            //数据库返回状态
            int resultDbState = -1;

            //要插入的测试数据数量
            int insertTestDataCount = 100;

            //错误消息
            string message = string.Empty;

            //雪花ID
            var snowId = new IdWorker(1, 1);

            //用户信息
            var users = new List<userinfo>();

            //歌曲列表
            var songList = new List<songinfo>();

            //要添加的数据
            var insertData = new List<recentlylistened>();

            //返回值
            var result = new Result();
            #endregion

            #region 获取用户信息
            users = new userinfo_BLL().Query(string.Empty, out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取用户信息出错,原因[{message}]";
                else
                    message = $"获取用户信息出错,原因[没有获取到任何用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 读取歌曲信息
            songList = new songinfo_BLL().Query(string.Empty, out message);
            if (songList == null || songList.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取歌曲信息出错,原因[{message}]";
                else
                    message = $"获取歌曲信息出错,原因[没有获取到任何歌曲信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 循环生成数据
            foreach (var user in users)
            {
                for (var i = 0; i < insertTestDataCount; i++)
                {
                    var songIndex = new Random().Next(0, songList.Count - 1);
                    var song = songList[songIndex];
                    insertData.Add(new recentlylistened()
                    {
                        RecordID = snowId.NextId(),
                        UserID = user.userid.GetValueOrDefault(),
                        SongId = song.songId.GetValueOrDefault(),
                        AlbumId = song.albumId.GetValueOrDefault(),
                        CreatedDataTime = DateTime.Now
                    });
                }
            }
            #endregion

            #region 保存数据
            resultDbState = new recentlylistened_BLL().Insert(insertData, out message);
            if (resultDbState != 0)
            {
                message = $"添加最近收听数据出错,原因[{message}]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = message
            };
            return result;
        }

        /// <summary>
        /// 添加分享测试记录
        /// </summary>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("InsertSharingHistory")]
        public Result InsertSharingHistory()
        {

            #region 声明变量

            //数据库返回状态
            int resultDbState = -1;

            //要插入的测试数据数量
            int insertTestDataCount = 100;

            //错误消息
            string message = string.Empty;

            //雪花ID
            var snowId = new IdWorker(1, 1);

            //用户信息
            var users = new List<userinfo>();

            //歌曲列表
            var songList = new List<songinfo>();

            //要添加的数据
            var insertData = new List<sharinghistory>();

            //返回值
            var result = new Result();
            #endregion

            #region 获取用户信息
            users = new userinfo_BLL().Query(string.Empty, out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取用户信息出错,原因[{message}]";
                else
                    message = $"获取用户信息出错,原因[没有获取到任何用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 读取歌曲信息
            songList = new songinfo_BLL().Query(string.Empty, out message);
            if (songList == null || songList.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取歌曲信息出错,原因[{message}]";
                else
                    message = $"获取歌曲信息出错,原因[没有获取到任何歌曲信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 循环生成数据
            foreach (var user in users)
            {
                for (var i = 0; i < insertTestDataCount; i++)
                {
                    var songIndex = new Random().Next(0, songList.Count - 1);
                    var song = songList[songIndex];
                    var shareTargetIndex = new Random().Next(0, users.Count - 1);
                    var shareTarget = users[shareTargetIndex];
                    if (shareTarget.userid != user.userid)
                    {
                        insertData.Add(new sharinghistory()
                        {
                            recordId = snowId.NextId(),
                            shareTarget = shareTarget.userid,
                            shareUser = user.userid,
                            songId = song.songId,
                            CreatedDataTime = DateTime.Now
                        });
                    }
                }
            }
            #endregion

            #region 保存数据
            resultDbState = new sharinghistory_BLL().Insert(insertData, out message);
            if (resultDbState != 0)
            {
                message = $"添加分享历史数据出错,原因[{message}]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = message
            };
            return result;
        }

        /// <summary>
        /// 添加测试用户好友数据
        /// </summary>
        /// <returns>返回值</returns>
        [HttpGet]
        [Route("InsertFriendsData")]
        public Result InsertFriendsData()
        {
            #region 声明变量

            //数据库返回状态
            int resultDbState = -1;

            //消息字符串
            string message = string.Empty;

            //雪花ID
            var snowId = new IdWorker(1, 1);

            //用户信息
            var users = new List<userinfo>();

            //歌曲列表
            var songList = new List<songinfo>();

            //要添加的数据
            var insertData = new List<friends>();

            //返回值
            var result = new Result();
            #endregion

            #region 获取用户信息
            users = new userinfo_BLL().Query(string.Empty, out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取用户信息出错,原因[{message}]";
                else
                    message = $"获取用户信息出错,原因[没有获取到任何用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 读取歌曲信息
            songList = new songinfo_BLL().Query(string.Empty, out message);
            if (songList == null || songList.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"获取歌曲信息出错,原因[{message}]";
                else
                    message = $"获取歌曲信息出错,原因[没有获取到任何歌曲信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 循环生成数据
            for(var j=0; j<users.Count; j++)
            {
                var user = users[j];
                for (var i = 0; i < users.Count; i++)
                {
                    var friend = users[i];
                    var songIndex = new Random().Next(0, songList.Count - 1);
                    insertData.Add(new friends()
                    {
                        recordId = snowId.NextId(),
                        userId = user.userid.GetValueOrDefault(),
                        friendUserId = friend.userid.GetValueOrDefault(),
                        songId = songList[songIndex].songId,
                        createddatetime = DateTime.Now.AddSeconds(i+j)
                    });
                }
            }
            #endregion

            #region 保存数据
            resultDbState = new friends_BLL().Insert(insertData, out message);
            if (resultDbState != 0)
            {
                message = $"添加分享历史数据出错,原因[{message}]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = message
            };
            return result;
        }
    }
}
