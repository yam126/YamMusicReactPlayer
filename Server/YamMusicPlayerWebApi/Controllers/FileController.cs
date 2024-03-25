using Microsoft.AspNetCore.Mvc;
using PublicLibrary;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;
using System.IO;

namespace YamMusicPlayerWebApi.Controllers
{
    /// <summary>
    /// 文件接口
    /// </summary>
    [ApiController]
    [Route("api/File")]
    public class FileController : Controller
    {
        /// <summary>
        /// 获取所有用户头像
        /// </summary>
        /// <returns>头像URL地址</returns>
        [HttpGet]
        [Route("UserFace")]
        public EntityResult<List<string>> GetUserFaces() 
        {
            #region 声明变量

            //错误消息
            string message=string.Empty;

            //用户头像系统文件路径
            string userFaceSysPath=string.Empty;

            //用户头像绝对路径
            string userFaceAbsolutePath = string.Empty;

            //用户头像地址
            string[] facePath = null;

            //网站根目录
            string wwwRootPath = CoreHttpContext.MapPath("");

            //返回值
            var result=new EntityResult<List<string>>();
            #endregion

            #region 获取用户头像配置路径
            userFaceSysPath = AppSetting.GetAppSetting("SystemUserFacePath");
            if(string.IsNullOrEmpty(userFaceSysPath)) 
            {
                result = new EntityResult<List<string>>() 
                {
                    Status=-1,
                    Msg= "没有在[appsettings.json]配置用户头像路径配置项[SystemUserFacePath]请检查网站配置文件"
                };
                return result;
            }
            #endregion

            #region 获取用户头像文件
            userFaceAbsolutePath = $@"{wwwRootPath}\{userFaceSysPath}";
            if (!Directory.Exists(userFaceAbsolutePath)) 
            {
                result = new EntityResult<List<string>>() 
                {
                    Status=-1,
                    Msg="用户头像物理路径不存在"
                };
                return result;
            }
            facePath = Directory.GetFiles(userFaceAbsolutePath);
            if (facePath == null || facePath.Length <= 0) 
            {
                result = new EntityResult<List<string>>()
                {
                    Status = 0,
                    Msg = string.Empty,
                    Result=new List<string>()
                };
                return result;
            }
            #endregion

            #region 转换为Url地址
            for(var i= 0; i < facePath.Length; i++) 
            {
                var faceFileInfo=new FileInfo(facePath[i]);
                facePath[i] = $"{PublicFunction.GetRequestHost(Request)}/{userFaceSysPath}/{faceFileInfo.Name}";
            }
            #endregion

            result = new EntityResult<List<string>>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = facePath.ToList()
            };
            return result; 
        }
    }
}
