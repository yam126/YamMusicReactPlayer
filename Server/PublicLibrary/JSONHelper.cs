using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PublicLibrary
{
    /// <summary> 
    /// JSON帮助类
    /// </summary> 
    public class JSONHelper
    {
        /// <summary>     
        /// 对象转JSON     
        /// </summary>     
        /// <param name="obj">对象</param>     
        /// <returns>JSON格式的字符串</returns>     
        public static string ObjectToJSON(object obj)
        {
            try
            {
                return JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {
                throw new Exception("JSONHelper.ObjectToJSON(): " + ex.Message);
            }
        }

        /// <summary>     
        /// 数据表转键值对集合       
        /// 把DataTable转成 List集合, 存每一行     
        /// 集合中放的是键值对字典,存每一列    
        /// </summary>     
        /// <param name="dt">数据表</param>     
        /// <returns>哈希表数组</returns>     
        public static List<Dictionary<string, object>> DataTableToList(DataTable dt)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            foreach (DataRow dr in dt.Rows)
            {
                Dictionary<string, object> dic = new Dictionary<string, object>();
                foreach (DataColumn dc in dt.Columns)
                {
                    bool isDbNull = Convert.IsDBNull(dr[dc.ColumnName]);
                    if (!isDbNull)
                        dic.Add(dc.ColumnName, dr[dc.ColumnName]);
                    else
                        dic.Add(dc.ColumnName, "null");
                }
                list.Add(dic);
            }
            return list;
        }

        /// <summary>     
        /// 数据集转键值对数组字典     
        /// </summary>     
        /// <param name="dataSet">数据集</param>     
        /// <returns>键值对数组字典</returns>
        public static Dictionary<string, List<Dictionary<string, object>>> DataSetToDic(DataSet ds)
        {
            Dictionary<string, List<Dictionary<string, object>>> result = null;
            result = new Dictionary<string, List<Dictionary<string, object>>>();
            foreach (DataTable dt in ds.Tables)
                result.Add(dt.TableName, DataTableToList(dt));
            return result;
        }

        /// <summary>     
        /// 数据表转JSON    
        /// </summary>     
        /// <param name="dataTable">数据表</param>     
        /// <returns>JSON字符串</returns>     
        public static string DataTableToJSON(DataTable dt)
        {
            return ObjectToJSON(DataTableToList(dt));
        }

        /// <summary>
        /// JSON数组转List结构
        /// </summary>
        /// <typeparam name="T">结构类名</typeparam>
        /// <param name="JsonString">Json数组字符串</param>
        /// <param name="message">错误消息</param>
        /// <returns>转换后的List</returns>
        public static List<T> JSONToList<T>(string JsonString, out string message)
        {
            List<T> objs = null;
            message = string.Empty;
            try
            {
                int IndexofA = JsonString.IndexOf("[");
                int IndexofB = JsonString.IndexOf("]");
                string Ru = JsonString.Substring(IndexofA, IndexofB - IndexofA + 1);
                objs = JsonConvert.DeserializeObject<List<T>>(Ru);
            }
            catch (Exception exp)
            {
                message = exp.Message;
            }
            return objs;
        }


        /// <summary>
        /// List转Json
        /// </summary>
        /// <typeparam name="T">List类型</typeparam>
        /// <param name="vList">传入的Json</param>
        /// <param name="newLineSymbol">换行符(可以传空字符串或null不换行)</param>
        /// <param name="message">错误消息</param>
        /// <returns>返回的Json</returns>
        public static string ListToJSON<T>(List<T> vList, string newLineSymbol, out string message)
        {
            string result = string.Empty;
            string JsonString = string.Empty;
            message = string.Empty;
            newLineSymbol = string.IsNullOrEmpty(newLineSymbol) ? string.Empty : newLineSymbol;
            if (vList == null || vList.Count <= 0)
                return result;
            for (int i = 0; i < vList.Count; i++)
            {
                try
                {
                    if (i == vList.Count - 1)
                        JsonString += JsonConvert.SerializeObject(vList[i]) + newLineSymbol;
                    else
                        JsonString += JsonConvert.SerializeObject(vList[i]) + "," + newLineSymbol;
                }
                catch (Exception exp)
                {
                    message += exp.Message;
                }
            }
            if (!string.IsNullOrEmpty(JsonString))
                result = "[" + JsonString + "]";
            return result;
        }

        /// <summary>     
        /// JSON文本转对象,泛型方法     
        /// </summary>     
        /// <typeparam name="T">类型</typeparam>     
        /// <param name="jsonText">JSON文本</param>     
        /// <returns>指定类型的对象</returns>     
        public static T JSONToObject<T>(string jsonText)
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(jsonText);
            }
            catch (Exception ex)
            {
                throw new Exception("JSONHelper.JSONToObject(): " + ex.Message);
            }
        }

        /// <summary>     
        /// 将JSON文本转换为数据表数据     
        /// </summary>    
        /// <param name="jsonText">JSON文本</param>     
        /// <returns>数据表字典</returns>     
        public static Dictionary<string, List<Dictionary<string, object>>> TablesDataFromJSON(string jsonText)
        {
            return JSONToObject<Dictionary<string, List<Dictionary<string, object>>>>(jsonText);
        }

        /// <summary>     
        /// 将JSON文本转换成数据行     
        /// </summary>     
        /// <param name="jsonText">JSON文本</param>    
        /// <returns>数据行的字典</returns>     
        public static Dictionary<string, object> DataRowFromJSON(string jsonText)
        {
            return JSONToObject<Dictionary<string, object>>(jsonText);
        }

        #region 私有方法
        /// <summary>
        /// 过滤特殊字符
        /// </summary>
        private static string String2Json(String s)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < s.Length; i++)
            {
                char c = s.ToCharArray()[i];
                switch (c)
                {
                    case '\"':
                        sb.Append("\\\""); break;
                    case '\\':
                        sb.Append("\\\\"); break;
                    case '/':
                        sb.Append("\\/"); break;
                    case '\b':
                        sb.Append("\\b"); break;
                    case '\f':
                        sb.Append("\\f"); break;
                    case '\n':
                        sb.Append("\\n"); break;
                    case '\r':
                        sb.Append("\\r"); break;
                    case '\t':
                        sb.Append("\\t"); break;
                    default:
                        sb.Append(c); break;
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// 格式化字符型、日期型、布尔型
        /// </summary>
        private static string StringFormat(string str, Type type)
        {
            if (type == typeof(string))
            {
                str = String2Json(str);
                str = "\"" + str + "\"";
            }
            else if (type == typeof(DateTime))
            {
                str = "\"" + str + "\"";
            }
            else if (type == typeof(bool))
            {
                str = str.ToLower();
            }
            else if (type != typeof(string) && string.IsNullOrEmpty(str))
            {
                str = "\"" + str + "\"";
            }
            return str;
        }
        #endregion

        #region List转换成Json
        /// <summary>
        /// List转换成Json
        /// </summary>
        public static string ListToJson<T>(IList<T> list)
        {
            object obj = null;
            if (list == null || list.Count <= 0)
                return null;
            obj = list[0];
            return ListToJson<T>(list, obj.GetType().Name);
        }

        /// <summary>
        /// List转换成Json 
        /// </summary>
        public static string ListToJson<T>(IList<T> list, string jsonName)
        {
            StringBuilder Json = new StringBuilder();
            if (string.IsNullOrEmpty(jsonName)) jsonName = list[0].GetType().Name;
            //Json.Append("{\"" + jsonName + "\":[");
            Json.Append("[");
            if (list.Count > 0)
            {
                for (int i = 0; i < list.Count; i++)
                {
                    T obj = Activator.CreateInstance<T>();
                    PropertyInfo[] pi = obj.GetType().GetProperties();
                    Json.Append("{");
                    for (int j = 0; j < pi.Length; j++)
                    {
                        if (pi[j].GetValue(list[i], null) != null)
                        {
                            Type type = pi[j].GetValue(list[i], null).GetType();
                            Json.Append("\"" + pi[j].Name.ToString() + "\":" + StringFormat(pi[j].GetValue(list[i], null).ToString(), type));
                        }
                        else
                        {
                            Json.Append("\"" + pi[j].Name.ToString() + "\":\"\"");
                        }

                        if (j < pi.Length - 1)
                        {
                            Json.Append(",");
                        }
                    }
                    Json.Append("}");
                    if (i < list.Count - 1)
                    {
                        Json.Append(",");
                    }
                }
            }
            //Json.Append("]}");
            Json.Append("]");
            return Json.ToString();
        }
        #endregion

        #region 对象转换为Json
        /// <summary> 
        /// 对象转换为Json 
        /// </summary> 
        /// <param name="jsonObject">对象</param> 
        /// <returns>Json字符串</returns> 
        public static string ToJson(object jsonObject)
        {
            string jsonString = "{";
            PropertyInfo[] propertyInfo = jsonObject.GetType().GetProperties();
            for (int i = 0; i < propertyInfo.Length; i++)
            {
                object objectValue = propertyInfo[i].GetGetMethod().Invoke(jsonObject, null);
                string value = string.Empty;
                if (objectValue is DateTime || objectValue is Guid || objectValue is TimeSpan)
                {
                    value = "'" + objectValue.ToString() + "'";
                }
                else if (objectValue is string)
                {
                    value = "'" + ToJson(objectValue.ToString()) + "'";
                }
                else if (objectValue is IEnumerable)
                {
                    value = ToJson((IEnumerable)objectValue);
                }
                else
                {
                    value = ToJson(objectValue.ToString());
                }
                jsonString += "\"" + ToJson(propertyInfo[i].Name) + "\":" + value + ",";
            }
            if (!string.IsNullOrEmpty(jsonString) && jsonString.Length - 1 < jsonString.Length)
                jsonString.Remove(jsonString.Length - 1, jsonString.Length);
            return jsonString + "}";
        }
        #endregion

        #region 对象集合转换Json
        /// <summary> 
        /// 对象集合转换Json 
        /// </summary> 
        /// <param name="array">集合对象</param> 
        /// <returns>Json字符串</returns> 
        public static string ToJson(IEnumerable array)
        {
            string jsonString = "[";
            foreach (object item in array)
            {
                jsonString += ToJson(item) + ",";
            }
            if (!string.IsNullOrEmpty(jsonString) && jsonString.Length - 1 < jsonString.Length)
                jsonString.Remove(jsonString.Length - 1, jsonString.Length);
            return jsonString + "]";
        }
        #endregion

        #region 普通集合转换Json
        /// <summary> 
        /// 普通集合转换Json 
        /// </summary> 
        /// <param name="array">集合对象</param> 
        /// <returns>Json字符串</returns> 
        public static string ToArrayString(IEnumerable array)
        {
            string jsonString = "[";
            foreach (object item in array)
            {
                jsonString = ToJson(item.ToString()) + ",";
            }
            jsonString.Remove(jsonString.Length - 1, jsonString.Length);
            return jsonString + "]";
        }
        #endregion

        #region  DataSet转换为Json
        /// <summary> 
        /// DataSet转换为Json 
        /// </summary> 
        /// <param name="dataSet">DataSet对象</param> 
        /// <returns>Json字符串</returns> 
        public static string ToJson(DataSet dataSet)
        {
            string jsonString = "{";
            foreach (DataTable table in dataSet.Tables)
            {
                jsonString += "\"" + table.TableName + "\":" + ToJson(table) + ",";
            }
            jsonString = jsonString.TrimEnd(',');
            return jsonString + "}";
        }
        #endregion

        #region Datatable转换为Json
        /// <summary> 
        /// Datatable转换为Json 
        /// </summary> 
        /// <param name="table">Datatable对象</param> 
        /// <returns>Json字符串</returns> 
        public static string ToJson(DataTable dt)
        {
            StringBuilder jsonString = new StringBuilder();
            jsonString.Append("[");
            DataRowCollection drc = dt.Rows;
            for (int i = 0; i < drc.Count; i++)
            {
                jsonString.Append("{");
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    string strKey = dt.Columns[j].ColumnName;
                    string strValue = drc[i][j].ToString();
                    Type type = dt.Columns[j].DataType;
                    jsonString.Append("\"" + strKey + "\":");
                    strValue = StringFormat(strValue, type);
                    if (j < dt.Columns.Count - 1)
                    {
                        jsonString.Append(strValue + ",");
                    }
                    else
                    {
                        jsonString.Append(strValue);
                    }
                }
                jsonString.Append("},");
            }
            //zhanghao 2012 01 14 原因：会将匹配的 ‘[’ 删除
            if (drc.Count > 0)
            {
                jsonString.Remove(jsonString.Length - 1, 1);
            }


            jsonString.Append("]");
            return jsonString.ToString();
        }

        /// <summary>
        /// DataTable转换为Json 
        /// </summary>
        public static string ToJson(DataTable dt, string jsonName)
        {
            StringBuilder Json = new StringBuilder();
            if (string.IsNullOrEmpty(jsonName)) jsonName = dt.TableName;
            Json.Append("{\"" + jsonName + "\":[");
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Json.Append("{");
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        Type type = dt.Rows[i][j].GetType();
                        Json.Append("\"" + dt.Columns[j].ColumnName.ToString() + "\":" + StringFormat(dt.Rows[i][j].ToString(), type));
                        if (j < dt.Columns.Count - 1)
                        {
                            Json.Append(",");
                        }
                    }
                    Json.Append("}");
                    if (i < dt.Rows.Count - 1)
                    {
                        Json.Append(",");
                    }
                }
            }
            Json.Append("]}");
            return Json.ToString();
        }
        #endregion

        #region DataReader转换为Json
        /// <summary> 
        /// DataReader转换为Json 
        /// </summary> 
        /// <param name="dataReader">DataReader对象</param> 
        /// <returns>Json字符串</returns> 
        public static string ToJson(DbDataReader dataReader)
        {
            StringBuilder jsonString = new StringBuilder();
            jsonString.Append("[");
            while (dataReader.Read())
            {
                jsonString.Append("{");
                for (int i = 0; i < dataReader.FieldCount; i++)
                {
                    Type type = dataReader.GetFieldType(i);
                    string strKey = dataReader.GetName(i);
                    string strValue = dataReader[i].ToString();
                    jsonString.Append("\"" + strKey + "\":");
                    strValue = StringFormat(strValue, type);
                    if (i < dataReader.FieldCount - 1)
                    {
                        jsonString.Append(strValue + ",");
                    }
                    else
                    {
                        jsonString.Append(strValue);
                    }
                }
                jsonString.Append("},");
            }
            dataReader.Close();
            jsonString.Remove(jsonString.Length - 1, 1);
            jsonString.Append("]");
            return jsonString.ToString();
        }
        #endregion

        #region Json转换为DataSet

        /// <summary>
        /// Json转换为DataSet
        /// </summary>
        /// <param name="json">Json字符串</param>
        /// <returns>DataSet集合</returns>
        public static DataSet JsonToDataSet(string json)
        {
            DataSet ds = new DataSet();
            ArrayList dic = JsonConvert.DeserializeObject<ArrayList>(json);
            DataTable dtb;

            if (dic.Count > 0)
            {
                foreach (Dictionary<string, object> drow in dic)
                {
                    dtb = new DataTable();
                    if (dtb.Columns.Count == 0)
                    {
                        foreach (string key in drow.Keys)
                        {
                            dtb.Columns.Add(key, drow[key].GetType());
                        }
                    }

                    DataRow row = dtb.NewRow();
                    foreach (string key in drow.Keys)
                    {

                        row[key] = drow[key];
                    }
                    dtb.Rows.Add(row);
                    ds.Tables.Add(dtb);
                }

            }
            return ds;
        }

        #endregion

        /// <summary>
        /// Json转换为DataSet(两张表的)
        /// </summary>
        /// <param name="json">Json字符串</param>
        /// <returns>DataSet集合</returns>
        public static DataSet JsonToDataSetL(string json)
        {
            DataSet ds = new DataSet();
            //System.Web.Script.Serialization.JavaScriptSerializer jss = new System.Web.Script.Serialization.JavaScriptSerializer();
            ArrayList dic = JsonConvert.DeserializeObject<ArrayList>(json);
            DataTable dtb = new DataTable();
            DataTable tableInfo = new DataTable(); ;

            if (dic.Count > 0)
            {

                foreach (Dictionary<string, object> drow in dic)
                {
                    if (dic.IndexOf(drow) == 0)
                    {
                        if (dtb.Columns.Count == 0)
                        {
                            foreach (string key in drow.Keys)
                            {
                                dtb.Columns.Add(key, drow[key].GetType());
                            }
                        }
                        DataRow row = dtb.NewRow();
                        foreach (string key in drow.Keys)
                        {

                            row[key] = drow[key];
                        }
                        dtb.Rows.Add(row);
                        ds.Tables.Add(dtb);
                    }
                    else
                    {

                        if (tableInfo.Columns.Count == 0)
                        {
                            foreach (string key in drow.Keys)
                            {
                                tableInfo.Columns.Add(key, drow[key].GetType());
                            }
                        }

                        DataRow row = tableInfo.NewRow();
                        foreach (string key in drow.Keys)
                        {

                            row[key] = drow[key];
                        }
                        tableInfo.Rows.Add(row);
                    }
                }
            }
            ds.Tables.Add(tableInfo);
            return ds;
        }

        #region 实体对象转换为DataTable
        /// <summary>
        /// 实体对象转换为DataTable
        /// </summary>
        /// <param name="obj">实体对象</param>
        /// <returns>DataTable</returns>
        public static DataTable ObjToDataTable(object obj)
        {
            DataTable dt = new DataTable();
            PropertyInfo[] pi = obj.GetType().GetProperties();
            for (int i = 0; i < pi.Length; i++)
            {
                dt.Columns.Add(new DataColumn(pi[i].Name, pi[i].PropertyType));
            }
            dt.Rows.Add(dt.NewRow());
            for (int i = 0; i < pi.Length; i++)
            {
                dt.Rows[0][i] = obj.GetType().InvokeMember(dt.Columns[i].ColumnName, BindingFlags.GetProperty, null, obj, new object[] { });
            }
            return dt;
        }
        #endregion

        #region DataTable转换为实体对象
        /// <summary>
        /// DataTable转换为实体对象
        /// </summary>
        /// <typeparam name="T">实体类型</typeparam>
        /// <param name="dt">要转换的DataTable</param>
        /// <returns>转换后的实体对象</returns>
        public static T ConvertToEntity<T>(DataTable dt) where T : new()
        {
            System.Data.DataColumnCollection columns = dt.Columns;
            DataRow row = dt.Rows[0];
            int iColumnCount = columns.Count;
            int i;
            int j;
            T t = new T();
            Type elementType;
            elementType = t.GetType();
            System.Reflection.PropertyInfo[] publicProperties = elementType.GetProperties();
            for (i = 0; i < iColumnCount; i++)
            {
                for (j = 0; j < publicProperties.Length; j++)
                {
                    if (columns[i].ColumnName.ToLower() == publicProperties[j].Name.ToLower())
                    {
                        if (publicProperties[j].PropertyType == typeof(int))
                        {
                            int num = 0;
                            try
                            {
                                num = Convert.ToInt32(row[i]);
                            }
                            catch
                            {
                            }
                            publicProperties[j].SetValue(t, num, null);
                        }
                        else
                        {
                            if (publicProperties[j].PropertyType == typeof(string) && row[i] == System.DBNull.Value)
                            {
                                publicProperties[j].SetValue(t, "", null);
                            }
                            else
                            {
                                object value = row[i] == System.DBNull.Value ? null : row[i];
                                publicProperties[j].SetValue(t, value, null);
                            }
                        }
                    }
                }
            }
            return t;
        }

        #endregion
    }
}
