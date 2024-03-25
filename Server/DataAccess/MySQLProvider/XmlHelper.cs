using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml;

namespace DataAccess.MySQLProvider
{
    public class XmlHelper
    {
        #region 增、删、改操作==============================================

        /// <summary>
        /// 追加节点
        /// </summary>
        /// <param name="filePath">XML文档绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <param name="xmlNode">XmlNode节点</param>
        /// <returns></returns>
        public static bool AppendChild(string filePath, string xPath, XmlNode xmlNode)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                XmlNode xn = doc.SelectSingleNode(xPath);
                XmlNode n = doc.ImportNode(xmlNode, true);
                xn.AppendChild(n);
                doc.Save(filePath);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 从XML文档中读取节点追加到另一个XML文档中
        /// </summary>
        /// <param name="filePath">需要读取的XML文档绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <param name="toFilePath">被追加节点的XML文档绝对路径</param>
        /// <param name="toXPath">范例: @"Skill/First/SkillItem"</param>
        /// <returns></returns>
        public static bool AppendChild(string filePath, string xPath, string toFilePath, string toXPath)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(toFilePath);
                XmlNode xn = doc.SelectSingleNode(toXPath);

                XmlNodeList xnList = ReadNodes(filePath, xPath);
                if (xnList != null)
                {
                    foreach (XmlElement xe in xnList)
                    {
                        XmlNode n = doc.ImportNode(xe, true);
                        xn.AppendChild(n);
                    }
                    doc.Save(toFilePath);
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 修改节点的InnerText的值
        /// </summary>
        /// <param name="filePath">XML文件绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <param name="value">节点的值</param>
        /// <returns></returns>
        public static bool UpdateNodeInnerText(string filePath, string xPath, string value)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                XmlNode xn = doc.SelectSingleNode(xPath);
                XmlElement xe = (XmlElement)xn;
                xe.InnerText = value;
                doc.Save(filePath);
            }
            catch
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// 读取XML文档
        /// </summary>
        /// <param name="filePath">XML文件绝对路径</param>
        /// <returns></returns>
        public static XmlDocument LoadXmlDoc(string filePath)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                return doc;
            }
            catch
            {
                return null;
            }
        }
        #endregion 增、删、改操作

        #region 扩展方法===================================================

        /// <summary>
        /// 读取XML的所有子节点
        /// </summary>
        /// <param name="filePath">XML文件绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <returns></returns>
        public static XmlNodeList ReadSelectNodes(string filePath, string xPath)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                XmlNodeList xnList = doc.SelectNodes(xPath);  //得到该节点的子节点
                return xnList;
            }
            catch (Exception exp)
            {
                return null;
            }
        }
        /// <summary>
        /// 读取XML的所有子节点
        /// </summary>
        /// <param name="filePath">XML文件绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <returns></returns>
        public static XmlNodeList ReadNodes(string filePath, string xPath)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                XmlNode xn = doc.SelectSingleNode(xPath);
                XmlNodeList xnList = xn.ChildNodes;  //得到该节点的子节点
                return xnList;
            }
            catch (Exception exp)
            {
                return null;
            }
        }

        /// <summary>
        /// 读取XML的所有子节点
        /// </summary>
        /// <param name="filePath">XML文件绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <returns></returns>
        public static XmlNode ReadXmlNode(string filePath, string xPath)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                XmlNode xn = doc.SelectSingleNode(xPath);
                return xn;
            }
            catch (Exception exp)
            {
                return null;
            }
        }

        /// <summary>
        /// 读取XML根节点下的的所有子节点
        /// </summary>
        /// <param name="filePath">XML文件绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <returns></returns>
        public static XmlNodeList ReadRootChildNodes(string filePath)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                XmlNodeList xnList = doc.DocumentElement.ChildNodes;  //得到该节点的子节点
                return xnList;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// 根据节点名和节点值获取父节点(递归)
        /// </summary>
        /// <param name="root">根节点</param>
        /// <param name="NodeName">节点名</param>
        /// <param name="NodeValue">节点值</param>
        /// <returns></returns>
        public static XmlNode ReadParentNode(XmlNode root, string NodeName, string NodeValue)
        {
            XmlNode result = null;
            if (root == null)
                return null;
            if (root.ChildNodes == null || root.ChildNodes.Count == 0)
            {
                if (root.LocalName.Equals(NodeName) && root.Value.Equals(NodeValue))
                    return root.ParentNode == null ? null : root.ParentNode;
                else
                    return null;
            }
            if (root.LocalName.Equals(NodeName) &&
                !string.IsNullOrEmpty(root.InnerText) &&
                root.InnerText.Equals(NodeValue))
                return root.ParentNode == null ? null : root.ParentNode;
            foreach (XmlNode itemNode in root.ChildNodes)
            {
                result = ReadParentNode(itemNode, NodeName, NodeValue);
                if (result != null)
                    break;
            }
            return result;
        }

        /// <summary>
        /// 读取XML的所有子节点
        /// </summary>
        /// <param name="filePath">XML文件绝对路径</param>
        /// <param name="xPath">范例: @"Skill/First/SkillItem"</param>
        /// <returns></returns>
        public static XmlNode ReadNode(XmlNode root, string XmlNodeName)
        {
            if (root.ChildNodes == null || root.ChildNodes.Count == 0)
                return null;
            foreach (XmlNode child in root.ChildNodes)
            {
                if (child.LocalName.Equals(XmlNodeName) || child.Name.Equals(XmlNodeName))
                    return child;
            }
            return null;
        }

        /// <summary>
        /// 递归获得指定名称的节点
        /// </summary>
        /// <param name="root">根节点</param>
        /// <param name="XmlNodeName">节点名</param>
        /// <returns>节点集合</returns>
        public static List<XmlNode> ReadNodeByNodeName(XmlNode root, string XmlNodeName)
        {
            List<XmlNode> result = new List<XmlNode>();
            if (root.LocalName.Equals(XmlNodeName) || root.Name.Equals(XmlNodeName))
                result.Add(root);
            if (root.ChildNodes != null && root.ChildNodes.Count != 0)
            {
                foreach (XmlNode itemNode in root.ChildNodes)
                {
                    List<XmlNode> tempList = ReadNodeByNodeName(itemNode, XmlNodeName);
                    if (tempList.Count != 0)
                        result.AddRange(tempList);
                }
            }
            return result;

        }
        /// <summary>
        /// 获得指定Xml元素的文本
        /// </summary>
        /// <param name="XElementName">元素名</param>
        /// <param name="XMLString">xml字符串</param>
        /// <returns>元素文本</returns>
        public static string getXElementText(string XElementName, string XMLString)
        {
            if (string.IsNullOrEmpty(XMLString))
                return String.Empty;
            XElement root = XElement.Parse(XMLString, LoadOptions.PreserveWhitespace);
            return getXElementText(XElementName, root.Elements());
        }

        /// <summary>
        /// 获得指定文件的根节点
        /// </summary>
        /// <param name="XmlFilePath">Xml文件路径</param>
        /// <returns>根节点</returns>
        public static XmlNode getRootNode(string XmlFilePath)
        {
            if (string.IsNullOrEmpty(XmlFilePath))
                return null;
            if (!System.IO.File.Exists(XmlFilePath))
                return null;
            XmlDocument xdoc = new XmlDocument();
            xdoc.Load(XmlFilePath);
            return xdoc.DocumentElement;
        }

        /// <summary>
        /// 获得指定Xml元素的文本（递归查找)
        /// </summary>
        /// <param name="XElementName">元素名</param>
        /// <param name="XML子元素列表">xml字符串</param>
        /// <returns>元素文本</returns>
        public static string getXElementText(string XElementName, IEnumerable<XElement> xelems)
        {
            string result = String.Empty;
            foreach (XElement xelem in xelems)
            {
                if (xelem.Name.LocalName.Equals(XElementName))
                {
                    result = xelem.Value;
                    break;
                }
                else if (!xelem.Name.Equals(XElementName) && xelem.HasElements)
                {
                    result = getXElementText(XElementName, xelem.Elements());
                    if (!string.IsNullOrEmpty(result))
                        break;
                }
            }
            return result;
        }

        /// <summary>
        /// 判断xml节点是否为空(包括节点值)
        /// </summary>
        /// <param name="node">节点</param>
        /// <returns>是否为空</returns>
        public static bool isEmptyXmlNode(XmlNode node)
        {
            if (node == null)
                return true;
            else if (string.IsNullOrEmpty(node.InnerText)
                && string.IsNullOrEmpty(node.Value)
                )
                return true;
            return false;
        }
        #endregion 扩展方法
    }
}
