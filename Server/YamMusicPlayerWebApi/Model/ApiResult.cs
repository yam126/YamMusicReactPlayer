namespace YamMusicPlayerWebApi.Model
{
    /// <summary>
    /// 焦点图返回值
    /// </summary>
    public class FocusImageResult 
    {
        /// <summary>
        /// 焦点图编号
        /// </summary>
        public string FocusImageID { get; set; }

        /// <summary>
        /// 焦点图名称
        /// </summary>
        public string FocusImageName { get; set;}

        /// <summary>
        /// 焦点图地址
        /// </summary>
        public string FocusImageURL { get; set;}

        /// <summary>
        /// 焦点图数据
        /// </summary>
        public string FocusImageData { get; set;}
    }

    /// <summary>
    /// 专辑信息 
    /// </summary>
    [Serializable]
    public partial class albuminfoResult
    {

        /// <summary>
        ///专辑编号
        /// </summary>
        public System.String albumId { get; set; }

        /// <summary>
        ///专辑名称
        /// </summary>
        public System.String albumName { get; set; }

        /// <summary>
        ///专辑作者
        /// </summary>
        public System.String albumAuthor { get; set; }

        /// <summary>
        ///专辑简介
        /// </summary>
        public System.String albumIntro { get; set; }

        /// <summary>
        ///专辑封面
        /// </summary>
        public System.String albumCover { get; set; }

        /// <summary>
        ///浏览次数
        /// </summary>
        public System.String viewCount { get; set; }

        /// <summary>
        ///分享次数
        /// </summary>
        public System.String shareCount { get; set; }

        /// <summary>
        ///创建人
        /// </summary>
        public System.String userid { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.String createdatetime { get; set; }

        /// <summary>
        ///修改人
        /// </summary>
        public System.String modifierId { get; set; }

        /// <summary>
        ///修改时间
        /// </summary>
        public System.String modifieddatetime { get; set; }

        /// <summary>
        ///歌曲数量
        /// </summary>
        public System.String songLength { get; set; }
    }

    /// <summary>
    /// 歌曲信息 
    /// </summary>
    [Serializable]
    public partial class songinfoResult
    {

        /// <summary>
        ///歌曲编号
        /// </summary>
        public System.String songId { get; set; }

        /// <summary>
        ///专辑编号
        /// </summary>
        public System.String albumId { get; set; }

        /// <summary>
        /// 专辑信息
        /// </summary>
        public System.String Album { get; set; }

        /// <summary>
        ///歌曲名称
        /// </summary>
        public System.String title { get; set; }

        /// <summary>
        ///专辑封面
        /// </summary>
        public System.String cover { get; set; }

        /// <summary>
        ///文件名
        /// </summary>
        public System.String fileName { get; set; }

        /// <summary>
        ///文件类型
        /// </summary>
        public System.String fileType { get; set; }

        /// <summary>
        ///文件大小
        /// </summary>
        public System.String fileSize { get; set; }

        /// <summary>
        ///歌曲时长
        /// </summary>
        public System.String duration { get; set; }

        /// <summary>
        ///歌手名
        /// </summary>
        public System.String artist { get; set; }

        /// <summary>
        ///年份
        /// </summary>
        public System.String year { get; set; }

        /// <summary>
        ///注释
        /// </summary>
        public System.String comment { get; set; }

        /// <summary>
        ///保留位1
        /// </summary>
        public System.String reserved1 { get; set; }

        /// <summary>
        ///保留位2
        /// </summary>
        public System.String reserved2 { get; set; }

        /// <summary>
        ///保留位3
        /// </summary>
        public System.String reserved3 { get; set; }

        /// <summary>
        ///创建人
        /// </summary>
        public System.String userid { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.String createdatetime { get; set; }

        /// <summary>
        ///修改人
        /// </summary>
        public System.String modifierId { get; set; }

        /// <summary>
        ///修改时间
        /// </summary>
        public System.String modifieddatetime { get; set; }
    }

    /// <summary>
    /// 歌曲评论
    /// </summary>
    [Serializable]
    public partial class vwSongCommentResult
    {
        /// <summary>
        /// 评论编号
        /// </summary>
        public string CommentId { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public string SongId { get; set; }

        /// <summary>
        /// 发布者
        /// </summary>
        public string Publisher { get; set; }

        /// <summary>
        /// 评论内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 发布时间
        /// </summary>
        public string Createddatetime { get; set; }

        /// <summary>
        /// 备用字段01
        /// </summary>
        public string Backup01 { get; set; }

        /// <summary>
        /// 备用字段02
        /// </summary>
        public string Backup02 { get; set; }

        /// <summary>
        /// 备用字段03
        /// </summary>
        public string Backup03 { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string Userface { get; set; }

        /// <summary>
        /// 状态
        /// </summary>
        public string State { get; set; }
    }

    /// <summary>
    /// 常听歌曲记录
    /// </summary>
    [Serializable]
    public class vwRecentlyListened
    {

        /// <summary>
        /// 主键编号
        /// </summary>
        public string RecordID { get; set; }

        /// <summary>
        /// 用户编号
        /// </summary>
        public string UserID { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public string SongId { get; set; }

        /// <summary>
        /// 专辑编号
        /// </summary>
        public string AlbumId { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public string CreatedDataTime { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string Userface { get; set; }

        /// <summary>
        /// 歌曲名称
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 专辑封面
        /// </summary>
        public string Cover { get; set; }

        /// <summary>
        /// 歌手名
        /// </summary>
        public string Artist { get; set; }

        /// <summary>
        /// 歌曲时长
        /// </summary>
        public string Duration { get; set; }

        /// <summary>
        /// 年份
        /// </summary>
        public string Year { get; set; }

        /// <summary>
        /// 注释
        /// </summary>
        public string Comment { get; set; }

        /// <summary>
        /// 文件名
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// 文件类型
        /// </summary>
        public string FileType { get; set; }

        /// <summary>
        /// 文件大小
        /// </summary>
        public double FileSize { get; set; }

        /// <summary>
        /// 专辑名称
        /// </summary>
        public string AlbumName { get; set; }

        /// <summary>
        /// 专辑作者
        /// </summary>
        public string AlbumAuthor { get; set; }

        /// <summary>
        /// 专辑简介
        /// </summary>
        public string AlbumIntro { get; set; }

        /// <summary>
        /// 专辑封面
        /// </summary>
        public string AlbumCover { get; set; }

        /// <summary>
        /// 浏览次数
        /// </summary>
        public string ViewCount { get; set; }

        /// <summary>
        /// 分享次数
        /// </summary>
        public string ShareCount { get; set; }

        /// <summary>
        /// 歌曲数量
        /// </summary>
        public string SongLength { get; set; }

    }

    /// <summary>
    /// 分享历史
    /// </summary>
    [Serializable]
    public class vwSharingHistory
    {

        /// <summary>
        /// 记录编号
        /// </summary>
        public string RecordId { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public string SongId { get; set; }

        /// <summary>
        /// 分享目标用户编号
        /// </summary>
        public string ShareTarget { get; set; }

        /// <summary>
        /// 分享用户编号
        /// </summary>
        public string ShareUser { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public string CreatedDataTime { get; set; }

        /// <summary>
        /// 备用字段01
        /// </summary>
        public string Backup01 { get; set; }

        /// <summary>
        /// 备用字段02
        /// </summary>
        public string Backup02 { get; set; }

        /// <summary>
        /// 备用字段03
        /// </summary>
        public string Backup03 { get; set; }

        /// <summary>
        /// 歌曲名称
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 专辑封面
        /// </summary>
        public string Cover { get; set; }

        /// <summary>
        /// 文件名
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// 文件类型
        /// </summary>
        public string FileType { get; set; }

        /// <summary>
        /// 文件大小
        /// </summary>
        public string FileSize { get; set; }

        /// <summary>
        /// 歌曲时长
        /// </summary>
        public string Duration { get; set; }

        /// <summary>
        /// 歌手名
        /// </summary>
        public string Artist { get; set; }

        /// <summary>
        /// 年份
        /// </summary>
        public string Year { get; set; }

        /// <summary>
        /// 注释
        /// </summary>
        public string Comment { get; set; }

        /// <summary>
        /// 保留位3
        /// </summary>
        public string Reserved3 { get; set; }

        /// <summary>
        /// 保留位2
        /// </summary>
        public string Reserved2 { get; set; }

        /// <summary>
        /// 保留位1
        /// </summary>
        public string Reserved1 { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string ShareTargetUserName { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string ShareTargetUserFace { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string ShareUserName { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string ShareUserFace { get; set; }

        /// <summary>
        /// 是否好友
        /// </summary>
        public string IsFriend { get; set; }
    }

    /// <summary>
    /// 好友用户编号
    /// </summary>
    [Serializable]
    public class vwFriends 
    {
        /// <summary>
        /// 记录编号
        /// </summary>
        public string RecordId { get; set; }

        /// <summary>
        /// 用户编号
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// 好友用户编号
        /// </summary>
        public string FriendUserId { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public string SongId { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public string Createddatetime { get; set; }

        /// <summary>
        /// 备用字段01
        /// </summary>
        public string Backup01 { get; set; }

        /// <summary>
        /// 备用字段02
        /// </summary>
        public string Backup02 { get; set; }

        /// <summary>
        /// 备用字段03
        /// </summary>
        public string Backup03 { get; set; }

        /// <summary>
        /// 歌曲名称
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 专辑封面
        /// </summary>
        public string Cover { get; set; }

        /// <summary>
        /// 歌手名
        /// </summary>
        public string Artist { get; set; }

        /// <summary>
        /// 年份
        /// </summary>
        public string Year { get; set; }

        /// <summary>
        /// 注释
        /// </summary>
        public string Comment { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string Userface { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string FriendUserName { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string FriendUserFace { get; set; }

        /// <summary>
        /// 签名
        /// </summary>
        public string FriendSignature { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public string FriendRegistrationTime { get; set; }
    }

    /// <summary>
    /// 用户信息返回值
    /// </summary>
    [Serializable]
    public class userInfoResult 
    {
        /// <summary>
        ///用户编号
        /// </summary>
        public System.String userid { get; set; }

        /// <summary>
        ///用户名
        /// </summary>
        public System.String username { get; set; }

        /// <summary>
        ///电子邮件
        /// </summary>
        public System.String email { get; set; }

        /// <summary>
        ///微信号
        /// </summary>
        public System.String wechart { get; set; }

        /// <summary>
        ///签名
        /// </summary>
        public System.String signature { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.String createdatetime { get; set; }

        /// <summary>
        ///修改时间
        /// </summary>
        public System.String modifieddatetime { get; set; }

        /// <summary>
        ///用户头像
        /// </summary>
        public System.String userface { get; set; }
    }
}
