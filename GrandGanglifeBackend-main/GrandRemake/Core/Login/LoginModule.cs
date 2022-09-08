using GTANetworkAPI;
using System;
using System.Text.RegularExpressions;
using GrandRP.Handlers;
using GrandRP;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace GrandRP.Handlers.Login
{
    class LoginModule : Script
    {
        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStart()
        {
            System.SendConsoleMessage("Login Module geladen.");
        }

        [RemoteEvent("sendDataToServer")]
        public void LoginServerUser(Player player, string username, string password, bool state)
        {
            if(Database.HasAccount(player) == true)
            {  
                player.ResetData("player");
                player.Name = username;
                LoadPlayerModule.LoadPlayer(player, password);
            }
            else
            {
                player.TriggerEvent("Login_Error", "Ein Account mit deinem SocialClub Konto konnte nicht gefunden werden!");
                return;
            }
        }

        [RemoteEvent("CharCreatedFinshed")]
        public void CharCreatedFinshed(Player player, int gender, string parents, string facedata, string row_item2, string row_item3)
        {
            string newfacedata1 = facedata.Replace("[", "");
            string newfacedata2 = newfacedata1.Replace("]", "");
            string newfacedata3 = newfacedata2.Replace(",", " ");
            string[] array = newfacedata3.Split(" ");

            Console.WriteLine(parents);
           
            DbPlayer dbPlayer = player.GetPlayer();
            if (dbPlayer == null)
            {
                Console.WriteLine("Null - DbPlayer");
            }

            Parents playerCharParents = JsonConvert.DeserializeObject<Parents>(parents);
            customization playerCharacterNew = JsonConvert.DeserializeObject<customization>(row_item2);

            int gendernew = 1;
            if(gender == 0)
            {
                gendernew = 1;
            }
            else if(gender == 1)
            {
                gendernew = 0;
            }



            customization custom = new customization
            {
                Gender = gendernew,
                Parents = playerCharParents,
                localbeard = playerCharacterNew.localbeard,
                localeyebrows = playerCharacterNew.localeyebrows,
                localeyecolor = playerCharacterNew.localeyecolor,
                localhairstyle = playerCharacterNew.localhairstyle,
                localhaircolor = playerCharacterNew.localhaircolor,
                localmakeup = playerCharacterNew.localmakeup,
                localblush = playerCharacterNew.localblush,
                locallipstick = playerCharacterNew.locallipstick,
                localblushcolor = playerCharacterNew.localblushcolor,
                locallipstickcolor = playerCharacterNew.locallipstickcolor,
                localmoles = playerCharacterNew.localmoles,
                localchesthair = playerCharacterNew.localchesthair,
            };
            if(array[0] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[0], out x);

                if (x2)
                    custom.zero = x;
            }
            if (array[1] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[1], out x);

                if (x2)
                    custom.one = x;
            }
            if (array[2] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[2], out x);

                if (x2)
                    custom.two = x;
            }
            if (array[3] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[3], out x);

                if (x2)
                    custom.three = x;
            }
            if (array[4] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[4], out x);

                if (x2)
                    custom.four = x;
            }
            if (array[5] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[5], out x);

                if (x2)
                    custom.five = x;
            }
            if (array[6] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[6], out x);

                if (x2)
                    custom.six = x;
            }
            if (array[7] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[7], out x);

                if (x2)
                    custom.seven = x;
            }
            if (array[8] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[8], out x);

                if (x2)
                    custom.eight = x;
            }
            if (array[9] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[9], out x);

                if (x2)
                    custom.nine = x;
            }
            if (array[10] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[10], out x);

                if (x2)
                    custom.ten = x;
            }
            if (array[11] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[11], out x);

                if (x2)
                    custom.eleven = x;
            }
            if (array[12] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[12], out x);

                if (x2)
                    custom.twelve = x;
            }
            if (array[13] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[13], out x);

                if (x2)
                    custom.thirteen = x;
            }
            if (array[14] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[14], out x);

                if (x2)
                    custom.fourteen = x;
            }

            if (array[15] != "null")
            {
                float x = 1;
                float y = 0;
                float z = 0;

                bool x2 = float.TryParse(array[15], out x);

                if (x2)
                    custom.fifteen = x;
            }
            if (array[16] != "null")
            {
                float x = 1;

                bool x2 = float.TryParse(array[16], out x);

                if (x2)
                    custom.sixteen = x;
            }
            if (array[17] != "null")
            {
                float x = 1;


                bool x2 = float.TryParse(array[17], out x);

                if (x2)
                    custom.seventeen = x;
            }
            if (array[18] != "null")
            {
                float x = 1;

                bool x2 = float.TryParse(array[18], out x);

                if (x2)
                    custom.eightteen = x;
            }
            if (array[19] != "null")
            {
                float x = 1;

                bool x2 = float.TryParse(array[19], out x);

                if (x2)
                    custom.nineteen = x;
            }
            CustomizeModel model = new CustomizeModel
            {
                customization = custom,
                level = 0
            };
            LoadPlayerModule.SaveCustomization(model, dbPlayer);



            clothobject Clothes = JsonConvert.DeserializeObject<clothobject>(row_item3);
            clothobject clothobj = new clothobject
            {
                localshirts = Clothes.localshirts,
                localjeans = Clothes.localjeans,
                localboots = Clothes.localboots
            };
            LoadPlayerModule.SaveClothing(clothobj, dbPlayer);

            dbPlayer.Player.Position = new Vector3(-1037.8242, -2737.6765, 20.169294);
            dbPlayer.Player.Rotation = new Vector3(0,0, -39.94047);
            dbPlayer.Player.Dimension = 0;
            player.SetSharedData("InLogin", false);
            dbPlayer.IsNew = 0;
            Database.SetAttribute(dbPlayer, "IsNew", 0);
            dbPlayer.Player.TriggerEvent("LoadHud", dbPlayer.Id, dbPlayer.Money, dbPlayer.Bank, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Year);
            dbPlayer.Player.TriggerEvent("Client_ShowNotification", "Du hast dein Charakter erfolgreich erstellt!", 25);
        }


        [RemoteEvent("SendDataToRegisterServer")]
        public void SendDataToRegisterServer(Player player, string user, string pass, string email, string promo, bool state, string name, string surname)
        {
            ConnectionObject connection = ChatModule.ConnectionList.Find(x => x.SocialClubName == player.SocialClubName);
            Database.CreatePlayerAccount(player, user, pass, email, promo, connection.IP, connection.HWID);
            player.TriggerEvent("Client_ToLoginFromReg");
        }

        [RemoteEvent("CheckEmailRegisterServer")]
        public void registerstep2(Player player)
        {
            player.TriggerEvent("RegNextStep", 1);
        }
        [RemoteEvent("CheckNameRegisterServer")]
        public void registerstep3(Player player)
        {
            player.TriggerEvent("RegNextStep2", 1);
        }
    }
}