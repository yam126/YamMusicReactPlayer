using Newtonsoft.Json;

namespace YamMusicPlayerWebApi.JWTModel
{
    /// <summary>
    /// token配置类
    /// </summary>
    public class TokenManagement
    {
        /// <summary>
        /// 密钥
        /// </summary>
        [JsonProperty("secret")]
        public string? Secret { get; set; }

        /// <summary>
        /// 发行者
        /// </summary>
        [JsonProperty("issuer")]
        public string? Issuer { get; set; }

        /// <summary>
        /// 受众
        /// </summary>
        [JsonProperty("audience")]
        public string? Audience { get; set; }

        /// <summary>
        /// 访问过期时间
        /// </summary>
        [JsonProperty("accessExpiration")]
        public int AccessExpiration { get; set; }

        /// <summary>
        /// 刷新过期时间
        /// </summary>
        [JsonProperty("refreshExpiration")]
        public int RefreshExpiration { get; set; }
    }
}
