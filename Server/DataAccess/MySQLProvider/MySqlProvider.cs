using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.MySQLProvider
{
    public class MySqlProvider
    {
        private string _sqlConnectionString;

        public MySqlProvider()
        {
            _sqlConnectionString = MySqlConnectionHelper.GetConnectionString("LocalMySql", true);
            if (_sqlConnectionString == null || _sqlConnectionString.Length < 1)
            {
                throw new Exception("Connection_String_Not_Found");
            }
        }

        public MySqlProvider(string ConnectionDBName)
        {
            _sqlConnectionString = MySqlConnectionHelper.GetConnectionString(ConnectionDBName, true);
            if (_sqlConnectionString == null || _sqlConnectionString.Length < 1)
            {
                throw new Exception("Connection_String_Not_Found");
            }
        }


        public MySqlParameter CreateInputParam(string paramName, MySqlDbType dbType, object objValue, int size)
        {
            MySqlParameter parameter;
            if (size > 0)
                parameter = new MySqlParameter(paramName, dbType, size);
            else
                parameter = new MySqlParameter(paramName, dbType);

            if (objValue == null)
            {
                parameter.IsNullable = true;
                parameter.Value = DBNull.Value;
                return parameter;
            }
            if (objValue is string)
            {
                if (string.IsNullOrEmpty(Convert.ToString(objValue)))
                {
                    parameter.IsNullable = true;
                    parameter.Value = DBNull.Value;
                    return parameter;
                }
            }
            parameter.Value = objValue;
            parameter.Direction = ParameterDirection.Input;
            return parameter;
        }

        private string GetNullableString(MySqlDataReader reader, int col)
        {
            if (!reader.IsDBNull(col))
            {
                return reader.GetString(col);
            }
            return null;
        }

        private int GetNullableInt(MySqlDataReader reader, int col)
        {
            if (!reader.IsDBNull(col))
            {
                return reader.GetInt32(col);
            }
            return -1;
        }

        private DateTime GetNullableDateTime(MySqlDataReader reader, int col)
        {
            if (!reader.IsDBNull(col))
            {
                return reader.GetDateTime(col);
            }
            return Convert.ToDateTime("0000-01-01 00:00:00");
        }

        public int CreateData(string sqlStrs, out string message)
        {
            message = "";
            int status = 0;
            try
            {
                MySqlConnectionHolder connection = new MySqlConnectionHolder(this._sqlConnectionString);
                try
                {
                    MySqlCommand command = new MySqlCommand(sqlStrs, connection.Connection);
                    int rows = command.ExecuteNonQuery();
                    if (rows != 1)
                    {
                        message = "1:创建失败!";
                        status = 1;
                    }
                    return status;
                }
                catch (Exception ex)
                {
                    status = 2;
                    message = "2:数据录入失败！";
                    return 2;
                }
                finally
                {
                    if (connection != null)
                    {
                        connection.Close();
                        connection = null;
                    }
                }
            }
            catch (Exception ex)
            {
                status = 3;
                message = "3:打开数据库链接失败！";
                return 3;
            }
        }


        public int CreateTransDate(ArrayList sqlStrs, out string message)
        {
            message = "";
            int status = 0;
            try
            {
                MySqlConnectionHolder connection = new MySqlConnectionHolder(this._sqlConnectionString);
                MySqlTransaction myTrans = connection.Connection.BeginTransaction();
                try
                {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection.Connection;
                    command.Transaction = myTrans;

                    for (int i = 0; i < sqlStrs.Count; i++)
                    {
                        command.CommandText = sqlStrs[i].ToString();
                        int rows = command.ExecuteNonQuery();

                        if (rows > 1)
                        {
                            myTrans.Rollback();
                            message = "106:数据库事务处理出错!";
                            return 106;
                        }
                    }

                    myTrans.Commit();
                    command.Dispose();
                    return status;
                }
                catch (Exception ex)
                {
                    myTrans.Rollback();
                    message = "107:数据库事务处理异常!" + ex.Message;
                    return 107;
                }
                finally
                {
                    if (connection != null)
                    {
                        connection.Close();
                        connection = null;
                    }
                }
            }
            catch (Exception ex)
            {
                message = "108:与数据库连接错误!" + ex.Message;
                return 108;
            }
        }

        /// <summary>
        /// 创建或修改表数据:对于单条记录
        /// </summary>
        /// <param name="sqlStr">表名或存储过程</param>
        /// <param name="parameters">Parameter 数组</param>
        /// <param name="message">返回文本</param>
        /// <returns>0：成功 !0失败</returns>
        public int ExecuteNonQuery(string commandText, CommandType commandType, MySqlParameter[] parameters, out string message)
        {
            MySqlConnectionHolder connection = null;
            try
            {
                connection = new MySqlConnectionHolder(this._sqlConnectionString);
                MySqlCommand command = null;
                try
                {
                    command = new MySqlCommand();
                    command.Connection = connection.Connection;
                    command.CommandText = commandText;
                    command.CommandType = commandType;
                    if (parameters != null) AddParameter(command, parameters);

                    try
                    {
                        int rowCount = command.ExecuteNonQuery();
                        if (rowCount > 1)
                        {
                            message = "数据库操作错误!";
                            return 903;
                        }
                        else
                        {
                            message = ""; return 0;
                        }
                    }
                    catch (Exception ex)
                    {
                        message = ex.Message;
                        return 902;
                    }
                }
                finally
                {
                    command.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                message = "连接失败!" + ex.Message;
                return 901;
            }
            finally
            {
                if (connection != null)
                {
                    connection.Close();
                    connection = null;
                }
            }
        }

        public int UpdateData(string sqlStrs, out string message)
        {
            message = "";
            int status = 0;
            try
            {
                MySqlConnectionHolder connection = new MySqlConnectionHolder(this._sqlConnectionString);
                MySqlTransaction myTrans = connection.Connection.BeginTransaction();
                try
                {
                    MySqlCommand command = new MySqlCommand(sqlStrs, connection.Connection);
                    command.Transaction = myTrans;
                    int rows = command.ExecuteNonQuery();
                    //if (rows == 0)
                    //{
                    //    message = "1:未找到相关数据!";
                    //    return 1;
                    //}
                    //if (rows > 1)
                    //{
                    //    message = "2:有多条相关数据!";
                    //    return 2;
                    //}
                    myTrans.Commit();
                    command.Dispose();
                    return status;
                }
                catch (Exception ex)
                {
                    myTrans.Rollback();
                    message = "3:创建信息异常!" + ex.Message;
                    return 3;
                }
                finally
                {
                    if (connection != null)
                    {
                        connection.Close();
                        connection = null;
                    }
                }
            }
            catch (Exception ex)
            {
                message = "4:与WMS连接错误!" + ex.Message;
                return 4;
            }
        }

        public int UpdateDataOrder(string sqlStrs, out string message)
        {
            message = "";
            int status = 0;
            try
            {
                MySqlConnectionHolder connection = new MySqlConnectionHolder(this._sqlConnectionString);
                MySqlTransaction myTrans = connection.Connection.BeginTransaction();
                try
                {
                    MySqlCommand command = new MySqlCommand(sqlStrs, connection.Connection);
                    command.Transaction = myTrans;
                    int rows = command.ExecuteNonQuery();

                    myTrans.Commit();
                    command.Dispose();
                    return status;
                }
                catch (Exception ex)
                {
                    myTrans.Rollback();
                    message = "3:创建信息异常!" + ex.Message;
                    return 3;
                }
                finally
                {
                    if (connection != null)
                    {
                        connection.Close();
                        connection = null;
                    }
                }
            }
            catch (Exception ex)
            {
                message = "与数据库连接错误!" + ex.Message;
                return 4;
            }
        }

        /// <summary>修改数据
        /// 修改数据
        /// </summary>
        /// <param name="sqlStrs">SQL 语句</param>
        /// <param name="message">返回结果文本</param>
        /// <returns>0.成功；非0.失败</returns>
        public int UpdateTransData(ArrayList sqlStrs, out string message)
        {
            message = "";
            int status = 0;
            try
            {
                MySqlConnectionHolder connection = new MySqlConnectionHolder(this._sqlConnectionString);
                MySqlTransaction myTrans = connection.Connection.BeginTransaction();
                try
                {
                    MySqlCommand command = new MySqlCommand();
                    command.Connection = connection.Connection;
                    command.Transaction = myTrans;

                    for (int i = 0; i < sqlStrs.Count; i++)
                    {
                        command.CommandText = sqlStrs[i].ToString();
                        int rows = command.ExecuteNonQuery();

                        //if (rows != 1)
                        //{
                        //    myTrans.Rollback();
                        //    message = "206:数据库事务处理出错!";
                        //    return 206;
                        //}
                    }
                    myTrans.Commit();
                    command.Dispose();
                    return status;
                }
                catch (Exception ex)
                {
                    myTrans.Rollback();
                    message = "207:数据库事务处理异常!" + ex.Message;
                    return 207;
                }
                finally
                {
                    if (connection != null)
                    {
                        connection.Close();
                        connection = null;
                        myTrans.Dispose();
                        myTrans = null;
                    }
                }
            }
            catch (Exception ex)
            {
                message = "208:与数据库连接错误!" + ex.Message;
                return 208;
            }
        }

        public DataRow GetDataByKey(string sqlStrs, out string message)
        {
            message = "";
            try
            {
                MySqlConnectionHolder connection = new MySqlConnectionHolder(this._sqlConnectionString);
                try
                {
                    MySqlDataAdapter oraDap = new MySqlDataAdapter(sqlStrs, connection.Connection);
                    DataSet ds = new DataSet();

                    try
                    {
                        oraDap.Fill(ds);
                        DataTable dt = ds.Tables[0];
                        if (dt == null || dt.Rows.Count == 0)
                        {
                            message = "1:没有相关数据!";
                            return null;
                        }

                        if (dt.Rows.Count > 1)
                        {
                            message = "2:有重复数据!";
                            return dt.Rows[0];
                        }

                        return dt.Rows[0];
                    }
                    catch (Exception ex)
                    {
                        message = "3:读取数据失败!" + ex.Message;
                        return null;
                    }
                    finally
                    {
                        oraDap.Dispose();
                        ds.Dispose();
                    }
                }
                catch (Exception ex)
                {
                    message = "4:查询异常!" + ex.Message;
                    return null;
                }
                finally
                {
                    if (connection != null)
                    {
                        connection.Close();
                        connection = null;
                    }
                }
            }
            catch (Exception ex)
            {
                message = "5:与WMS连接错误!" + ex.Message;
                return null;
            }
        }

        public DataTable GetDataTable(string sqlStrs, out string message)
        {
            message = "";
            try
            {
                MySqlConnectionHolder connection = new MySqlConnectionHolder(this._sqlConnectionString);
                try
                {
                    MySqlDataAdapter oraDap = new MySqlDataAdapter(sqlStrs, connection.Connection);
                    DataSet ds = new DataSet();

                    try
                    {
                        oraDap.Fill(ds);
                        DataTable dt = ds.Tables[0];
                        if (dt == null)
                        {
                            message = "1:没有相关数据!";
                            return null;
                        }

                        if (dt.Rows.Count < 0)
                        {
                            message = "2:没有相关数据2!";
                            return null;
                        }

                        return dt;
                    }
                    catch (Exception ex)
                    {
                        message = "3:读取数据失败!" + ex.Message;
                        return null;
                    }
                    finally
                    {
                        oraDap.Dispose();
                        ds.Dispose();
                    }
                }
                catch (Exception ex)
                {
                    message = "4:查询异常!" + ex.Message;
                    return null;
                }
                finally
                {
                    if (connection != null)
                    {
                        connection.Close();
                        connection = null;
                    }
                }
            }
            catch (Exception ex)
            {
                message = "5:与WMS连接错误!" + ex.Message;
                return null;
            }
        }

        public DataTable ExecuteDataSet(string commandText, CommandType commandType, MySqlParameter[] parameters, out string message)
        {
            MySqlConnectionHolder connection = null;
            DataTable dt = null;
            try
            {
                connection = new MySqlConnectionHolder(this._sqlConnectionString);
                MySqlCommand command = null;
                try
                {
                    command = new MySqlCommand();
                    command.Connection = connection.Connection;
                    command.CommandText = commandText;
                    command.CommandType = commandType;
                    AddParameter(command, parameters);

                    MySqlDataAdapter sqlDap = new MySqlDataAdapter();
                    sqlDap.SelectCommand = command;

                    DataSet ds = new DataSet();
                    try
                    {
                        sqlDap.Fill(ds);
                        dt = ds.Tables[0];
                        message = "";
                    }
                    catch (Exception ex)
                    {
                        message = ex.Message;
                    }
                    finally
                    {
                        ds.Dispose();
                        sqlDap.Dispose();
                    }
                }
                finally
                {
                    command.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                message = "与数据库连接错误!" + ex.Message;
            }
            finally
            {
                if (connection != null)
                {
                    connection.Close();
                    connection = null;
                }
            }
            return dt;
        }


        /// <summary>
        /// 添加SQL参数
        /// </summary>
        /// <param name="sqlCommand"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        private int AddParameter(MySqlCommand sqlCommand, MySqlParameter[] parameters)
        {
            int i = 1;
            if (parameters == null || parameters.Length <= 0)
                return i;
            foreach (MySqlParameter p in parameters)
                sqlCommand.Parameters.Add(p);
            return i;
        }
    }
}
