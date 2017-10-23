using AdventureWorks.Hubs;
using AdventureWorks.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace AdventureWorks.Repository
{
    public class MessagesRepository
    {
        readonly string _connString = ConfigurationManager.ConnectionStrings["AdventureWorks"].ConnectionString;

        public static object reportSync = new object();
        public static List<ReportViewModel> CachedData = null;

        public IEnumerable<ReportViewModel> GetAllMessages()
        {
            lock (reportSync)
            {
                if (CachedData != null)
                {
                    return CachedData;
                }
                var messages = new List<ReportViewModel>();
                using (var connection = new SqlConnection(_connString))
                {
                    connection.Open();
                    // https://technet.microsoft.com/en-us/library/ms181122(v=sql.105).aspx
                    using (var command = new SqlCommand(
                        @"select shipmethod, COUNT_BIG(*) as total from dbo.orders group by shipmethod", connection))
                    {

                        command.Notification = null;
                        var dependency = new SqlDependency(command);
                        dependency.OnChange += (sender, e) =>
                        {
                            if (e.Type == SqlNotificationType.Change)
                            {
                                lock (reportSync)
                                {
                                    CachedData = null; // First clear the cache
                                    CachedData = this.GetAllMessages().ToList();
                                    IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
                                    context.Clients.All.updateMessages(CachedData);
                                }
                            }
                        };

                        if (connection.State == ConnectionState.Closed)
                            connection.Open();

                        var reader = command.ExecuteReader();

                        while (reader.Read())
                        {
                            messages.Add(item: new ReportViewModel { y = Convert.ToInt32(reader[1]), x = (string)reader[0] });
                        }
                        CachedData = messages;
                    }
                }
                return messages;
            }
        }
    }
}