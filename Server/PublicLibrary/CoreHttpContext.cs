using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicLibrary
{
    public static class CoreHttpContext
    {
        [Obsolete]
        private static Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostEnviroment;

        [Obsolete]
        public static string WebPath => _hostEnviroment.WebRootPath;

        [Obsolete]
        public static string MapPath(string path)
        {
            return Path.Combine(_hostEnviroment.WebRootPath, path);
        }

        [Obsolete]
        internal static void Configure(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostEnviroment)
        {
            _hostEnviroment = hostEnviroment;
        }
    }
    public static class StaticHostEnviromentExtensions
    {
        [Obsolete]
        public static IApplicationBuilder UseStaticHostEnviroment(this IApplicationBuilder app)
        {
            var webHostEnvironment = app.ApplicationServices.GetRequiredService<Microsoft.AspNetCore.Hosting.IHostingEnvironment>();
            CoreHttpContext.Configure(webHostEnvironment);
            return app;
        }
    }
}
