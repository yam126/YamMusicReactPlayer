namespace YamMusicPlayerWebApi.Model
{
    /// <summary>
    /// 普通添加修改返回值
    /// </summary>
    public class Result
    {
        /// <summary>
        /// 状态（0正确，非0错误）
        /// </summary>
        public Int32 Status { get; set; }

        /// <summary>
        /// 错误提示信息
        /// </summary>
        public String Msg { get; set; }
    }

    /// <summary>
    /// 返回带数据的返回值
    /// </summary>
    [Serializable]
    public class ReturnDataMessage
    {
        /// <summary>
        /// 状态
        /// </summary>
        public int State { get; set; }

        /// <summary>
        /// 消息
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// 返回数据
        /// </summary>
        public object Data { get; set; }
    }

    /// <summary>
    /// 返回文件结果
    /// </summary>
    public class ResultFile
    {
        /// <summary>
        /// 原始文件名
        /// </summary>
        public string SourceFileName { get; set; }

        /// <summary>
        /// 新文件名
        /// </summary>
        public string NewFileName { get; set; }

        /// <summary>
        /// 新文件路径
        /// </summary>
        public string NewFilePath { get; set; }

        /// <summary>
        /// 绝对路径
        /// </summary>
        public string AbsolutePath { get; set; }
    }

    /// <summary>
    /// 带数据返回
    /// </summary>
    /// <typeparam name="T">返回数据类型</typeparam>
    public class EntityResult<T>
    {
        /// <summary>
        /// 状态（0正确，非0错误）
        /// </summary>
        public Int32 Status { get; set; }

        /// <summary>
        /// 错误提示信息
        /// </summary>
        public String Msg { get; set; }

        /// <summary>
        /// 返回数据
        /// </summary>
        public T? Result { get; set; }
    }

    /// <summary>
    /// 返回数组
    /// </summary>
    /// <typeparam name="T">要返回的数组类型</typeparam>
    public class ArrayResult<T>
    {
        /// <summary>
        /// 状态（0正确，非0错误）
        /// </summary>
        public Int32 Status { get; set; }

        /// <summary>
        /// 错误提示信息
        /// </summary>
        public String Msg { get; set; }

        /// <summary>
        /// 返回的数组
        /// </summary>
        public T[] Result { get; set; }
    }

    /// <summary>
    /// List返回值
    /// </summary>
    /// <typeparam name="T">返回的数据类型</typeparam>
    public class ListResult<T>
    {
        /// <summary>
        /// 状态（0正确，非0错误）
        /// </summary>
        public Int32 Status { get; set; }

        /// <summary>
        /// 错误提示信息
        /// </summary>
        public String Msg { get; set; }


        /// <summary>
        /// 返回的List
        /// </summary>
        public IList<T> Result { get; set; } = new List<T>();
    }

    /// <summary>
    /// 分页返回值
    /// </summary>
    /// <typeparam name="T">返回的数据类型</typeparam>
    public class PageResult<T>
    {
        /// <summary>
        /// 状态（0正确，非0错误）
        /// </summary>
        public Int32 Status { get; set; }

        /// <summary>
        /// 错误提示信息
        /// </summary>
        public String Msg { get; set; }

        /// <summary>
        /// 总页数
        /// </summary>
        public Int32 PageCount { get; set; } = 0;

        /// <summary>
        /// 总记录数
        /// </summary>
        public Int32 RecordCount { get; set; } = 0;

        /// <summary>
        /// 分页的每页数据
        /// </summary>
        public IList<T> Result { get; set; } = new List<T>();
    }

    /// <summary>
    /// 分页返回值
    /// </summary>
    /// <typeparam name="T">返回数据类型</typeparam>
    public class PageResultNew<T>
    {
        /// <summary>
        /// 状态（0正确，非0错误）
        /// </summary>
        public Int32 Status { get; set; }

        /// <summary>
        /// 错误提示信息
        /// </summary>
        public String Msg { get; set; }

        /// <summary>
        /// 总页数
        /// </summary>
        public Int32 PageCount { get; set; } = 0;

        /// <summary>
        /// 总记录数
        /// </summary>
        public Int32 RecordCount { get; set; } = 0;

        /// <summary>
        /// 分页的每页数据
        /// </summary>
        public T Result { get; set; }
    }
}
