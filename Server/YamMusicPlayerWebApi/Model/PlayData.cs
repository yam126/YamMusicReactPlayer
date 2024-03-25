using DataAccess.Model;

namespace YamMusicPlayerWebApi.Model
{
    /// <summary>
    /// 播放页数据
    /// </summary>
    public class PlayData
    {
        /// <summary>
        /// 歌曲信息
        /// </summary>
        public songinfoResult songinfo { get; set; }

        /// <summary>
        /// 创建者信息
        /// </summary>
        public userInfoResult creater { get; set; }

        /// <summary>
        /// 专辑信息
        /// </summary>
        public albuminfo albuminfo { get; set; }

        /// <summary>
        /// 专辑歌曲列表
        /// </summary>
        public List<songinfoResult> albumSongList { get; set; }
    }
}
