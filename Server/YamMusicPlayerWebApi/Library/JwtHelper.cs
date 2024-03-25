using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;
using Snowflake.Net;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using YamMusicPlayerWebApi.JWTModel;

namespace YamMusicPlayerWebApi.Library
{
    public class JwtHelper
    {
        public static string GenerateJsonWebToken(User userInfo)
        {
            var snowId = new IdWorker(1, 1);
            var tokenConfig = GetTokenManagement();
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenConfig.Secret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claimsIdentity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
            claimsIdentity.AddClaim(new Claim("UserId",userInfo.UserId));
            claimsIdentity.AddClaim(new Claim(ClaimTypes.Name, userInfo.UserName));
            claimsIdentity.AddClaim(new Claim("RandomId", snowId.NextId().ToString()));
            claimsIdentity.AddClaim(new Claim("DeviceId", userInfo.DeviceId));
            var token = new JwtSecurityToken(tokenConfig.Issuer,
              tokenConfig.Audience,
              claimsIdentity.Claims,
              expires: DateTime.Now.AddMinutes(tokenConfig.AccessExpiration),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static TokenManagement GetTokenManagement()
        {
            TokenManagement result = null;
            IConfiguration configuration = new ConfigurationBuilder()
                            .AddJsonFile("appsettings.json")
                            .Build();
            result= configuration.GetSection("tokenConfig").Get<TokenManagement>();
            return result;
        }
    }

    /// <summary>
    /// token生成参数类
    /// </summary>
    public class User
    {
        /// <summary>
        /// 用户编号
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 设备编号
        /// </summary>
        public string DeviceId { get; set; }
    }
}
