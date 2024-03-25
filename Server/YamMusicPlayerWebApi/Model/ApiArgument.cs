namespace YamMusicPlayerWebApi.Model
{
    /// <summary>
    /// 注册参数
    /// </summary>
    public class RegistArgument
    {
        /// <summary>
        ///用户编号
        /// </summary>
        public System.Int64? userId { get; set; }

        /// <summary>
        ///用户名
        /// </summary>
        public System.String userName { get; set; }

        /// <summary>
        ///密码
        /// </summary>
        public System.String passWord { get; set; }

        /// <summary>
        /// 重复密码
        /// </summary>
        public System.String rePassWord { get; set; }

        /// <summary>
        ///电子邮件
        /// </summary>
        public System.String email { get; set; }

        /// <summary>
        ///微信号
        /// </summary>
        public System.String weChart { get; set; }

        /// <summary>
        /// 验证码
        /// </summary>
        public System.String checkCode { get; set; }
    }

    /// <summary>
    /// 检查登陆状态参数
    /// </summary>
    public class CheckLoginArgument 
    {
        /// <summary>
        /// 用户编号
        /// </summary>
        public string userId { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public System.String userName { get; set;}

        /// <summary>
        /// token
        /// </summary>
        public string token { get; set; }
    }

    /// <summary>
    /// 分页参数
    /// </summary>
    public class PageingArgument 
    {
        /// <summary>
        /// 查询条件
        /// </summary>
        public string? SqlWhere { get; set; }

        /// <summary>
        /// 排序字段
        /// </summary>
        public string? SortField { get; set; }

        /// <summary>
        /// 排序方法[ASC|DESC]
        /// </summary>
        public string? SortMethod { get; set; }

        /// <summary>
        /// 每页记录数
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// 当前页
        /// </summary>
        public int CurPage { get; set; }
    }

    /// <summary>
    /// 发表评论参数
    /// </summary>
    public class LeaveCommentArgument 
    {
        /// <summary>
        /// 歌曲编号
        /// </summary>
        public string songId { get; set; }

        /// <summary>
        /// 用户编号
        /// </summary>
        public string userId { get; set; }

        /// <summary>
        /// 评论内容
        /// </summary>
        public string content { get; set; }
    }

    /// <summary>
    /// 切换用户头像
    /// </summary>
    public class ChangeUserFaceArgument 
    { 
        /// <summary>
        /// 用户编号
        /// </summary>
        public string userId { get; set; }
        
        /// <summary>
        /// 用户头像URL
        /// </summary>
        public string userFaceUrl { get; set; }
    }

    /// <summary>
    /// 编辑密码参数
    /// </summary>
    public class EditPasswordArgument 
    {
        /// <summary>
        /// 用户编号
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// 原密码
        /// </summary>
        public string SourcePassword { get; set; }

        /// <summary>
        /// 新密码
        /// </summary>
        public string NewPassword { get; set; }

        /// <summary>
        /// 重复密码
        /// </summary>
        public string RepartPassword { get; set; }
    }

    /// <summary>
    /// 编辑签名参数
    /// </summary>
    public class EditSignatureArgument 
    {
        /// <summary>
        /// 用户编号
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 签名
        /// </summary>
        public string Signature { get; set; }
    }

    /// <summary>
    /// 添加好友参数
    /// </summary>
    public class AddFriendArgument 
    {
        /// <summary>
        /// 用户编号
        /// </summary>
        public string UserId { get; set; }
        
        /// <summary>
        /// 好友编号
        /// </summary>
        public string FriendId { get; set; }
    }

    /// <summary>
    /// 添加分享历史参数
    /// </summary>
    public class AddSharingHistoryArgument 
    {
        /// <summary>
        ///歌曲编号
        /// </summary>
        public string songId { get; set; }

        /// <summary>
        ///分享目标用户编号
        /// </summary>
        public string shareTarget { get; set; }

        /// <summary>
        ///分享用户编号
        /// </summary>
        public string shareUser { get; set; }
    }
}
