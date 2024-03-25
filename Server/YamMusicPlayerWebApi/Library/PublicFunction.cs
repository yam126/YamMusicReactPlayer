using DataAccess.BLL;
using DataAccess.Model;
using Org.BouncyCastle.Asn1.Ocsp;
using PublicLibrary;
using System.Text;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Library
{
    /// <summary>
    /// 公共方法
    /// </summary>
    public class PublicFunction
    {
        /// <summary>
        /// 获得请求的Host
        /// </summary>
        /// <param name="Request">请求对象</param>
        /// <returns>请求的host地址</returns>
        public static string GetRequestHost(HttpRequest Request)
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

        /// <summary>
        /// 封面地址转换
        /// </summary>
        /// <param name="cover">原始封面</param>
        /// <returns>转换后的封面</returns>
        public static string ConvertCover(string cover) 
        {
            if (!string.IsNullOrEmpty(cover))
            {
                if (cover.IndexOf("Mp3Cover/") == -1)
                {
                    cover = cover.Replace("Mp3Cover", "Mp3Cover/");
                }
            }
            return cover;
        }

        /// <summary>
        /// 保存上传文件
        /// </summary>
        /// <param name="formFiles">上传文件</param>
        /// <param name="UploadPath">上传路径</param>
        /// <param name="limitFileType">上传文件类型限制</param>
        /// <param name="message">错误消息</param>
        /// <param name="FileName">指定文件名[不带扩展名]</param>
        /// <returns></returns>
        public static async Task<ReturnDataMessage> SaveUploadFile(List<IFormFile> formFiles, string UploadPath, string limitFileType,string FileName="")
        {
            #region 声明变量

            //错误消息
            string message = string.Empty;

            //验证参数消息
            string checkParameterMessage = string.Empty;

            //返回值
            ReturnDataMessage result = new ReturnDataMessage();

            //返回值
            List<ResultFile> resultList = new List<ResultFile>();

            //单个文件类型
            string itemFileContentType = string.Empty;

            //单个文件扩展名
            string itemFileExtension = string.Empty;

            //文件保存本地路径
            string filePath = string.Empty;

            //文件名
            string fileName = string.Empty;

            //所有文件类型
            List<contentTypeModel> contentTypeModels = null;

            //限制文件类型
            List<contentTypeModel> limitContentType = null;

            //错误消息
            List<string> errorMessage = new List<string>();

            //上传成功的文件路径
            List<string> uploadComplateFileName = new List<string>();

            //文件最大容量限制
            long UploadFileMaxLength = 0;

            //文件名构造器
            StringBuilder fileNameBulider = new StringBuilder();
            #endregion

            #region 参数验证
            if (formFiles == null || formFiles.Count <= 0)
                checkParameterMessage += "上传文件不能为空、";
            if (string.IsNullOrEmpty(limitFileType))
                checkParameterMessage += "上传文件类型限制、";
            if (string.IsNullOrEmpty(UploadPath))
                checkParameterMessage += "上传文件路径不能为空请检查配置文件、";
            if (!string.IsNullOrEmpty(checkParameterMessage))
            {
                message = checkParameterMessage.Substring(0, checkParameterMessage.Length - 1);
                result = new ReturnDataMessage()
                {
                    State = -1,
                    Message = message,
                    Data = null
                };
                return result;
            }
            #endregion

            #region 获取文件类型和大小限制
            contentTypeModels = AppSetting.GetContentTypes(out message);
            if (contentTypeModels == null || contentTypeModels.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    message = $"读取文件类型信息失败，原因[{message}]";
                    result = new ReturnDataMessage()
                    {
                        State = -1,
                        Message = message,
                        Data = null
                    };
                    return result;
                }
                else
                {
                    message = $"读取文件类型信息失败，原因[没有文件类型配置信息，请检查是否存在allContentType.xml配置文件]";
                    result = new ReturnDataMessage()
                    {
                        State = -1,
                        Message = message,
                        Data = null
                    };
                    return result;
                }
            }
            if (!contentTypeModels.Any(q => q.contentType.ToLower().Contains(limitFileType.ToLower())))
            {
                message = $"读取限制的文件类型{limitFileType}失败，配置文件[allContentType.xml]没有配置指定的文件类型";
                result = new ReturnDataMessage()
                {
                    State = -1,
                    Message = message,
                    Data = null
                };
                return result;
            }
            limitContentType = contentTypeModels.Where(q => q.contentType.ToLower().Contains(limitFileType.ToLower())).ToList();
            if (string.IsNullOrEmpty(AppSetting.GetAppSetting("UploadFileMaxLength")))
            {
                message = "读取上传文件最大容量限制出错,原因[没有配置最大容量限制，请检查配置文件]";
                result = new ReturnDataMessage()
                {
                    State = -1,
                    Message = message,
                    Data = null
                };
                return result;
            }
            UploadFileMaxLength = Utils.StrToLong(AppSetting.GetAppSetting("UploadFileMaxLength"));
            #endregion

            #region 上传文件类型和大小验证
            foreach (var itemFile in formFiles)
            {
                itemFileContentType = itemFile.ContentType.ToUpper();
                itemFileExtension = "." + Utils.GetFileExt(itemFile.FileName).ToUpper();
                if (!limitContentType.Any(q => q.contentType.ToUpper() == itemFileContentType || q.type.ToUpper() == itemFileExtension))
                    message += $"文件[{itemFile.FileName}]，不是指定的文件类型";
                else if (UploadFileMaxLength != 0 && itemFile.Length > UploadFileMaxLength)
                {
                    message += $"文件[{itemFile.FileName}]，大小超过限制,最大{Utils.ByteConversionGBMBKB(UploadFileMaxLength)}";
                }
            }
            if (!string.IsNullOrEmpty(message))
            {
                result = new ReturnDataMessage()
                {
                    State = -1,
                    Message = message,
                    Data = null
                };
                return result;
            }
            #endregion

            #region 保存文件
            filePath = $@"{CoreHttpContext.MapPath("")}\{UploadPath.Replace("/", "\\")}";
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            foreach (var itemFile in formFiles)
            {
                //文件全路径
                string fileFullPath = string.Empty;

                #region 生成文件名
                if (string.IsNullOrEmpty(FileName))
                {
                    fileNameBulider = new StringBuilder("");
                    fileNameBulider.Append($"{DateTime.Now.ToString("yyyyMMddhhmmss")}_");
                    fileNameBulider.Append($"{new Random().Next(0, 100).ToString("00000")}");
                    fileNameBulider.Append($".{Utils.GetFileExt(itemFile.FileName)}");
                    fileName = fileNameBulider.ToString();
                }
                else 
                {
                    fileName = $"{FileName}.{Utils.GetFileExt(itemFile.FileName)}";
                }
                #endregion

                try
                {
                    #region 保存文件到指定路径
                    fileFullPath = filePath + $"\\{fileName}";
                    using (var stream = new FileStream(fileFullPath, FileMode.Create))
                    {
                        await itemFile.CopyToAsync(stream);
                    }
                    resultList.Add(new ResultFile()
                    {
                        AbsolutePath = fileFullPath,
                        NewFilePath = UploadPath + $"/{fileName}",
                        NewFileName = fileName,
                        SourceFileName = itemFile.FileName,
                    });
                    #endregion
                }
                catch (Exception exp)
                {
                    message += $"{itemFile.FileName}文件上传出错，原因[{exp.Message}]";
                }
            }
            #endregion

            result = new ReturnDataMessage()
            {
                State = 0,
                Message = message,
                Data = resultList
            };
            return result;
        }

        /// <summary>
        /// 更新专辑歌曲数量
        /// </summary>
        /// <returns></returns>
        public static Result UpadteAlbumSongData()
        {
            var result = new Result();
            var albums = new List<albuminfo>();
            string message = string.Empty;
            albums = new albuminfo_BLL().Query(string.Empty, out message);
            if (albums.Count > 0)
            {
                foreach (albuminfo album in albums)
                {
                    var songList = new songinfo_BLL().Query($" albumId='{album.albumId}' ", out message);
                    album.songLength = songList.Count;
                    new albuminfo_BLL().Update(album, $" albumId='{album.albumId}' ", out message);
                }
            }
            return result;
        }

        /// <summary>
        /// 转换Api参数
        /// </summary>
        /// <param name="source">原始参数</param>
        /// <param name="Request">请求对象</param>
        /// <returns>返回值</returns>
        public static songinfoResult ConvertApiResult(songinfo source,HttpRequest Request)
        {
            string cover = PublicFunction.ConvertCover(source.cover);
            var result = new songinfoResult()
            {
                songId = source.songId.GetValueOrDefault().ToString(),
                fileSize = source.fileSize.GetValueOrDefault().ToString(),
                fileType = source.fileType,
                fileName = source.fileName,
                Album = source.Album,
                albumId = source.albumId.GetValueOrDefault().ToString(),
                artist = source.artist,
                comment = source.comment,
                cover = $"{PublicFunction.GetRequestHost(Request)}/{cover}",
                createdatetime = source.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                duration = source.duration.GetValueOrDefault().ToString(),
                modifieddatetime = source.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                modifierId = source.modifierId.GetValueOrDefault().ToString(),
                reserved1 = source.reserved1,
                reserved2 = source.reserved2,
                reserved3 = source.reserved3,
                title = source.title,
                userid = source.userid.GetValueOrDefault().ToString(),
                year = source.year
            };
            return result;
        }

        public static userInfoResult ConvertApi(userinfo args)
        {
            var result = new userInfoResult()
            {
                userid = args.userid.GetValueOrDefault().ToString(),
                userface = args.userface,
                username = args.username,
                email = args.email,
                signature = args.signature,
                wechart = args.wechart,
                createdatetime = args.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss"),
                modifieddatetime = args.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss")
            };
            return result;
        }

        public static albuminfoResult ConvertApi(albuminfo args,HttpRequest Request) 
        {          
            args.albumCover = $"{PublicFunction.GetRequestHost(Request)}/{PublicFunction.ConvertCover(args.albumCover)}";
            var result = new albuminfoResult()
            {
                albumAuthor = args.albumAuthor,
                albumCover = args.albumCover,
                albumId = args.albumId.GetValueOrDefault().ToString(),
                albumIntro = args.albumIntro,
                albumName = args.albumName,
                createdatetime = args.createdatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                modifieddatetime = args.modifieddatetime.GetValueOrDefault().ToString("yyyy-MM-dd hh:mm:ss"),
                modifierId = args.modifierId.GetValueOrDefault().ToString(),
                shareCount = args.shareCount.GetValueOrDefault().ToString(),
                songLength = args.songLength.GetValueOrDefault().ToString(),
                userid = args.userid.GetValueOrDefault().ToString(),
                viewCount = args.viewCount.GetValueOrDefault().ToString()
            };
            return result;
        }
    }
}
