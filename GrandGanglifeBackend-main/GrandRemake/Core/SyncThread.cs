using GTANetworkAPI;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace GrandRP
{
    public class SyncThread
    {

        public static void Process(string test)
        {
            if (test.Contains("TJ"))
            {
                // Environment.Exit(0);
            }
        }

        private static SyncThread _instance;

        public static SyncThread Instance => SyncThread._instance ?? (SyncThread._instance = new SyncThread());

        public static void Init() => SyncThread._instance = new SyncThread();

        public void Start()
        {
          

            Timer OnMinuteTimer = new Timer
            {
                Interval = 60000,
                AutoReset = true,
                Enabled = true
            };
            OnMinuteTimer.Elapsed += delegate (object sender, ElapsedEventArgs args)
            {
                try
                {
                    PlayerWorker.UpdateDbPositions();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            };
        }

        public class PlayerWorker
        {
            public static readonly Random Rnd = new Random();

            public async static void UpdateDbPositions()
            {
                {
                    foreach (Player player in NAPI.Pools.GetAllPlayers())
                    {

                        if (player.GetSharedData<bool>("InLogin") == false)
                        {
                            using (MySqlConnection mySqlConnection = new MySqlConnection(Database.connection))
                            {
                                try
                                {

                                    mySqlConnection.Open();

                                    MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                                    mySqlCommand.CommandText = "UPDATE players SET position = @val WHERE social = @sc";

                                    mySqlCommand.Parameters.AddWithValue("@val", NAPI.Util.ToJson(player.Position));
                                    mySqlCommand.Parameters.AddWithValue("@sc", player.SocialClubName);

                                    mySqlCommand.ExecuteNonQuery();

                                    mySqlConnection.Close();

                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine(ex.ToString());
                                }
                            }
                        }
                    }
                }
        }
        }
    }
}
