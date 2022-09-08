using GrandRP.Handlers.Login;
using GTANetworkAPI;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace GrandRP
{
    class Database : Script
    {
        public static string connection = "SERVER=localhost; DATABASE=grandganglife; UID=root; PASSWORD=Keksi09!!";

        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStart()
        {
            System.SendConsoleMessage("Datenbank Module geladen.");
        }

        public static void CreatePlayerAccount(Player player, string user, string pass, string email, string promo,string ip, string hwid)
        {
            int id = 0;
            using (MySqlConnection mySqlConnection = new MySqlConnection(connection))
            {
                try
                {
                    mySqlConnection.Open();

                    MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                    mySqlCommand.CommandText = "SELECT MAX(id) as maxId FROM players";
                    using (MySqlDataReader mySqlDataReader = mySqlCommand.ExecuteReader())
                    {
                        if (mySqlDataReader.HasRows)
                        {
                            mySqlDataReader.Read();
                            id = mySqlDataReader.GetInt32("maxId") + 1;
                        }
                    }

                    mySqlCommand.ExecuteNonQuery();

                    mySqlConnection.Close();

                }
                catch (Exception e)
                {
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.Message}");
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.StackTrace}");
                }
            }


            using (MySqlConnection mySqlConnection = new MySqlConnection(connection))
            {
                try
                {
                    mySqlConnection.Open();

                    MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                    mySqlCommand.CommandText = "INSERT INTO players (id,username, password, email, promo, social, hwid, ip) VALUES (@id,@username, @password, @email, @promo, @social, @hwid, @ip)";

                    mySqlCommand.Parameters.AddWithValue("@id", id);
                    mySqlCommand.Parameters.AddWithValue("@username", user);
                    mySqlCommand.Parameters.AddWithValue("@password", pass);
                    mySqlCommand.Parameters.AddWithValue("@email", email);
                    mySqlCommand.Parameters.AddWithValue("@promo", promo);
                    mySqlCommand.Parameters.AddWithValue("@social", player.SocialClubName);
                    mySqlCommand.Parameters.AddWithValue("@hwid", hwid);
                    mySqlCommand.Parameters.AddWithValue("@ip", ip);

                    mySqlCommand.ExecuteNonQuery();

                    mySqlConnection.Close();

                }
                catch (Exception e)
                {
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.Message}");
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.StackTrace}");
                }
            }
        }


        public static void SetAttribute(DbPlayer dbPlayer, string attribute, object val)
        {
            using (MySqlConnection mySqlConnection = new MySqlConnection(connection))
            {
                try
                {
                    mySqlConnection.Open();

                    MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                    mySqlCommand.CommandText = "UPDATE players SET " + attribute + " = @val WHERE id = @id";
                 
                    mySqlCommand.Parameters.AddWithValue("@val", val);
                    mySqlCommand.Parameters.AddWithValue("@id", dbPlayer.Id);

                    mySqlCommand.ExecuteNonQuery();

                    mySqlConnection.Close();

                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }

        public static void Changemoney(DbPlayer dbPlayer, int count, bool remove)
        {
            using (MySqlConnection mySqlConnection = new MySqlConnection(connection))
            {
                try
                {
                    mySqlConnection.Open();

                    MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                    mySqlCommand.CommandText = "UPDATE players SET money = @val WHERE id = @id";

                    if(remove)
                    {
                        mySqlCommand.Parameters.AddWithValue("@val", dbPlayer.Money - count);
                        dbPlayer.Money = dbPlayer.Money - count;
                    }
                    else
                    {
                        mySqlCommand.Parameters.AddWithValue("@val", dbPlayer.Money + count);
                        dbPlayer.Money = dbPlayer.Money + count;
                    }
                    mySqlCommand.Parameters.AddWithValue("@id", dbPlayer.Id);

                    mySqlCommand.ExecuteNonQuery();

                    mySqlConnection.Close();

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }

        public static bool HasAccount(Player player)
         {
             using (MySqlConnection mySqlConnection = new MySqlConnection(connection))
             {
                 mySqlConnection.Open();

                 MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                 mySqlCommand.CommandText = "SELECT social FROM players WHERE social=@social";

                 mySqlCommand.Parameters.AddWithValue("@social", player.SocialClubName);

                 using (MySqlDataReader mySqlDataReader = mySqlCommand.ExecuteReader())
                 {
                     if (mySqlDataReader.HasRows)
                     {
                         return true;
                     }
                 }
             }
             return false;
         }

     
    }
}
