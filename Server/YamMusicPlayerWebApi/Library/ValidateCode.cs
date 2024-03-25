using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.Fonts;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Drawing.Processing;
namespace YamMusicPlayerWebApi.Library
{
    public class ValidateCode
    {
        private static readonly Color[] Colors = { Color.Black, Color.Red, Color.Blue, Color.Green, Color.Orange, Color.Brown,
        Color.Brown,Color.DarkBlue};
        private static readonly char[] Chars = { '2','3','4','5','6','8','9',
       'A','B','C','D','E','F','G','H','J','K', 'L','M','N','P','R','S','T','W','X','Y' };
        //private static readonly int Width = 90;
        //private static readonly int Height = 35;

        private static string GenCode(int num)
        {
            var code = string.Empty;
            var r = new Random();

            for (int i = 0; i < num; i++)
            {
                code += Chars[r.Next(Chars.Length)].ToString();
            }

            return code;
        }

        public static (string code, byte[] bytes) CreateValidateGraphic(int CodeLength, int Width, int Height, int FontSize)
        {
            var code = GenCode(CodeLength);
            var r = new Random();
            using var image = new Image<Rgba32>(Width, Height);
            // 字体
            var font = SystemFonts.CreateFont(SystemFonts.Families.First().Name, FontSize, FontStyle.Bold);
            image.Mutate(ctx =>
            {
                // 白底背景
                ctx.Fill(Color.White);

                // 画验证码
                for (int i = 0; i < code.Length; i++)
                {
                    ctx.DrawText(code[i].ToString()
                        , font
                        , Colors[r.Next(Colors.Length)]
                        , new PointF(20 * i + 10, r.Next(2, 12)));
                }

                // 画干扰线
                for (int i = 0; i < 6; i++)
                {
                    var pen = new SolidPen(Colors[r.Next(Colors.Length)], 1);
                    var p1 = new PointF(r.Next(Width), r.Next(Height));
                    var p2 = new PointF(r.Next(Width), r.Next(Height));

                    ctx.DrawLine(pen, p1, p2);
                }

                // 画噪点
                for (int i = 0; i < 60; i++)
                {
                    var pen = new SolidPen(Colors[r.Next(Colors.Length)], 1);
                    var p1 = new PointF(r.Next(Width), r.Next(Height));
                    var p2 = new PointF(p1.X + 1f, p1.Y + 1f);

                    ctx.DrawLine(pen, p1, p2);
                }
            });
            using var ms = new System.IO.MemoryStream();

            //  格式 自定义
            image.SaveAsPng(ms);
            return (code, ms.ToArray());
        }
    }
}
