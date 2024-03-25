using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Model
{
    /// <summary>
    /// 专辑信息 
    /// </summary>
    [Serializable]
    public partial class albuminfo
    {

        /// <summary>
        ///专辑编号
        /// </summary>
        public System.Int64? albumId { get; set; }

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
        public System.Int32? viewCount { get; set; }

        /// <summary>
        ///分享次数
        /// </summary>
        public System.Int32? shareCount { get; set; }

        /// <summary>
        ///创建人
        /// </summary>
        public System.Int64? userid { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.DateTime? createdatetime { get; set; }

        /// <summary>
        ///修改人
        /// </summary>
        public System.Int64? modifierId { get; set; }

        /// <summary>
        ///修改时间
        /// </summary>
        public System.DateTime? modifieddatetime { get; set; }

        /// <summary>
        ///歌曲数量
        /// </summary>
        public System.Int32? songLength { get; set; }
    }

    /// <summary>
    /// app设备信息 
    /// </summary>
    [Serializable]
    public partial class appdevicerecord
    {

        /// <summary>
        ///用户编号
        /// </summary>
        public System.Int64? userid { get; set; }

        /// <summary>
        ///设备id
        /// </summary>
        public System.String deviceid { get; set; }

        /// <summary>
        ///token
        /// </summary>
        public System.String token { get; set; }

        /// <summary>
        ///设备类型(1-PC 2-IPhone 3-Android)
        /// </summary>
        public System.Int32? DeviceType { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.DateTime? createdatetime { get; set; }

        /// <summary>
        ///修改时间
        /// </summary>
        public System.DateTime? modifieddatetime { get; set; }
    }

    /// <summary>
    /// 歌曲信息 
    /// </summary>
    [Serializable]
    public partial class songinfo
    {

        /// <summary>
        ///歌曲编号
        /// </summary>
        public System.Int64? songId { get; set; }

        /// <summary>
        ///专辑编号
        /// </summary>
        public System.Int64? albumId { get; set; }

        /// <summary>
        /// 专辑信息
        /// </summary
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
        public System.Double? fileSize { get; set; }

        /// <summary>
        ///歌曲时长
        /// </summary>
        public System.Double? duration { get; set; }

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
        public System.Int64? userid { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.DateTime? createdatetime { get; set; }

        /// <summary>
        ///修改人
        /// </summary>
        public System.Int64? modifierId { get; set; }

        /// <summary>
        ///修改时间
        /// </summary>
        public System.DateTime? modifieddatetime { get; set; }
    }

    /// <summary>
    /// 用户信息 
    /// </summary>
    [Serializable]
    public partial class userinfo
    {

        /// <summary>
        ///用户编号
        /// </summary>
        public System.Int64? userid { get; set; }

        /// <summary>
        ///用户名
        /// </summary>
        public System.String username { get; set; }

        /// <summary>
        ///密码
        /// </summary>
        public System.String password { get; set; }

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
        public System.DateTime? createdatetime { get; set; }

        /// <summary>
        ///修改时间
        /// </summary>
        public System.DateTime? modifieddatetime { get; set; }

        /// <summary>
        ///用户头像
        /// </summary>
        public System.String userface { get; set; }
    }

    /// <summary>
    /// 用户设备信息
    /// </summary>
    [Serializable]
    public class vw_userdeviceinfo
    {

        /// <summary>
        /// 创建人
        /// </summary>
        public long Userid { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 电子邮件
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// 微信号
        /// </summary>
        public string Wechart { get; set; }

        /// <summary>
        /// 签名
        /// </summary>
        public string Signature { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime Createdatetime { get; set; }

        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime Modifieddatetime { get; set; }

        /// <summary>
        /// 设备id
        /// </summary>
        public string Deviceid { get; set; }

        /// <summary>
        /// token
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// 设备类型(1-PC 2-IPhone 3-Android)
        /// </summary>
        public int DeviceType { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string Userface { get; set; }

    }

    /// <summary>
    /// 最近收听记录 
    /// </summary>
    [Serializable]
    public partial class recentlylistened
    {

        /// <summary>
        ///主键编号
        /// </summary>
        public System.Int64? RecordID { get; set; }

        /// <summary>
        ///用户编号
        /// </summary>
        public System.Int64? UserID { get; set; }

        /// <summary>
        ///歌曲编号
        /// </summary>
        public System.Int64? SongId { get; set; }

        /// <summary>
        ///专辑编号
        /// </summary>
        public System.Int64? AlbumId { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.DateTime? CreatedDataTime { get; set; }
    }

    /// <summary>
    /// 歌曲评论 
    /// </summary>
    [Serializable]
    public partial class songcomment
    {

        /// <summary>
        ///评论编号
        /// </summary>
        public System.Int64? commentId { get; set; }

        /// <summary>
        ///歌曲编号
        /// </summary>
        public System.Int64? songId { get; set; }

        /// <summary>
        ///发布者
        /// </summary>
        public System.Int64? publisher { get; set; }

        /// <summary>
        ///评论内容
        /// </summary>
        public System.String content { get; set; }

        /// <summary>
        ///发布时间
        /// </summary>
        public System.DateTime? createddatetime { get; set; }

        /// <summary>
        ///备用字段01
        /// </summary>
        public System.String backup01 { get; set; }

        /// <summary>
        ///备用字段02
        /// </summary>
        public System.String backup02 { get; set; }

        /// <summary>
        ///备用字段03
        /// </summary>
        public System.String backup03 { get; set; }

        /// <summary>
        ///状态
        /// </summary>
        public System.Int32? state { get; set; }
    }

    /// <summary>
    /// 收听历史 
    /// </summary>
    [Serializable]
    public partial class listeninghistory
    {

        /// <summary>
        ///记录编号
        /// </summary>
        public System.Int64? recordId { get; set; }

        /// <summary>
        ///歌曲编号
        /// </summary>
        public System.Int64? songId { get; set; }

        /// <summary>
        ///用户编号
        /// </summary>
        public System.Int64? userId { get; set; }

        /// <summary>
        ///备用字段01
        /// </summary>
        public System.String backup01 { get; set; }

        /// <summary>
        ///备用字段02
        /// </summary>
        public System.String backup02 { get; set; }

        /// <summary>
        ///备用字段03
        /// </summary>
        public System.String backup03 { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.DateTime? CreationDateTime { get; set; }
    }

    /// <summary>
    /// 歌曲评论视图
    /// </summary>
    [Serializable]
    public class vw_songcomment
    {

        /// <summary>
        /// 评论编号
        /// </summary>
        public long CommentId { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public long SongId { get; set; }

        /// <summary>
        /// 发布者
        /// </summary>
        public long Publisher { get; set; }

        /// <summary>
        /// 评论内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 发布时间
        /// </summary>
        public DateTime Createddatetime { get; set; }

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
        public int State { get; set; }

    }

    /// <summary>
    /// 歌曲收听记录
    /// </summary>
    [Serializable]
    public class vw_recentlylistened
    {

        /// <summary>
        /// 主键编号
        /// </summary>
        public long RecordID { get; set; }

        /// <summary>
        /// 用户编号
        /// </summary>
        public long UserID { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public long SongId { get; set; }

        /// <summary>
        /// 专辑编号
        /// </summary>
        public long AlbumId { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreatedDataTime { get; set; }

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
        public double Duration { get; set; }

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
        public int ViewCount { get; set; }

        /// <summary>
        /// 分享次数
        /// </summary>
        public int ShareCount { get; set; }

        /// <summary>
        /// 歌曲数量
        /// </summary>
        public int SongLength { get; set; }

    }

    /// <summary>
    /// 分享历史 
    /// </summary>
    [Serializable]
    public partial class sharinghistory
    {

        /// <summary>
        ///记录编号
        /// </summary>
        public System.Int64? recordId { get; set; }

        /// <summary>
        ///歌曲编号
        /// </summary>
        public System.Int64? songId { get; set; }

        /// <summary>
        ///分享目标用户编号
        /// </summary>
        public System.Int64? shareTarget { get; set; }

        /// <summary>
        ///分享用户编号
        /// </summary>
        public System.Int64? shareUser { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.DateTime? CreatedDataTime { get; set; }

        /// <summary>
        ///备用字段01
        /// </summary>
        public System.String backup01 { get; set; }

        /// <summary>
        ///备用字段02
        /// </summary>
        public System.String backup02 { get; set; }

        /// <summary>
        ///备用字段03
        /// </summary>
        public System.String backup03 { get; set; }
    }

    /// <summary>
    /// 分享历史视图
    /// </summary>
    [Serializable]
    public class vw_sharinghistory
    {

        /// <summary>
        /// 记录编号
        /// </summary>
        public long RecordId { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public long SongId { get; set; }

        /// <summary>
        /// 分享目标用户编号
        /// </summary>
        public long ShareTarget { get; set; }

        /// <summary>
        /// 分享用户编号
        /// </summary>
        public long ShareUser { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreatedDataTime { get; set; }

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
        public double FileSize { get; set; }

        /// <summary>
        /// 歌曲时长
        /// </summary>
        public double Duration { get; set; }

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

    }

    /// <summary>
    /// 用户好友信息 
    /// </summary>
    [Serializable]
    public partial class friends
    {

        /// <summary>
        ///记录编号
        /// </summary>
        public System.Int64? recordId { get; set; }

        /// <summary>
        ///用户编号
        /// </summary>
        public System.Int64? userId { get; set; }

        /// <summary>
        ///好友用户编号
        /// </summary>
        public System.Int64? friendUserId { get; set; }

        /// <summary>
        ///歌曲编号
        /// </summary>
        public System.Int64? songId { get; set; }

        /// <summary>
        ///创建时间
        /// </summary>
        public System.DateTime? createddatetime { get; set; }

        /// <summary>
        ///备用字段01
        /// </summary>
        public System.String backup01 { get; set; }

        /// <summary>
        ///备用字段02
        /// </summary>
        public System.String backup02 { get; set; }

        /// <summary>
        ///备用字段03
        /// </summary>
        public System.String backup03 { get; set; }
    }

    /// <summary>
    /// 用户好友信息
    /// </summary>
    [Serializable]
    public class vw_friends
    {

        /// <summary>
        /// 记录编号
        /// </summary>
        public long RecordId { get; set; }

        /// <summary>
        /// 用户编号
        /// </summary>
        public long UserId { get; set; }

        /// <summary>
        /// 好友用户编号
        /// </summary>
        public long FriendUserId { get; set; }

        /// <summary>
        /// 歌曲编号
        /// </summary>
        public long SongId { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime Createddatetime { get; set; }

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
        public DateTime FriendRegistrationTime { get; set; }

    }
}
