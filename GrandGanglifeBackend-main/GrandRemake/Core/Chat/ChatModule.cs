using System;
using System.Collections.Generic;
using GTANetworkAPI;

namespace GrandRP
{
    class ChatModule : Script
    {
        public static List<CommandObject> CommandList = new List<CommandObject>();
        public static List<ConnectionObject> ConnectionList = new List<ConnectionObject>();
        public static void LoadCommands()
        {
            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                  
                dbPlayer.Player.TriggerEvent("Client_ChangeFamState", true);
            }, "famchat", 0, 0,""));


            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                dbPlayer.Player.TriggerEvent("GrandGanglife:Client:OpenCase", dbPlayer.GrandPoints, dbPlayer.GrandCoins, dbPlayer.Money, 0, 0, 0);
            }, "opencase", 0, 0, ""));

            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                    if (!dbPlayer.Player.HasSharedData("AdminDuty"))
                {
                    dbPlayer.Player.SetSharedData("AdminDuty", false);
                }
                bool state = dbPlayer.Player.GetSharedData<bool>("AdminDuty");
                    if(state == true)
                    {
                        dbPlayer.Player.SetSharedData("AdminDuty", false);
                        dbPlayer.Player.TriggerEvent("Client_SwitchReportStatus", false);
                    dbPlayer.Player.TriggerEvent("SetAduty", false);
                }
                    else
                    {
                        dbPlayer.Player.SetSharedData("AdminDuty", true);
                        dbPlayer.Player.TriggerEvent("Client_SwitchReportStatus", true);
                    dbPlayer.Player.TriggerEvent("SetAduty", true);
                }
            }, "admin", 1, 0, ""));


            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                dbPlayer.Player.TriggerEvent("Client_ShowNotification", "test", 25);
            }, "testnotify", 0, 0, ""));

            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                dbPlayer.Player.TriggerEvent("Client_Left_Notification", "test", "test2", 0);
            }, "testnotify2", 0, 0, ""));



            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                dbPlayer.Player.TriggerEvent("Client_Event_Notify", "test");
            }, "testnotify3", 0, 0, ""));

            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                dbPlayer.Player.TriggerEvent("Client_Theft_Notify", "test", "test2");
            }, "testnotify4", 0, 0, ""));
            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                dbPlayer.Player.TriggerEvent("Client_Left_Notification", "test", "test2", 1);
            }, "testnotify5", 0, 0, ""));

            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                Console.WriteLine(NAPI.Util.ToJson(dbPlayer.Player.Position) + " Rot: " + dbPlayer.Player.Rotation);
            }, "pos", 1, 0, ""));


            CommandList.Add(new CommandObject((dbPlayer, args) =>
            {
                float x = 0;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(args[1], out x);
                bool y2 = float.TryParse(args[2], out y);
                bool z2 = float.TryParse(args[3], out z);
                if (!x2 || !y2 || !z2) return;

                dbPlayer.Player.Position = new Vector3(x, y, z);
            }, "coord", 1, 0, "x y z"));


        }



        [RemoteEvent("ServerSendMessage")]
        public void ServerSendMessage(Player player, string input, int sendcheck)
        {
            try
            {
                if (player == null) return;
                DbPlayer dbPlayer = player.GetPlayer();
                if (dbPlayer == null)
                    return;

                if (input == "" && input == " ")
                {
                    return;
                }
                string[] array = input.Split(" ");

                if (!input.Contains("/"))
                {
                    if(sendcheck == 1)
                    {
                        player.TriggerEvent("SendMessage", input, dbPlayer.Username.Replace("_", " ")+":", "nonrp", "test");
                    }
                    else if(sendcheck == 0)
                    {
                        player.TriggerEvent("SendMessage", input, dbPlayer.Username.Replace("_", " ") + " sagte:", "rp", "test");
                    }
                    else if (sendcheck == 12)
                    {
                        player.TriggerEvent("SendFamMessage", input, dbPlayer.Username.Replace("_", " ") + " sagte:", "Boss", 9, 1);
                    }
                    return;
                }

                foreach (CommandObject command in CommandList)
                {
                    if (array[0].Replace("/", "") == command.Name)
                    {

                        if (dbPlayer.AdminRank < command.Permission)
                        {
                              dbPlayer.Player.TriggerEvent("Client_ShowNotification", "Du hast nicht genug Rechte!", 6);
                              return;
                        }
                        if (array.Length <= command.Args)
                        {
                            dbPlayer.Player.TriggerEvent("Client_ShowNotification", "Benutze: " + command.ArgText, 6);
                            return;
                        }

                        command.Callback(dbPlayer, array);

                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

        }
    }
}
