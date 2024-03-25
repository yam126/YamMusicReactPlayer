namespace YamMusicPlayerWebApi.Model
{
    /// <summary>
    /// 登陆返回值
    /// </summary>
    public class LoginResult
    {
        /// <summary>
        /// 用户编号
        /// </summary>
        public string? userId { get; set; }

        /// <summary>
        /// 用户头像
        /// </summary>
        public string? UserFace { get; set; }

        /// <summary>
        /// token
        /// </summary>
        public string? token { get; set; }
    }
}
