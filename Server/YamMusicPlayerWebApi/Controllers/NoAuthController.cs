using Microsoft.AspNetCore.Mvc;
using DataAccess.Model;
using YamMusicPlayerWebApi.Model;
using DataAccess.BLL;
using Org.BouncyCastle.Asn1;
using YamMusicPlayerWebApi.Library;
using PublicLibrary;
using Snowflake.Net;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 登陆
    /// </summary>
    [ApiController]
    [Route("/api/NoAuth")]
    public class NoAuthController : Controller
    {
        /// <summary>
        /// 登陆Api
        /// </summary>
        /// <param name="username">用户名</param>
        /// <param name="password">密码</param>
        /// <param name="deviceId">设备ID</param>
        /// <param name="deviceType">设备类型(1-PC 2-IPhone 3-Android)</param>
        /// <returns>返回值(token)</returns>
        [HttpPost]
        [Route("Login")]
        public EntityResult<LoginResult> Login(string username, string password, string deviceId, int deviceType)
        {
            #region 声明变量

            //错误消息
            string message = string.Empty;

            //非空验证
            string checkEmpty = string.Empty;

            //token
            string token = string.Empty;

            //返回值
            EntityResult<LoginResult> result = new EntityResult<LoginResult>();

            //数据库用户信息
            vw_userdeviceinfo dbUserInfo = new vw_userdeviceinfo();

            //业务类
            vw_userdeviceinfo_BLL bll = new vw_userdeviceinfo_BLL();

            //token业务类
            appdevicerecord_BLL tokenBll = new appdevicerecord_BLL();

            //记录token数据
            appdevicerecord tokenRecord = new appdevicerecord();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(username))
                checkEmpty += "用户名、";
            if (string.IsNullOrEmpty(password))
                checkEmpty += "密码、";
            if (string.IsNullOrEmpty(deviceId))
                checkEmpty += "设备ID、";
            if (!string.IsNullOrEmpty(checkEmpty))
            {
                message = $"非空验证出错,原因[{checkEmpty}]不能为空";
                result = new EntityResult<LoginResult>()
                {
                    Msg = message,
                    Status = -1,
                    Result = null,
                };
                return result;
            }
            #endregion

            #region 数据验证
            dbUserInfo.Username = username;
            dbUserInfo.Password = MD5Hash.Hash.GetMD5(password);
            dbUserInfo.Deviceid = deviceId;
            if (!bll.CheckLogin(ref dbUserInfo, out message))
            {
                if (string.IsNullOrEmpty(message))
                    message = "没有注册请先注册";
                result = new EntityResult<LoginResult>()
                {
                    Status = -1,
                    Msg = $"登陆验证出错，原因[{message}]",
                    Result = null
                };
                return result;
            }
            #endregion

            #region 获取生成的token
            token = JwtHelper.GenerateJsonWebToken(
                new User()
                {
                    UserId = dbUserInfo.Userid.ToString(),
                    UserName = dbUserInfo.Username.ToString(),
                    DeviceId = deviceId
                });
            #endregion

            #region 保存数据
            tokenRecord.userid = dbUserInfo.Userid;
            tokenRecord.deviceid = deviceId;
            tokenRecord.token = token;
            tokenRecord.DeviceType = deviceType;
            tokenRecord.createdatetime = DateTime.Now;
            tokenRecord.modifieddatetime = DateTime.Now;
            if (!tokenBll.SynchronizationData(tokenRecord, out message))
            {
                message = $"同步数据出错,原因[{message}]";
                result = new EntityResult<LoginResult>()
                {
                    Status = -1,
                    Msg = message,
                    Result = null
                };
                return result;
            }
            #endregion

            string host = PublicFunction.GetRequestHost(Request);          
            result = new EntityResult<LoginResult>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = new LoginResult() {
                    userId = dbUserInfo.Userid.ToString(),
                    token = token,
                    UserFace=$"{host}/{dbUserInfo.Userface.ToString()}",
                }
            };
            Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")+JSONHelper.ObjectToJSON(result));
            return result;
        }

        [HttpPost]
        [Route("CheckLogin")]
        public EntityResult<bool> CheckLogin(CheckLoginArgument argument)
        {
            #region 声明变量

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //查询条件
            string SqlWhere = "";

            //返回值
            EntityResult<bool> result = new EntityResult<bool>();

            //业务类
            vw_userdeviceinfo_BLL bll = new vw_userdeviceinfo_BLL();

            //业务设备视图
            List<vw_userdeviceinfo> dbUserInfo = new List<vw_userdeviceinfo>();
            #endregion

            #region 非空验证
            if (argument == null)
            {
                result = new EntityResult<bool>()
                {
                    Status = -1,
                    Msg = "参数不能为空",
                    Result = false
                };
                return result;
            }
            if (string.IsNullOrEmpty(argument.userId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(argument.userName))
                checkMessage += "用户名、";
            if (string.IsNullOrEmpty(argument.token))
                checkMessage += "token、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                result = new EntityResult<bool>()
                {
                    Status = -1,
                    Msg = $"非空验证出错，原因[{checkMessage}]不能为空",
                    Result = false
                };
                return result;
            }
            #endregion

            #region 读取数据
            SqlWhere = $" userid='{argument.userId}' and username='{argument.userName}' and token='{argument.token}' ";
            dbUserInfo = bll.Query(SqlWhere, out message);
            if (dbUserInfo == null || dbUserInfo.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    result = new EntityResult<bool>()
                    {
                        Status = -1,
                        Msg = $"读取用户设备信息出错,原因[{message}]",
                        Result = false
                    };
                    return result;
                }
                else 
                {
                    result = new EntityResult<bool>() 
                    {
                        Status = 0,
                        Msg =string.Empty,
                        Result = false
                    };
                    return result;
                }
            }
            #endregion

            result = new EntityResult<bool>() 
            {
                Status = 0,
                Msg = string.Empty,
                Result = true
            };
            return result;
        }

        /// <summary>
        /// 注册方法
        /// </summary>
        /// <param name="argument">登陆方法参数</param>
        /// <returns>返回值</returns>
        [HttpPut]
        [Route("Register")]
        public Result Register(RegistArgument argument)
        {
            #region 声明变量

            //数据库状态
            int dbState = -1;

            //返回值
            Result result = new Result();

            //错误消息
            string message = string.Empty;

            //参数验证
            string checkMessage = string.Empty;

            //验证码
            string? VerifyCode = string.Empty;

            //用户默认头像
            string? UserFaceDefault = "UserFace/useface01.png";

            //用户名是否存在
            List<userinfo> isHaveUserName = new List<userinfo>();

            //用户业务类
            userinfo_BLL userbll = new userinfo_BLL();

            //雪花ID
            IdWorker sonwId = new IdWorker(1, 1);

            //缓存帮助类
            MemoryCacheHelper cacheHelper = new MemoryCacheHelper();
            #endregion

            #region 参数验证
            if (argument == null)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "参数为空"
                };
                return result;
            }
            if (string.IsNullOrEmpty(argument.userName))
                checkMessage = "用户名、";
            if (string.IsNullOrEmpty(argument.passWord))
                checkMessage = "密码、";
            if (string.IsNullOrEmpty(argument.rePassWord))
                checkMessage = "重复密码、";
            if (string.IsNullOrEmpty(argument.checkCode))
                checkMessage = "验证码、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 验证码校验
            //VerifyCode = cacheHelper.Get("VerifyCode") == null ? string.Empty : (string)cacheHelper.Get("VerifyCode");
            VerifyCode = HttpContext.Session.GetString("VerifyCode");
            if (argument.checkCode != VerifyCode)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"验证码错误"
                };
                return result;
            }
            #endregion

            #region 有效验证
            if (argument.passWord != argument.rePassWord)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "有效验证出错,原因[两次输入的密码不一致]"
                };
                return result;
            }
            if (!string.IsNullOrEmpty(argument.email))
            {
                if (!RegexHelper.CheckEmail(argument.email))
                {
                    result = new Result()
                    {
                        Status = -1,
                        Msg = "有效验证出错,原因[电子邮件地址格式不正确]"
                    };
                    return result;
                }
            }
            #endregion

            #region 验证用户名是否重复
            isHaveUserName = userbll.Query($" username='{argument.userName}' ", out message);
            if (isHaveUserName == null || isHaveUserName.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    result = new Result()
                    {
                        Status = -1,
                        Msg = $"验证用户名是否重复出错,原因[{message}]"
                    };
                    return result;
                }
            }
            else if (isHaveUserName != null && isHaveUserName.Count > 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"用户名[{argument.userName}]已注册"
                };
                return result;
            }
            #endregion

            dbState = userbll.Insert(new userinfo()
            {
                userid = sonwId.NextId(),
                username = argument.userName,
                email = argument.email,
                password = MD5Hash.Hash.GetMD5(argument.passWord),
                wechart = argument.weChart,
                createdatetime = DateTime.Now,
                modifieddatetime = DateTime.Now,
                userface = $"{GetRequestHost(Request)}/{UserFaceDefault}"
            }, out message);
            if (dbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"注册失败,原因[{message}]"
                };
                return result;
            }
            else
            {
                result = new Result()
                {
                    Status = 0,
                    Msg = string.Empty
                };
            }

            return result;
        }

        /// <summary>
        /// 验证码
        /// </summary>
        /// <param name="CodeLength">验证码生成多少个字符</param>
        /// <param name="refreshNum">刷新随机数</param>
        /// <param name="Width">宽度</param>
        /// <param name="Height">高度</param>
        /// <param name="FontSize">字体大小</param>
        /// <returns>验证码图片</returns>
        [HttpGet]
        [Route("VerifyCode")]
        public FileResult VerifyCode(
            int CodeLength,
            string refreshNum,
            int Width,
            int Height,
            int FontSize)
        {
            #region 声明变量

            //验证码
            string code = string.Empty;

            //验证码图片
            byte[] codebytes = null;

            //验证码过期时间
            int VerifyCodeExpirationTime = -1;

            //缓存帮助类
            MemoryCacheHelper cacheHelper = new MemoryCacheHelper();
            #endregion

            #region 读取验证码过期时间
            VerifyCodeExpirationTime = Utils.StrToInt(AppSetting.GetAppSetting("VerifyCodeExpirationTime"), -1);
            if (VerifyCodeExpirationTime == -1)
                VerifyCodeExpirationTime = 30;
            #endregion

            #region 获取验证码图片数据和验证码数据(数据,验证码图片二进制数据)
            (code, codebytes) = ValidateCode.CreateValidateGraphic(
                CodeLength,
                Width,
                Height,
                FontSize);
            #endregion

            Console.WriteLine(code);

            //将验证码存在缓存里并设置过期时间
            //cacheHelper.Set("VerifyCode", code, new TimeSpan(0, 0, VerifyCodeExpirationTime));
            HttpContext.Session.SetString("VerifyCode", code);

            return File(codebytes, "image/png");
        }

        /// <summary>
        /// 获得请求的Host
        /// </summary>
        /// <param name="Request">请求对象</param>
        /// <returns>请求的host地址</returns>
        private string GetRequestHost(HttpRequest Request) 
        {
            string result = string.Empty;
            string httpProtocol = string.Empty;
            if (Request.IsHttps)
                httpProtocol = "https";
            else
                httpProtocol = "http";
            if (Request.Host.Port != null)
                result = $"{httpProtocol}://{Request.Host.Host}:{Request.Host.Port}";
            else
                result = $"{httpProtocol}://{Request.Host}";
            return result;
        }
    }
}
