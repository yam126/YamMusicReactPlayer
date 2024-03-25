using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.MySQLProvider
{
    public class MySqlConnectionHolder
    {
        internal MySqlConnection _connection;
        private bool _opened = false;

        public MySqlConnection Connection
        {
            get { return _connection; }
        }

        internal MySqlConnectionHolder(string connectionString)
        {
            try
            {
                _connection = new MySqlConnection(connectionString);
                if (_connection.State == ConnectionState.Closed)
                    _connection.Open();
            }
            catch (ArgumentException e)
            {
                throw new ArgumentException("OracleError_Connection_String", "connectionString", e);
            }
        }

        public void Close()
        {
            if (_connection.State == ConnectionState.Closed)
                return;
            _connection.Close();
        }
    }
}
