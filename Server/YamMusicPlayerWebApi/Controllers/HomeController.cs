using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Controllers
{
    [Route("api/Home")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        /// <summary>
        /// 获得焦点图
        /// </summary>
        /// <param name="userId">用户编号</param>
        /// <param name="limit">获取几条数据(默认5条)</param>
        /// <returns>焦点图数据</returns>
        [HttpGet]
        [Route("focusImage")]
        public EntityResult<List<FocusImageResult>> GetFocusImage(string? userId="",int limit=5) 
        {
            string message = string.Empty;
            string SqlWhere = $" 1=1 order by songId desc limit {limit}";
            var songinfos = new List<songinfo>();
            var resultList = new List<FocusImageResult>();
            var result= new EntityResult<List<FocusImageResult>>();
            songinfos = new songinfo_BLL().Query(SqlWhere, out message);
            
            if(songinfos==null || songinfos.Count<=0) 
            {
                if(!string.IsNullOrEmpty(message)) 
                {
                    result = new EntityResult<List<FocusImageResult>>() 
                    {
                        Status=-1,
                        Msg=$"读取焦点图数据出错，原因[{message}]",
                        Result=null
                    };
                    return result;
                }
            }

            foreach(songinfo song in songinfos) 
            {
                string cover = PublicFunction.ConvertCover(song.cover);
                FocusImageResult focusImage = new FocusImageResult();
                focusImage.FocusImageID = song.songId.GetValueOrDefault().ToString();
                focusImage.FocusImageName = song.title;
                focusImage.FocusImageURL = $"{PublicFunction.GetRequestHost(Request)}/{cover}";
                focusImage.FocusImageData = "song";
                resultList.Add(focusImage);
            }

            result.Status = 0;
            result.Msg = string.Empty;
            result.Result = resultList;
            return result;
        }

        /// <summary>
        /// 获取最近收听
        /// </summary>
        /// <param name="userId">用户编号</param>
        /// <param name="limit">获取几条数据(默认5条)</param>
        /// <returns>焦点图数据</returns>
        [HttpGet]
        [Route("recentlylistened")]
        public EntityResult<List<songinfoResult>> GetRecentlyListened(string? userId="",int limit=5) 
        {
            #region 声明变量

            //错误消息
            string? message = string.Empty;

            //查询条件
            string? SqlWhere = string.Empty;

            //ID查询条件
            string? IDWhere=string.Empty;

            //歌曲编号列表
            var songIdList = new List<string>();

            //返回值
            var result=new EntityResult<List<songinfoResult>>();
            
            //歌曲信息
            var resultDbData = new List<songinfo>();

            //最近收听记录
            var recentlylisteneds = new List<recentlylistened>();
            #endregion

            #region 获取最近收听记录
            if(!string.IsNullOrEmpty(userId)) 
            {
                SqlWhere = $" UserID={userId} order by CreatedDataTime desc limit {limit} ";
                recentlylisteneds = new recentlylistened_BLL().Query(SqlWhere, out message);
                if (!string.IsNullOrEmpty(message)) 
                {
                    result.Status = -1;
                    result.Msg = $"获取最近收听数据失败,原因[{message}]";
                    return result;
                }
                if (recentlylisteneds != null && recentlylisteneds.Count > 0)
                {
                    recentlylisteneds.ForEach(item =>
                    {
                        IDWhere += $"'{item.SongId.GetValueOrDefault()}',";
                    });
                    if (recentlylisteneds.Count < limit) 
                    {
                        int difference = limit - recentlylisteneds.Count;
                        songIdList = new songinfo_BLL().QuerySongIDLimit(difference, out message);
                        if (songIdList != null && songIdList.Count > 0) 
                        {
                            songIdList.ForEach(item => {
                                IDWhere += $"'{item}',";
                            });
                        }
                    }
                    IDWhere = IDWhere.Substring(0, IDWhere.Length - 1);
                }
            }
            #endregion

            #region 获取歌曲
            if(!string.IsNullOrEmpty(IDWhere)) 
                SqlWhere = $" songId in ({IDWhere}) order by createdatetime desc limit {limit} ";
            else
                SqlWhere = $" 1=1 order by createdatetime desc limit {limit} ";
            resultDbData = new songinfo_BLL().Query(SqlWhere, out message);
            if(!string.IsNullOrEmpty(message)) 
            {
                result.Status = -1;
                result.Msg = $"读取最近收听歌曲数据失败,原因[{message}]";
                return result;
            }
            if(resultDbData!=null&& resultDbData.Count > 0) 
            {
                result.Result = new List<songinfoResult>();
                for (var i = 0; i < resultDbData.Count; i++) 
                {
                    //string cover = PublicFunction.ConvertCover(resultDbData[i].cover);
                    //resultDbData[i].cover= $"{PublicFunction.GetRequestHost(Request)}/{cover}";
                    result.Result.Add(PublicFunction.ConvertApiResult(resultDbData[i], Request));
                }
            }
            #endregion

            result.Status=0;
            result.Msg = string.Empty;
            return result;
        }

        /// <summary>
        /// 获取最近收听
        /// </summary>
        /// <param name="userId">用户编号</param>
        /// <param name="limit">获取几条数据(默认5条)</param>
        /// <returns>焦点图数据</returns>
        [HttpGet]
        [Route("recentlylistenedAlbum")]
        public EntityResult<List<albuminfoResult>> GetRecentlyListendAlbum(string? userId = "", int limit = 5) 
        {
            #region 声明变量

            //错误消息
            string message = string.Empty;

            //查询条件
            string? SqlWhere = string.Empty;

            //ID查询条件
            string? IDWhere = string.Empty;

            //返回数据
            var resultDbData = new List<albuminfo>();

            //返回值
            var result = new EntityResult<List<albuminfoResult>>();

            //专辑列表
            var albumIdList=new List<string>();

            //常听专辑编号
            var recentlyListendAlbumId = new List<string>();
            #endregion

            #region 拼接查询条件
            if (!string.IsNullOrEmpty(userId))
                SqlWhere = $" UserID='{userId}' ";
            else
                SqlWhere = " 1=1 ";
            SqlWhere += $" order by CreatedDataTime desc limit {limit} ";
            #endregion

            #region 读取常听专辑信息
            recentlyListendAlbumId = new recentlylistened_BLL().QueryDistinctAlbumId(SqlWhere, out message);
            if (recentlyListendAlbumId == null || recentlyListendAlbumId.Count <= 0) 
            {
                if(!string.IsNullOrEmpty(message)) 
                {
                    result.Status = -1;
                    result.Msg = $"读取常听专辑数据出错,原因[{message}]";
                    return result;
                }
                SqlWhere = string.Empty;
            }
            else 
            {
                if (recentlyListendAlbumId.Count < limit) 
                {
                    int difference = limit - recentlyListendAlbumId.Count;
                    albumIdList=new albuminfo_BLL().QueryIDLimit(difference, out message);
                    if (albumIdList != null && albumIdList.Count > 0) 
                    {
                        albumIdList.ForEach(item => {
                            recentlyListendAlbumId.Add(item);
                        });
                    }
                }
                recentlyListendAlbumId.ForEach(item => {
                    IDWhere += $"'{item}',";
                });
                IDWhere = IDWhere.Substring(0, IDWhere.Length - 1);
            }
            #endregion

            #region 获取专辑信息
            if (!string.IsNullOrEmpty(IDWhere))
                SqlWhere = $" albumId in ({IDWhere}) order by createdatetime desc limit {limit} ";
            else
                SqlWhere = $" 1=1 order by createdatetime desc limit {limit} ";
            resultDbData = new albuminfo_BLL().Query(SqlWhere, out message);
            if (!string.IsNullOrEmpty(message))
            {
                result.Status = -1;
                result.Msg = $"读取最近收听歌曲数据失败,原因[{message}]";
                return result;
            }
            if (resultDbData != null && resultDbData.Count > 0)
            {
                result.Result = new List<albuminfoResult>();
                for (var i = 0; i < resultDbData.Count; i++)
                {
                    //string cover = PublicFunction.ConvertCover(resultDbData[i].albumCover);
                    //resultDbData[i].albumCover = $"{PublicFunction.GetRequestHost(Request)}/{cover}";
                    result.Result.Add(PublicFunction.ConvertApi(resultDbData[i], Request));
                }
            }
            #endregion

            result.Status = 0;
            result.Msg = string.Empty;
            return result;
        }
    }
}
