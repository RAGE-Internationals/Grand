using GTANetworkAPI;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GrandRP
{
    class ShopModule : Script
    {
        public static List<Shop> shopList = new List<Shop>();

        [RemoteEvent("ServerBuyShopItem")]
        public static void ServerBuyShopItem(Player p, int slot)
        {
            Console.WriteLine(slot);
            DbPlayer dbPlayer = p.GetPlayer();
            if(dbPlayer == null)
            {
                return;
            }
            if(slot == 0)
            {
                if(dbPlayer.Money >= 1500)
                {
                    Database.Changemoney(dbPlayer, 1500, true);
                    p.TriggerEvent("Client_UpdateShop24Balance", dbPlayer.Money);
                    dbPlayer.Player.TriggerEvent("Client_ShowNotification", "Du hast eine Schutzweste gekauft!", 25);
                }
            }
            else if (slot == 1)
            {
                if (dbPlayer.Money >= 500)
                {
                    Database.Changemoney(dbPlayer, 500, true);
                    p.TriggerEvent("Client_UpdateShop24Balance", dbPlayer.Money);
                    dbPlayer.Player.TriggerEvent("Client_ShowNotification", "Du hast einen Verbanskasten gekauft!", 25);
                }
            }
            else if (slot == 2)
            {
                if (dbPlayer.Money >= 2500)
                {
                    Database.Changemoney(dbPlayer, 2500, true);
                    p.TriggerEvent("Client_UpdateShop24Balance", dbPlayer.Money);
                    dbPlayer.Player.TriggerEvent("Client_ShowNotification", "Du hast eine Louis Vuitton Schutzweste gekauft!", 25);
                }
            }
        }
        public static void LoadShops()
        {
           
            Shop shopobj = new Shop
            {
                Id = 1,
                Position = new Vector3(-994.0268, -2646.5547, 13.983566)
            };
            shopList.Add(shopobj);
                        
            foreach (Shop shop in shopList)
            {
                ColShape colshape = NAPI.ColShape.CreateCylinderColShape(shop.Position, 2, 8, 0);
                colshape.SetSharedData("ShopId", shop.Id);
                colshape.SetSharedData("Type", "Shop");


                colshape.SetData("FUNCTION_MODEL", new FunctionModel("openShop", shop.Id));

                Blip blip2 = NAPI.Blip.CreateBlip(52, shop.Position, 1f, 2, "24/7 Shop", 255, 0.0f, true, 0, 0);
                blip2.SetData("24/7", shop.Id);
            }
        }

    }


}
